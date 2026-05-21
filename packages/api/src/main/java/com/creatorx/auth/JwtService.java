package com.creatorx.auth;

import com.creatorx.domain.brand.BrandTeamMember;
import com.creatorx.domain.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long accessTokenExpiryMs;
    private final long refreshTokenExpiryMs;

    public JwtService(
        @Value("${creatorx.jwt.secret}") String jwtSecret,
        @Value("${creatorx.jwt.expiry-ms}") long accessTokenExpiryMs,
        @Value("${creatorx.jwt.refresh-expiry-ms}") long refreshTokenExpiryMs
    ) {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiryMs = accessTokenExpiryMs;
        this.refreshTokenExpiryMs = refreshTokenExpiryMs;
    }

    public String generateAccessToken(UUID userId, User.UserType userType, BrandTeamMember.Role brandRole) {
        Instant now = Instant.now();
        var builder = Jwts.builder()
            .subject(userId.toString())
            .claim("userType", userType.name())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusMillis(accessTokenExpiryMs)))
            .signWith(signingKey);

        if (brandRole != null) {
            builder.claim("brandRole", brandRole.name());
        }

        return builder.compact();
    }

    public String generateRefreshToken(UUID userId) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(userId.toString())
            .claim("tokenType", "refresh")
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusMillis(refreshTokenExpiryMs)))
            .signWith(signingKey)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(parseClaims(token).getSubject());
    }

    public User.UserType extractUserType(String token) {
        String value = parseClaims(token).get("userType", String.class);
        return value == null ? null : User.UserType.valueOf(value);
    }

    public BrandTeamMember.Role extractBrandRole(String token) {
        String value = parseClaims(token).get("brandRole", String.class);
        return value == null ? null : BrandTeamMember.Role.valueOf(value);
    }

    public boolean isRefreshToken(String token) {
        return "refresh".equals(parseClaims(token).get("tokenType", String.class));
    }

    public Instant extractExpiresAt(String token) {
        return parseClaims(token).getExpiration().toInstant();
    }

    public long remainingTtlSeconds(String token) {
        long seconds = extractExpiresAt(token).getEpochSecond() - Instant.now().getEpochSecond();
        return Math.max(seconds, 0);
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
