package com.creatorx.domain.creator.dto;

import com.creatorx.domain.creator.CreatorProfile;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record SocialAccountRequest(
    @NotNull CreatorProfile.Platform platform,
    String accessToken,
    @NotNull Integer followerCount,
    @NotNull BigDecimal engagementRate
) {
}
