package com.creatorx.domain.deliverable.dto;

import com.creatorx.domain.deliverable.Deliverable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record DeliverableResponse(
    UUID id,
    UUID applicationId,
    UUID campaignId,
    UUID creatorId,
    List<String> contentFiles,
    String captions,
    List<String> hashtags,
    String postingInstructions,
    Instant submittedAt,
    Deliverable.Status status,
    String revisionNotes,
    Instant slaDeadline,
    Boolean productReceiptConfirmed
) {
}
