package com.creatorx.domain.creator.dto;

import com.creatorx.domain.creator.CreatorProfile;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CreatorProfileResponse(
    UUID id,
    UUID userId,
    String displayName,
    String bio,
    String nicheCategories,
    CreatorProfile.Platform primaryPlatform,
    BigDecimal targetBudgetMin,
    BigDecimal targetBudgetMax,
    String audienceDemographics,
    CreatorProfile.KycStatus kycStatus,
    String referralCode,
    BigDecimal availableBalance,
    String shippingAddress,
    List<SocialAccountResponse> socialAccounts
) {

    public record SocialAccountResponse(
        CreatorProfile.Platform platform,
        Integer followerCount,
        BigDecimal engagementRate,
        Instant syncedAt
    ) {
    }
}
