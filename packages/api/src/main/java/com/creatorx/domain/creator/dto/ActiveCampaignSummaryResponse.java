package com.creatorx.domain.creator.dto;

import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.deliverable.Deliverable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ActiveCampaignSummaryResponse(
    UUID campaignId,
    UUID applicationId,
    UUID deliverableId,
    String title,
    String brandName,
    String brandLogoUrl,
    Campaign.CompensationType compensationType,
    String deliverableStatus,
    Instant slaDeadline,
    SlaStatus slaStatus,
    Boolean productReceiptConfirmed,
    CampaignStatus campaignStatus,
    BigDecimal creatorNetPayout
) {
    public enum SlaStatus {
        ON_TRACK,
        AT_RISK,
        BREACHED
    }

    public enum CampaignStatus {
        IN_PROGRESS,
        COMPLETED
    }
}
