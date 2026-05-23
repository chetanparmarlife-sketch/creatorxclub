package com.creatorx.domain.creator.dto;

import com.creatorx.domain.creator.CreatorProfile;

public record KycSubmissionResponse(
    CreatorProfile.KycStatus kycStatus,
    String message
) {
}
