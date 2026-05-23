package com.creatorx.domain.campaign.dto;

import java.util.List;

public record CampaignFeedResponse(
    List<CampaignSummaryResponse> campaigns,
    int page,
    int totalPages,
    long total
) {
}
