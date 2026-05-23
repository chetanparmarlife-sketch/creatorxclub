package com.creatorx.domain.creator.dto;

import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.contract.dto.ContractResponse;
import com.creatorx.domain.deliverable.dto.DeliverableResponse;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ActiveCampaignDetailResponse(
    UUID campaignId,
    UUID applicationId,
    UUID deliverableId,
    String title,
    String brandName,
    String brandLogoUrl,
    Campaign.CompensationType compensationType,
    String deliverableStatus,
    Instant slaDeadline,
    ActiveCampaignSummaryResponse.SlaStatus slaStatus,
    Boolean productReceiptConfirmed,
    ActiveCampaignSummaryResponse.CampaignStatus campaignStatus,
    BigDecimal creatorNetPayout,
    String campaignBrief,
    String description,
    String deliverableRequirements,
    String postingInstructions,
    String slaTerms,
    String shippingAddress,
    DeliverableResponse deliverable,
    ContractResponse contract
) {
}
