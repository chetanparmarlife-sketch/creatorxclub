package com.creatorx.domain.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.creatorx.domain.application.dto.SubmitApplicationRequest;
import com.creatorx.domain.brand.Brand;
import com.creatorx.domain.brand.BrandRepository;
import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.campaign.CampaignRepository;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.creatorx.domain.notification.Notification;
import com.creatorx.domain.notification.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private CampaignRepository campaignRepository;
    @Mock
    private CreatorProfileRepository creatorProfileRepository;
    @Mock
    private BrandRepository brandRepository;
    @Mock
    private NotificationService notificationService;

    private ApplicationService applicationService;

    @BeforeEach
    void setUp() {
        applicationService = new ApplicationService(
            applicationRepository,
            campaignRepository,
            creatorProfileRepository,
            brandRepository,
            notificationService,
            new ObjectMapper()
        );
    }

    @Test
    void submitApplicationRejectsIfKycIsNotApproved() {
        UUID creatorId = UUID.randomUUID();
        when(creatorProfileRepository.findById(creatorId)).thenReturn(Optional.of(profile(creatorId, CreatorProfile.KycStatus.PENDING)));

        assertThatExceptionOfType(ResponseStatusException.class)
            .isThrownBy(() -> applicationService.submitApplication(creatorId, UUID.randomUUID(), request()))
            .satisfies(ex -> assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));
    }

    @Test
    void submitApplicationRejectsDuplicateApplication() {
        UUID creatorId = UUID.randomUUID();
        UUID campaignId = UUID.randomUUID();
        when(creatorProfileRepository.findById(creatorId)).thenReturn(Optional.of(profile(creatorId, CreatorProfile.KycStatus.APPROVED)));
        when(campaignRepository.findById(campaignId)).thenReturn(Optional.of(campaign(campaignId, Campaign.Status.LIVE, true)));
        when(applicationRepository.existsByCampaignIdAndCreatorId(campaignId, creatorId)).thenReturn(true);

        assertThatExceptionOfType(ResponseStatusException.class)
            .isThrownBy(() -> applicationService.submitApplication(creatorId, campaignId, request()))
            .satisfies(ex -> assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    void submitApplicationRejectsIfCampaignIsNotLive() {
        UUID creatorId = UUID.randomUUID();
        UUID campaignId = UUID.randomUUID();
        when(creatorProfileRepository.findById(creatorId)).thenReturn(Optional.of(profile(creatorId, CreatorProfile.KycStatus.APPROVED)));
        when(campaignRepository.findById(campaignId)).thenReturn(Optional.of(campaign(campaignId, Campaign.Status.PAUSED, true)));

        assertThatExceptionOfType(ResponseStatusException.class)
            .isThrownBy(() -> applicationService.submitApplication(creatorId, campaignId, request()))
            .satisfies(ex -> assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY));
    }

    @Test
    void submitApplicationCreatesNotificationForBrandOnSuccess() {
        UUID creatorId = UUID.randomUUID();
        UUID campaignId = UUID.randomUUID();
        UUID brandId = UUID.randomUUID();
        Campaign campaign = campaign(campaignId, Campaign.Status.LIVE, true);
        campaign.setBrandId(brandId);
        Brand brand = brand(brandId);

        when(creatorProfileRepository.findById(creatorId)).thenReturn(Optional.of(profile(creatorId, CreatorProfile.KycStatus.APPROVED)));
        when(campaignRepository.findById(campaignId)).thenReturn(Optional.of(campaign));
        when(applicationRepository.existsByCampaignIdAndCreatorId(campaignId, creatorId)).thenReturn(false);
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(brand));

        applicationService.submitApplication(creatorId, campaignId, request());

        verify(notificationService).sendToUser(
            brandId,
            Notification.Type.CAMPAIGN,
            "New Application Received",
            "Maya applied to Summer Drop",
            "/brand/applications?campaignId=" + campaignId,
            Map.of("campaignId", campaignId.toString(), "creatorId", creatorId.toString())
        );
    }

    @Test
    void proposedPriceIsIgnoredWhenNegotiationIsDisabled() {
        UUID creatorId = UUID.randomUUID();
        UUID campaignId = UUID.randomUUID();
        UUID brandId = UUID.randomUUID();
        Campaign campaign = campaign(campaignId, Campaign.Status.LIVE, false);
        campaign.setBrandId(brandId);

        when(creatorProfileRepository.findById(creatorId)).thenReturn(Optional.of(profile(creatorId, CreatorProfile.KycStatus.APPROVED)));
        when(campaignRepository.findById(campaignId)).thenReturn(Optional.of(campaign));
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(brand(brandId)));

        applicationService.submitApplication(
            creatorId,
            campaignId,
            new SubmitApplicationRequest("This is a detailed pitch that is definitely longer than fifty characters.", List.of(), new BigDecimal("99999.00"))
        );

        ArgumentCaptor<Application> captor = ArgumentCaptor.forClass(Application.class);
        verify(applicationRepository).save(captor.capture());
        assertThat(captor.getValue().getProposedPrice()).isEqualByComparingTo("15000.00");
    }

    private SubmitApplicationRequest request() {
        return new SubmitApplicationRequest(
            "This is a detailed pitch that is definitely longer than fifty characters.",
            List.of("https://example.com/work"),
            new BigDecimal("18000.00")
        );
    }

    private CreatorProfile profile(UUID id, CreatorProfile.KycStatus kycStatus) {
        return CreatorProfile.builder()
            .userId(id)
            .displayName("Maya")
            .kycStatus(kycStatus)
            .build();
    }

    private Campaign campaign(UUID id, Campaign.Status status, boolean negotiationEnabled) {
        return Campaign.builder()
            .id(id)
            .brandId(UUID.randomUUID())
            .title("Summer Drop")
            .status(status)
            .creatorPayout(new BigDecimal("15000.00"))
            .negotiationEnabled(negotiationEnabled)
            .compensationType(Campaign.CompensationType.CASH)
            .build();
    }

    private Brand brand(UUID id) {
        return Brand.builder()
            .userId(id)
            .companyName("CreatorX Brand")
            .verificationStatus(Brand.VerificationStatus.APPROVED)
            .build();
    }
}
