package com.creatorx.domain.creator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.creatorx.domain.creator.dto.CreatorProfileResponse;
import com.creatorx.domain.creator.dto.KycSubmissionRequest;
import com.creatorx.domain.creator.dto.SocialAccountRequest;
import com.creatorx.domain.creator.dto.UpdateProfileRequest;
import com.creatorx.domain.notification.Notification;
import com.creatorx.domain.notification.NotificationRepository;
import com.creatorx.domain.user.User;
import com.creatorx.domain.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class CreatorServiceTest {

    @Mock
    private CreatorProfileRepository creatorProfileRepository;

    @Mock
    private SocialAccountRepository socialAccountRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private CreatorMapper creatorMapper;

    private CreatorService creatorService;

    @BeforeEach
    void setUp() {
        creatorService = new CreatorService(
            creatorProfileRepository,
            socialAccountRepository,
            userRepository,
            notificationRepository,
            creatorMapper,
            new ObjectMapper()
        );
        ReflectionTestUtils.setField(creatorService, "supabaseUrl", "https://creatorx.supabase.co");
    }

    @Test
    void updateProfileWithPartialFieldsOnlyUpdatesProvidedFields() {
        UUID creatorId = UUID.randomUUID();
        CreatorProfile profile = profile(creatorId);
        profile.setBio("Old bio");
        profile.setPrimaryPlatform(CreatorProfile.Platform.INSTAGRAM);
        profile.setTargetBudgetMin(new BigDecimal("1000.00"));
        profile.setTargetBudgetMax(new BigDecimal("5000.00"));

        when(creatorProfileRepository.findByUserId(creatorId)).thenReturn(Optional.of(profile));
        when(userRepository.findById(creatorId)).thenReturn(Optional.of(user(creatorId, User.UserType.CREATOR)));
        when(creatorProfileRepository.save(any(CreatorProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(socialAccountRepository.findByCreatorIdOrderByPlatformAsc(creatorId)).thenReturn(List.of());
        when(creatorMapper.toResponse(any(CreatorProfile.class), any())).thenReturn(response(profile));

        creatorService.updateProfile(
            creatorId,
            new UpdateProfileRequest("Updated Name", null, List.of("Fashion", "Lifestyle"), null, null, null, null, null)
        );

        ArgumentCaptor<CreatorProfile> captor = ArgumentCaptor.forClass(CreatorProfile.class);
        verify(creatorProfileRepository).save(captor.capture());
        CreatorProfile saved = captor.getValue();
        assertThat(saved.getDisplayName()).isEqualTo("Updated Name");
        assertThat(saved.getBio()).isEqualTo("Old bio");
        assertThat(saved.getPrimaryPlatform()).isEqualTo(CreatorProfile.Platform.INSTAGRAM);
        assertThat(saved.getTargetBudgetMin()).isEqualByComparingTo("1000.00");
        assertThat(saved.getTargetBudgetMax()).isEqualByComparingTo("5000.00");
        assertThat(saved.getNicheCategories()).isEqualTo("[\"Fashion\",\"Lifestyle\"]");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void submitKycSetsPendingStatusAndCreatesAdminNotification() {
        UUID creatorId = UUID.randomUUID();
        UUID adminId = UUID.randomUUID();
        CreatorProfile profile = profile(creatorId);
        profile.setDisplayName("Maya Creator");
        profile.setKycStatus(CreatorProfile.KycStatus.APPROVED);

        when(creatorProfileRepository.findByUserId(creatorId)).thenReturn(Optional.of(profile));
        when(creatorProfileRepository.save(any(CreatorProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.findByUserType(User.UserType.ADMIN)).thenReturn(List.of(user(adminId, User.UserType.ADMIN)));
        when(notificationRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var response = creatorService.submitKyc(
            creatorId,
            new KycSubmissionRequest(
                "https://creatorx.supabase.co/storage/v1/object/kyc/id-front.jpg",
                "https://creatorx.supabase.co/storage/v1/object/kyc/id-back.jpg",
                "https://creatorx.supabase.co/storage/v1/object/kyc/selfie.jpg"
            )
        );

        assertThat(response.kycStatus()).isEqualTo(CreatorProfile.KycStatus.PENDING);
        assertThat(profile.getKycStatus()).isEqualTo(CreatorProfile.KycStatus.PENDING);
        assertThat(profile.getKycDocuments()).contains("idFrontUrl", "submittedAt");

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Notification>> captor = ArgumentCaptor.forClass(List.class);
        verify(notificationRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(1);
        Notification notification = captor.getValue().getFirst();
        assertThat(notification.getUserId()).isEqualTo(adminId);
        assertThat(notification.getType()).isEqualTo(Notification.Type.SYSTEM);
        assertThat(notification.getTitle()).isEqualTo("New KYC Submission");
        assertThat(notification.getDeepLink()).isEqualTo("/admin/kyc/" + creatorId);
        assertThat(notification.getIsRead()).isFalse();
    }

    @Test
    void connectSocialUpsertsExistingRecord() {
        UUID creatorId = UUID.randomUUID();
        SocialAccount existing = SocialAccount.builder()
            .id(UUID.randomUUID())
            .creatorId(creatorId)
            .platform(CreatorProfile.Platform.INSTAGRAM)
            .accessToken("old")
            .followerCount(10)
            .engagementRate(new BigDecimal("1.00"))
            .syncedAt(Instant.EPOCH)
            .build();

        when(creatorProfileRepository.findByUserId(creatorId)).thenReturn(Optional.of(profile(creatorId)));
        when(socialAccountRepository.findByCreatorIdAndPlatform(creatorId, CreatorProfile.Platform.INSTAGRAM))
            .thenReturn(Optional.of(existing));
        when(socialAccountRepository.save(any(SocialAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(creatorMapper.toResponse(any(SocialAccount.class))).thenReturn(
            new CreatorProfileResponse.SocialAccountResponse(CreatorProfile.Platform.INSTAGRAM, 50000, new BigDecimal("4.50"), Instant.now())
        );

        creatorService.connectSocial(
            creatorId,
            new SocialAccountRequest(CreatorProfile.Platform.INSTAGRAM, "new-token", 50000, new BigDecimal("4.50"))
        );

        ArgumentCaptor<SocialAccount> captor = ArgumentCaptor.forClass(SocialAccount.class);
        verify(socialAccountRepository).save(captor.capture());
        SocialAccount saved = captor.getValue();
        assertThat(saved.getId()).isEqualTo(existing.getId());
        assertThat(saved.getAccessToken()).isEqualTo("new-token");
        assertThat(saved.getFollowerCount()).isEqualTo(50000);
        assertThat(saved.getEngagementRate()).isEqualByComparingTo("4.50");
        assertThat(saved.getSyncedAt()).isAfter(Instant.EPOCH);
    }

    @Test
    void connectSocialCreatesNewRecordWhenMissing() {
        UUID creatorId = UUID.randomUUID();
        when(creatorProfileRepository.findByUserId(creatorId)).thenReturn(Optional.of(profile(creatorId)));
        when(socialAccountRepository.findByCreatorIdAndPlatform(creatorId, CreatorProfile.Platform.YOUTUBE))
            .thenReturn(Optional.empty());
        when(socialAccountRepository.save(any(SocialAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(creatorMapper.toResponse(any(SocialAccount.class))).thenReturn(
            new CreatorProfileResponse.SocialAccountResponse(CreatorProfile.Platform.YOUTUBE, 25000, new BigDecimal("3.25"), Instant.now())
        );

        creatorService.connectSocial(
            creatorId,
            new SocialAccountRequest(CreatorProfile.Platform.YOUTUBE, "yt-token", 25000, new BigDecimal("3.25"))
        );

        ArgumentCaptor<SocialAccount> captor = ArgumentCaptor.forClass(SocialAccount.class);
        verify(socialAccountRepository).save(captor.capture());
        SocialAccount saved = captor.getValue();
        assertThat(saved.getId()).isNull();
        assertThat(saved.getCreatorId()).isEqualTo(creatorId);
        assertThat(saved.getPlatform()).isEqualTo(CreatorProfile.Platform.YOUTUBE);
        assertThat(saved.getAccessToken()).isEqualTo("yt-token");
    }

    @Test
    void generateReferralCodeProducesUniqueEightCharacterAlphanumericCodes() {
        when(creatorProfileRepository.existsByReferralCode(any())).thenReturn(false);

        String code = creatorService.generateReferralCode();

        assertThat(code).hasSize(8);
        assertThat(code).matches("[A-Z0-9]{8}");
        verify(creatorProfileRepository).existsByReferralCode(code);
    }

    private CreatorProfile profile(UUID creatorId) {
        return CreatorProfile.builder()
            .userId(creatorId)
            .displayName("Creator")
            .nicheCategories("[]")
            .audienceDemographics("{}")
            .followerCount(0)
            .engagementRate(BigDecimal.ZERO)
            .kycStatus(CreatorProfile.KycStatus.PENDING)
            .kycDocuments("{}")
            .referralCode("TESTCODE")
            .availableBalance(BigDecimal.ZERO)
            .productReceiptConfirmed(false)
            .build();
    }

    private User user(UUID id, User.UserType userType) {
        return User.builder()
            .id(id)
            .email(id + "@creatorx.dev")
            .userType(userType)
            .status(User.UserStatus.ACTIVE)
            .notificationPrefs("{}")
            .build();
    }

    private CreatorProfileResponse response(CreatorProfile profile) {
        return new CreatorProfileResponse(
            profile.getUserId(),
            profile.getUserId(),
            profile.getDisplayName(),
            profile.getBio(),
            profile.getNicheCategories(),
            profile.getPrimaryPlatform(),
            profile.getTargetBudgetMin(),
            profile.getTargetBudgetMax(),
            profile.getAudienceDemographics(),
            profile.getKycStatus(),
            profile.getReferralCode(),
            profile.getAvailableBalance(),
            profile.getShippingAddress(),
            List.of()
        );
    }
}
