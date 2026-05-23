package com.creatorx.domain.campaign.dto;

import com.creatorx.domain.campaign.Campaign;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CampaignSummaryResponse(
    UUID id,
    String brandName,
    String brandLogoUrl,
    boolean brandVerified,
    String title,
    List<String> nicheCategories,
    List<String> targetPlatforms,
    Campaign.CompensationType compensationType,
    BigDecimal creatorNetPayout,
    BigDecimal matchScore,
    String slaTerms,
    boolean isSaved
) {
}
