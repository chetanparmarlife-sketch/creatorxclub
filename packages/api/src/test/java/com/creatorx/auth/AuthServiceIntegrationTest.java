package com.creatorx.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

import com.creatorx.auth.dto.BrandLoginRequest;
import com.creatorx.auth.dto.BrandRegisterRequest;
import com.creatorx.auth.dto.RefreshRequest;
import com.creatorx.auth.dto.VerifyOtpRequest;
import com.creatorx.domain.user.User;
import com.creatorx.domain.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
class AuthServiceIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:15-alpine")
        .withDatabaseName("creatorx_test")
        .withUsername("creatorx")
        .withPassword("creatorx");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
        registry.add("creatorx.jwt.secret", () -> "12345678901234567890123456789012");
        registry.add("creatorx.jwt.expiry-ms", () -> "604800000");
        registry.add("creatorx.jwt.refresh-expiry-ms", () -> "2592000000");
        registry.add("creatorx.supabase.url", () -> "https://example.supabase.co");
        registry.add("creatorx.supabase.service-role-key", () -> "service-role-key");
        registry.add("creatorx.supabase.storage.bucket-kyc", () -> "kyc-documents");
        registry.add("creatorx.supabase.storage.bucket-deliverables", () -> "deliverables");
        registry.add("creatorx.supabase.storage.bucket-products", () -> "product-images");
        registry.add("creatorx.razorpay.key-id", () -> "rzp_test");
        registry.add("creatorx.razorpay.key-secret", () -> "secret");
        registry.add("creatorx.razorpay.webhook-secret", () -> "webhook");
        registry.add("creatorx.firebase.project-id", () -> "creatorx-test");
        registry.add("creatorx.firebase.service-account-json", () -> "e30=");
        registry.add("creatorx.ai-scoring.api-url", () -> "https://ai.example.test");
        registry.add("creatorx.ai-scoring.api-key", () -> "ai-key");
        registry.add("creatorx.platform.fee-percent", () -> "10");
        registry.add("creatorx.platform.brand-portal-url", () -> "http://localhost:3001");
        registry.add("creatorx.platform.admin-dashboard-url", () -> "http://localhost:3002");
        registry.add("creatorx.platform.creator-app-scheme", () -> "creatorx://");
        registry.add("spring.data.redis.host", () -> "localhost");
        registry.add("spring.data.redis.port", () -> "6379");
        registry.add("spring.data.redis.password", () -> "");
    }

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private SupabaseAuthClient supabaseAuthClient;

    @MockBean
    private StringRedisTemplate redisTemplate;

    @Test
    void newCreatorOtpFlowCreatesUserRecord() {
        String phoneNumber = "+919876543210";

        var response = authService.verifyOtp(new VerifyOtpRequest(phoneNumber, "123456"));

        User user = userRepository.findByPhoneNumber(phoneNumber).orElseThrow();
        assertThat(user.getUserType()).isEqualTo(User.UserType.CREATOR);
        assertThat(response.user().id()).isEqualTo(user.getId());
        assertThat(response.user().kycStatus()).isNotNull();
        assertThat(jwtService.validateToken(response.accessToken())).isTrue();
        assertThat(jwtService.validateToken(response.refreshToken())).isTrue();
    }

    @Test
    void brandLoginReturnsValidJwt() {
        String email = "brand-login-" + System.nanoTime() + "@creatorx.dev";
        String password = "Brand123!";
        authService.brandRegister(new BrandRegisterRequest(email, password, "CreatorX Test Brand", "GST-TEST"));

        var response = authService.brandLogin(new BrandLoginRequest(email, password));

        assertThat(jwtService.validateToken(response.accessToken())).isTrue();
        assertThat(jwtService.extractUserType(response.accessToken())).isEqualTo(User.UserType.BRAND);
    }

    @Test
    void invalidOtpReturnsUnauthorized() {
        doThrow(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid OTP"))
            .when(supabaseAuthClient)
            .verifyOtp(anyString(), anyString());

        assertThatExceptionOfType(ResponseStatusException.class)
            .isThrownBy(() -> authService.verifyOtp(new VerifyOtpRequest("+910000000000", "000000")))
            .satisfies(ex -> assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED));
    }

    @Test
    void refreshWithBlacklistedTokenReturnsUnauthorized() {
        String email = "blacklisted-refresh-" + System.nanoTime() + "@creatorx.dev";
        var registered = authService.brandRegister(
            new BrandRegisterRequest(email, "Brand123!", "Blacklisted Brand", "GST-BLACKLIST")
        );
        when(redisTemplate.hasKey("blacklist:" + registered.refreshToken())).thenReturn(true);

        assertThatExceptionOfType(ResponseStatusException.class)
            .isThrownBy(() -> authService.refresh(new RefreshRequest(registered.refreshToken())))
            .satisfies(ex -> assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED));
    }
}
