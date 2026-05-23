package com.creatorx.domain.creator;

import com.creatorx.domain.creator.dto.CreatorProfileResponse;
import com.creatorx.domain.creator.dto.KycSubmissionRequest;
import com.creatorx.domain.creator.dto.KycSubmissionResponse;
import com.creatorx.domain.creator.dto.ShippingAddressRequest;
import com.creatorx.domain.creator.dto.ShippingAddressResponse;
import com.creatorx.domain.creator.dto.SocialAccountRequest;
import com.creatorx.domain.creator.dto.UpdateProfileRequest;
import com.creatorx.domain.notification.Notification;
import com.creatorx.domain.notification.NotificationRepository;
import com.creatorx.domain.user.User;
import com.creatorx.domain.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreatorService {

    private static final String EMPTY_JSON_OBJECT = "{}";
    private static final String EMPTY_JSON_ARRAY = "[]";
    private static final String REFERRAL_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int REFERRAL_LENGTH = 8;

    private final CreatorProfileRepository creatorProfileRepository;
    private final SocialAccountRepository socialAccountRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final CreatorMapper creatorMapper;
    private final ObjectMapper objectMapper;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${creatorx.supabase.url}")
    private String supabaseUrl;

    @Transactional
    public CreatorProfileResponse getMe(UUID userId) {
        CreatorProfile profile = getOrCreateProfile(userId);
        return toResponse(profile);
    }

    @Transactional
    public CreatorProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        CreatorProfile profile = getOrCreateProfile(userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (request.displayName() != null) {
            profile.setDisplayName(request.displayName());
        }
        if (request.bio() != null) {
            profile.setBio(request.bio());
        }
        if (request.nicheCategories() != null) {
            if (request.nicheCategories().size() > 3) {
                throw new IllegalStateException("Select up to 3 niche categories");
            }
            profile.setNicheCategories(toJson(request.nicheCategories()));
        }
        if (request.primaryPlatform() != null) {
            profile.setPrimaryPlatform(request.primaryPlatform());
        }
        if (request.targetBudgetMin() != null) {
            profile.setTargetBudgetMin(request.targetBudgetMin());
        }
        if (request.targetBudgetMax() != null) {
            profile.setTargetBudgetMax(request.targetBudgetMax());
        }
        validateBudgetRange(profile.getTargetBudgetMin(), profile.getTargetBudgetMax());

        if (request.audienceDemographics() != null) {
            profile.setAudienceDemographics(toJson(request.audienceDemographics()));
        }
        if (request.notificationPreferences() != null) {
            user.setNotificationPrefs(toJson(request.notificationPreferences()));
            userRepository.save(user);
        }

        CreatorProfile saved = creatorProfileRepository.save(profile);
        return toResponse(saved);
    }

    @Transactional
    public CreatorProfileResponse.SocialAccountResponse connectSocial(UUID userId, SocialAccountRequest request) {
        CreatorProfile profile = getOrCreateProfile(userId);
        SocialAccount socialAccount = socialAccountRepository
            .findByCreatorIdAndPlatform(profile.getUserId(), request.platform())
            .orElseGet(() -> SocialAccount.builder()
                .creatorId(profile.getUserId())
                .platform(request.platform())
                .build());

        socialAccount.setAccessToken(request.accessToken());
        socialAccount.setFollowerCount(request.followerCount());
        socialAccount.setEngagementRate(request.engagementRate());
        socialAccount.setSyncedAt(Instant.now());

        SocialAccount saved = socialAccountRepository.save(socialAccount);
        return creatorMapper.toResponse(saved);
    }

    @Transactional
    public void disconnectSocial(UUID userId, CreatorProfile.Platform platform) {
        CreatorProfile profile = getOrCreateProfile(userId);
        SocialAccount socialAccount = socialAccountRepository
            .findByCreatorIdAndPlatform(profile.getUserId(), platform)
            .orElseThrow(() -> new EntityNotFoundException("Social account not found"));
        socialAccountRepository.delete(socialAccount);
    }

    @Transactional
    public KycSubmissionResponse submitKyc(UUID userId, KycSubmissionRequest request) {
        validateSupabaseUrl(request.idFrontUrl());
        validateSupabaseUrl(request.idBackUrl());
        validateSupabaseUrl(request.selfieUrl());

        CreatorProfile profile = getOrCreateProfile(userId);
        profile.setKycDocuments(toJson(new KycDocuments(
            request.idFrontUrl(),
            request.idBackUrl(),
            request.selfieUrl(),
            Instant.now()
        )));
        profile.setKycStatus(CreatorProfile.KycStatus.PENDING);
        creatorProfileRepository.save(profile);

        notifyAdmins(profile);
        return new KycSubmissionResponse(
            CreatorProfile.KycStatus.PENDING,
            "Documents submitted for review"
        );
    }

    @Transactional
    public ShippingAddressResponse updateShippingAddress(UUID userId, ShippingAddressRequest request) {
        CreatorProfile profile = getOrCreateProfile(userId);
        String shippingAddress = toJson(request);
        profile.setShippingAddress(shippingAddress);
        creatorProfileRepository.save(profile);
        return new ShippingAddressResponse(shippingAddress);
    }

    String generateReferralCode() {
        String referralCode;
        do {
            StringBuilder builder = new StringBuilder(REFERRAL_LENGTH);
            for (int i = 0; i < REFERRAL_LENGTH; i++) {
                builder.append(REFERRAL_ALPHABET.charAt(secureRandom.nextInt(REFERRAL_ALPHABET.length())));
            }
            referralCode = builder.toString();
        } while (creatorProfileRepository.existsByReferralCode(referralCode));
        return referralCode;
    }

    private CreatorProfile getOrCreateProfile(UUID userId) {
        return creatorProfileRepository.findByUserId(userId)
            .orElseGet(() -> createDefaultProfile(userId));
    }

    private CreatorProfile createDefaultProfile(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        String displayName = user.getPhoneNumber() != null ? user.getPhoneNumber() : user.getEmail();
        return creatorProfileRepository.save(CreatorProfile.builder()
            .userId(userId)
            .displayName(displayName)
            .nicheCategories(EMPTY_JSON_ARRAY)
            .audienceDemographics(EMPTY_JSON_OBJECT)
            .followerCount(0)
            .engagementRate(BigDecimal.ZERO)
            .kycStatus(CreatorProfile.KycStatus.PENDING)
            .kycDocuments(EMPTY_JSON_OBJECT)
            .referralCode(generateReferralCode())
            .availableBalance(BigDecimal.ZERO)
            .productReceiptConfirmed(false)
            .build());
    }

    private CreatorProfileResponse toResponse(CreatorProfile profile) {
        List<SocialAccount> socialAccounts = socialAccountRepository.findByCreatorIdOrderByPlatformAsc(profile.getUserId());
        return creatorMapper.toResponse(profile, socialAccounts);
    }

    private void validateBudgetRange(BigDecimal min, BigDecimal max) {
        if (min != null && max != null && min.compareTo(max) > 0) {
            throw new IllegalStateException("Minimum budget must be less than or equal to maximum budget");
        }
    }

    private void validateSupabaseUrl(String url) {
        String expectedPrefix = supabaseUrl == null ? "" : supabaseUrl.trim();
        if (expectedPrefix.endsWith("/")) {
            expectedPrefix = expectedPrefix.substring(0, expectedPrefix.length() - 1);
        }
        if (expectedPrefix.isBlank() || url == null || !url.startsWith(expectedPrefix)) {
            throw new IllegalStateException("KYC document URL must come from Supabase Storage");
        }
    }

    private void notifyAdmins(CreatorProfile profile) {
        List<User> admins = userRepository.findByUserType(User.UserType.ADMIN);
        String displayName = profile.getDisplayName() == null ? "Creator" : profile.getDisplayName();
        List<Notification> notifications = admins.stream()
            .map(admin -> Notification.builder()
                .userId(admin.getId())
                .type(Notification.Type.SYSTEM)
                .title("New KYC Submission")
                .message("Creator " + displayName + " submitted KYC documents")
                .deepLink("/admin/kyc/" + profile.getUserId())
                .isRead(false)
                .build())
            .toList();
        notificationRepository.saveAll(notifications);
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Unable to serialize JSON field", ex);
        }
    }

    private record KycDocuments(
        String idFrontUrl,
        String idBackUrl,
        String selfieUrl,
        Instant submittedAt
    ) {
    }
}
