package com.creatorx.domain.creator.dto;

import jakarta.validation.constraints.NotBlank;

public record KycSubmissionRequest(
    @NotBlank String idFrontUrl,
    @NotBlank String idBackUrl,
    @NotBlank String selfieUrl
) {
}
