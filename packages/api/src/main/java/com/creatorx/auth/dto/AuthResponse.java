package com.creatorx.auth.dto;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    AuthUser user
) {
}
