package com.creatorx.auth;

import com.creatorx.auth.dto.AuthResponse;
import com.creatorx.auth.dto.AuthUser;
import com.creatorx.auth.dto.BrandLoginRequest;
import com.creatorx.auth.dto.BrandRegisterRequest;
import com.creatorx.auth.dto.LogoutRequest;
import com.creatorx.auth.dto.RefreshRequest;
import com.creatorx.auth.dto.SendOtpRequest;
import com.creatorx.auth.dto.VerifyOtpRequest;
import com.creatorx.domain.brand.Brand;
import com.creatorx.domain.brand.BrandRepository;
import com.creatorx.domain.brand.BrandTeamMember;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.creatorx.domain.user.User;
import com.creatorx.domain.user.UserRepository;
import java.math.BigDecimal;
import java.time.Duration;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String EMPTY_JSON_OBJECT = "{}";
    private static final String EMPTY_JSON_ARRAY = "[]";
    private static final String BLACKLIST_PREFIX = "blacklist:";

    private final JwtService jwtService;
    private final SupabaseAuthClient supabaseAuthClient;
    private final UserRepository userRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final BrandRepository brandRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;

    public void sendOtp(SendOtpRequest request) {
        supabaseAuthClient.sendOtp(request.phoneNumber());
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        supabaseAuthClient.verifyOtp(request.phoneNumber(), request.otp());

        User user = userRepository.findByPhoneNumber(request.phoneNumber())
            .orElseGet(() -> createCreatorUser(request.phoneNumber()));

        CreatorProfile profile = creatorProfileRepository.findByUserId(user.getId())
            .orElseGet(() -> createCreatorProfile(user, request.phoneNumber()));

        return tokenPair(user, profile.getKycStatus(), null);
    }

    @Transactional
    public AuthResponse brandRegister(BrandRegisterRequest request) {
        String normalizedEmail = request.email().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DataIntegrityViolationException("Email already registered");
        }

        User user = userRepository.save(User.builder()
            .email(normalizedEmail)
            .passwordHash(passwordEncoder.encode(request.password()))
            .userType(User.UserType.BRAND)
            .status(User.UserStatus.ACTIVE)
            .notificationPrefs(EMPTY_JSON_OBJECT)
            .build());

        brandRepository.save(Brand.builder()
            .userId(user.getId())
            .companyName(request.companyName())
            .taxId(request.taxId())
            .gstDocuments(EMPTY_JSON_ARRAY)
            .verificationStatus(Brand.VerificationStatus.PENDING)
            .walletBalance(BigDecimal.ZERO)
            .escrowAllocated(BigDecimal.ZERO)
            .totalSpent(BigDecimal.ZERO)
            .version(0L)
            .build());

        return tokenPair(user, null, BrandTeamMember.Role.OWNER);
    }

    @Transactional(readOnly = true)
    public AuthResponse brandLogin(BrandLoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase(Locale.ROOT))
            .orElseThrow(() -> unauthorized("Invalid email or password"));

        if (user.getUserType() != User.UserType.BRAND || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw unauthorized("Invalid email or password");
        }

        return tokenPair(user, null, BrandTeamMember.Role.OWNER);
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(RefreshRequest request) {
        String refreshToken = request.refreshToken();
        if (Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + refreshToken))) {
            throw unauthorized("Refresh token has been revoked");
        }
        if (!jwtService.validateToken(refreshToken) || !jwtService.isRefreshToken(refreshToken)) {
            throw unauthorized("Invalid refresh token");
        }

        User user = userRepository.findById(jwtService.extractUserId(refreshToken))
            .orElseThrow(() -> unauthorized("Invalid refresh token"));
        CreatorProfile.KycStatus kycStatus = user.getUserType() == User.UserType.CREATOR
            ? creatorProfileRepository.findByUserId(user.getId()).map(CreatorProfile::getKycStatus).orElse(null)
            : null;
        BrandTeamMember.Role brandRole = user.getUserType() == User.UserType.BRAND ? BrandTeamMember.Role.OWNER : null;

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getUserType(), brandRole);
        return new AuthResponse(accessToken, refreshToken, new AuthUser(user.getId(), user.getUserType(), kycStatus));
    }

    public void logout(LogoutRequest request) {
        String refreshToken = request.refreshToken();
        if (!jwtService.validateToken(refreshToken) || !jwtService.isRefreshToken(refreshToken)) {
            return;
        }

        long ttlSeconds = jwtService.remainingTtlSeconds(refreshToken);
        if (ttlSeconds > 0) {
            redisTemplate.opsForValue().set(BLACKLIST_PREFIX + refreshToken, "true", Duration.ofSeconds(ttlSeconds));
        }
    }

    private User createCreatorUser(String phoneNumber) {
        return userRepository.save(User.builder()
            .email(phoneEmail(phoneNumber))
            .phoneNumber(phoneNumber)
            .userType(User.UserType.CREATOR)
            .status(User.UserStatus.ACTIVE)
            .notificationPrefs(EMPTY_JSON_OBJECT)
            .build());
    }

    private CreatorProfile createCreatorProfile(User user, String phoneNumber) {
        return creatorProfileRepository.save(CreatorProfile.builder()
            .userId(user.getId())
            .displayName(phoneNumber)
            .nicheCategories(EMPTY_JSON_ARRAY)
            .audienceDemographics(EMPTY_JSON_OBJECT)
            .followerCount(0)
            .engagementRate(BigDecimal.ZERO)
            .kycStatus(CreatorProfile.KycStatus.PENDING)
            .kycDocuments(EMPTY_JSON_OBJECT)
            .referralCode(generateReferralCode())
            .availableBalance(BigDecimal.ZERO)
            .productReceiptConfirmed(false)
            .build());
    }

    private AuthResponse tokenPair(User user, CreatorProfile.KycStatus kycStatus, BrandTeamMember.Role brandRole) {
        return new AuthResponse(
            jwtService.generateAccessToken(user.getId(), user.getUserType(), brandRole),
            jwtService.generateRefreshToken(user.getId()),
            new AuthUser(user.getId(), user.getUserType(), kycStatus)
        );
    }

    private String phoneEmail(String phoneNumber) {
        String digits = phoneNumber.replaceAll("[^0-9]", "");
        return "phone-" + digits + "@phone.creatorx.local";
    }

    private String generateReferralCode() {
        return "CR" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase(Locale.ROOT);
    }

    private ResponseStatusException unauthorized(String message) {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, message);
    }
}
