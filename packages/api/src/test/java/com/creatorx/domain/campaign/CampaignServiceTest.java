package com.creatorx.domain.campaign;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.creatorx.domain.ai.AIMatchingService;
import com.creatorx.domain.application.ApplicationRepository;
import com.creatorx.domain.brand.Brand;
import com.creatorx.domain.brand.BrandRepository;
import com.creatorx.domain.campaign.dto.CampaignFilterRequest;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.creatorx.domain.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class CampaignServiceTest {

    @Mock
    private CampaignRepository campaignRepository;
    @Mock
    private BrandRepository brandRepository;
    @Mock
    private CreatorProfileRepository creatorProfileRepository;
    @Mock
    private InventoryItemRepository inventoryItemRepository;
    @Mock
    private SavedCampaignRepository savedCampaignRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private AIMatchingService aiMatchingService;

    private CampaignService campaignService;

    @BeforeEach
    void setUp() {
        campaignService = new CampaignService(
            campaignRepository,
            brandRepository,
            creatorProfileRepository,
            inventoryItemRepository,
            savedCampaignRepository,
            applicationRepository,
            aiMatchingService,
            new ObjectMapper()
        );
        ReflectionTestUtils.setField(campaignService, "platformFeePercent", new BigDecimal("10"));
    }

    @Test
    void getCampaignsReturnsCampaignsWithNetPayoutAndMatchScore() {
        UUID creatorId = UUID.randomUUID();
        UUID brandId = UUID.randomUUID();
        Campaign liveCampaign = campaign(UUID.randomUUID(), brandId, Campaign.Status.LIVE, Campaign.CompensationType.CASH);

        when(creatorProfileRepository.findById(creatorId)).thenReturn(Optional.of(CreatorProfile.builder().userId(creatorId).build()));
        when(campaignRepository.findAll(any(Specification.class), any(Pageable.class)))
            .thenReturn(new PageImpl<>(List.of(liveCampaign)));
        when(savedCampaignRepository.findByCreatorIdOrderByCreatedAtDesc(creatorId)).thenReturn(List.of());
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(brand(brandId, Brand.VerificationStatus.APPROVED)));
        when(aiMatchingService.getMatchScore(creatorId, liveCampaign.getId())).thenReturn(new BigDecimal("92.5"));

        var response = campaignService.getExploreCampaigns(creatorId, new CampaignFilterRequest(null, null, null, null, null, null, 0, 10));

        assertThat(response.campaigns()).hasSize(1);
        assertThat(response.campaigns().getFirst().creatorNetPayout()).isEqualByComparingTo("13500.00");
        assertThat(response.campaigns().getFirst().matchScore()).isEqualByComparingTo("92.5");
    }

    @Test
    void getCampaignsAppliesCompensationTypeFilterThroughSpecification() {
        UUID creatorId = UUID.randomUUID();
        when(creatorProfileRepository.findById(creatorId)).thenReturn(Optional.of(CreatorProfile.builder().userId(creatorId).build()));
        when(campaignRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));
        when(savedCampaignRepository.findByCreatorIdOrderByCreatedAtDesc(creatorId)).thenReturn(List.of());

        var response = campaignService.getExploreCampaigns(
            creatorId,
            new CampaignFilterRequest(null, null, null, null, Campaign.CompensationType.GIFTING, null, 0, 10)
        );

        assertThat(response.campaigns()).isEmpty();
    }

    @Test
    void getCampaignDetailReturnsForbiddenForUnverifiedBrandCampaignToCreator() {
        UUID campaignId = UUID.randomUUID();
        UUID brandId = UUID.randomUUID();
        when(campaignRepository.findById(campaignId)).thenReturn(Optional.of(campaign(campaignId, brandId, Campaign.Status.LIVE, Campaign.CompensationType.CASH)));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(brand(brandId, Brand.VerificationStatus.PENDING)));

        assertThatExceptionOfType(ResponseStatusException.class)
            .isThrownBy(() -> campaignService.getCampaignDetail(UUID.randomUUID(), User.UserType.CREATOR, campaignId));
    }

    private Campaign campaign(UUID id, UUID brandId, Campaign.Status status, Campaign.CompensationType compensationType) {
        return Campaign.builder()
            .id(id)
            .brandId(brandId)
            .title("Creator Brief")
            .description("Campaign description")
            .nicheCategories("[\"Fashion\"]")
            .targetPlatforms("[\"INSTAGRAM\"]")
            .deliverableRequirements("[]")
            .usageRights("{}")
            .inventoryItems("[]")
            .creatorPayout(new BigDecimal("15000.00"))
            .totalBudget(new BigDecimal("20000.00"))
            .fixedServiceFee(BigDecimal.ZERO)
            .compensationType(compensationType)
            .status(status)
            .negotiationEnabled(false)
            .build();
    }

    private Brand brand(UUID id, Brand.VerificationStatus status) {
        return Brand.builder()
            .userId(id)
            .companyName("CreatorX Brand")
            .verificationStatus(status)
            .build();
    }
}
