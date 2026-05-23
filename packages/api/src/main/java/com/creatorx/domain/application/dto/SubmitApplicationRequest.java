package com.creatorx.domain.application.dto;

import java.math.BigDecimal;
import java.util.List;

public record SubmitApplicationRequest(
    String pitchMessage,
    List<String> portfolioLinks,
    BigDecimal proposedPrice
) {
}
