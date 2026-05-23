package com.creatorx.domain.campaign.dto;

import com.creatorx.domain.campaign.Campaign;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CampaignDetailResponse(
    UUID id,
    String title,
    String description,
    List<String> nicheCategories,
    List<String> targetPlatforms,
    String deliverableRequirements,
    String slaTerms,
    String usageRights,
    Campaign.CompensationType compensationType,
    BigDecimal totalBudget,
    BigDecimal creatorPayout,
    BigDecimal creatorNetPayout,
    BigDecimal fixedServiceFee,
    boolean negotiationEnabled,
    Campaign.Status status,
    List<InventoryItemResponse> inventoryItems,
    BrandProfileResponse brandProfile,
    Instant createdAt,
    Instant updatedAt
) {
    public record BrandProfileResponse(
        UUID id,
        String companyName,
        String logoUrl,
        boolean verified,
        long totalCampaignsRun,
        BigDecimal averageRating,
        BigDecimal averagePayout
    ) {
    }

    public record InventoryItemResponse(
        UUID id,
        String productName,
        String description,
        BigDecimal value,
        Integer stockCount,
        String sku,
        String images,
        Boolean isActive
    ) {
    }
}
