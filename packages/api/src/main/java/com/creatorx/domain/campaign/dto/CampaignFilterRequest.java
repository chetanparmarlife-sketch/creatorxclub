package com.creatorx.domain.campaign.dto;

import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.creator.CreatorProfile;
import java.math.BigDecimal;

public record CampaignFilterRequest(
    String category,
    BigDecimal budgetMin,
    BigDecimal budgetMax,
    CreatorProfile.Platform platform,
    Campaign.CompensationType compensationType,
    String search,
    Integer page,
    Integer limit
) {
    public int pageOrDefault() {
        return page == null || page < 0 ? 0 : page;
    }

    public int limitOrDefault() {
        if (limit == null || limit < 1) {
            return 10;
        }
        return Math.min(limit, 50);
    }
}
