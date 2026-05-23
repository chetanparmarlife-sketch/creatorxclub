package com.creatorx.domain.dispute.dto;

import com.creatorx.domain.dispute.DisputeCase;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record RaiseDisputeRequest(
    @NotNull UUID campaignId,
    UUID applicationId,
    @NotNull DisputeCase.Reason reason,
    @NotBlank @Size(min = 100) String description,
    List<String> evidenceUrls
) {
}
