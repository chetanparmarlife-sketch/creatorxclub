package com.creatorx.domain.dispute.dto;

import com.creatorx.domain.dispute.DisputeCase;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record DisputeResponse(
    UUID id,
    UUID campaignId,
    UUID raisedByUserId,
    DisputeCase.Reason reason,
    String description,
    List<String> evidenceUrls,
    DisputeCase.Status status,
    String adminNotes,
    DisputeCase.Resolution resolution,
    Instant resolvedAt,
    Instant createdAt
) {
}
