package com.creatorx.domain.contract.dto;

import jakarta.validation.constraints.NotBlank;

public record SignContractRequest(
    @NotBlank String signature
) {
}
