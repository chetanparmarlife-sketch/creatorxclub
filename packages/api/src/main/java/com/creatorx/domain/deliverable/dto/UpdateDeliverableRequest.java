package com.creatorx.domain.deliverable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record UpdateDeliverableRequest(
    @NotEmpty List<String> contentFiles,
    @NotBlank String captions,
    @NotEmpty List<String> hashtags
) {
}
