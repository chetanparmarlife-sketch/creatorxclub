package com.creatorx.domain.creator.dto;

import com.creatorx.domain.creator.CreatorProfile;
import java.math.BigDecimal;
import java.util.List;

public record UpdateProfileRequest(
    String displayName,
    String bio,
    List<String> nicheCategories,
    CreatorProfile.Platform primaryPlatform,
    BigDecimal targetBudgetMin,
    BigDecimal targetBudgetMax,
    Object audienceDemographics,
    Object notificationPreferences
) {
}
