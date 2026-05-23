package com.creatorx.domain.contract.dto;

import com.creatorx.domain.contract.DigitalContract;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ContractResponse(
    UUID id,
    DigitalContract.Status status,
    String usageRightsSnapshot,
    String creatorSignature,
    String brandSignature,
    Instant creatorSignedAt,
    Instant brandSignedAt,
    UUID campaignId,
    BigDecimal netPayout
) {
}
