package com.creatorx.domain.deliverable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record SubmitDeliverableRequest(
    @NotNull UUID campaignId,
    @NotNull UUID applicationId,
    @NotEmpty List<String> contentFiles,
    @NotBlank String captions,
    @NotEmpty List<String> hashtags,
    String postingInstructions
) {
}
