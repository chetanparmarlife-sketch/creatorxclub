package com.creatorx.domain.application.dto;

import com.creatorx.domain.application.Application;
import com.creatorx.domain.campaign.Campaign;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ApplicationResponse(
    UUID id,
    UUID campaignId,
    UUID creatorId,
    String pitchMessage,
    BigDecimal proposedPrice,
    List<String> portfolioLinks,
    Application.Status status,
    String brandFeedback,
    BigDecimal counterOfferAmount,
    CampaignSummary campaign,
    Instant createdAt,
    Instant updatedAt
) {
    public record CampaignSummary(
        String title,
        String brandName,
        Campaign.CompensationType compensationType
    ) {
    }
}
