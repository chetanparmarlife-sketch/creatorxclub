package com.creatorx.auth.dto;

import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.user.User;
import java.util.UUID;

public record AuthUser(
    UUID id,
    User.UserType userType,
    CreatorProfile.KycStatus kycStatus
) {
}
