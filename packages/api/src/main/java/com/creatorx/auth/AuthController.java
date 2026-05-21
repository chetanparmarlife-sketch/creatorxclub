package com.creatorx.auth;

import com.creatorx.auth.dto.AuthResponse;
import com.creatorx.auth.dto.BrandLoginRequest;
import com.creatorx.auth.dto.BrandRegisterRequest;
import com.creatorx.auth.dto.LogoutRequest;
import com.creatorx.auth.dto.RefreshRequest;
import com.creatorx.auth.dto.SendOtpRequest;
import com.creatorx.auth.dto.VerifyOtpRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void sendOtp(@Valid @RequestBody SendOtpRequest request) {
        authService.sendOtp(request);
    }

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return authService.verifyOtp(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
    }

    @PostMapping("/brand/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse brandRegister(@Valid @RequestBody BrandRegisterRequest request) {
        return authService.brandRegister(request);
    }

    @PostMapping("/brand/login")
    public AuthResponse brandLogin(@Valid @RequestBody BrandLoginRequest request) {
        return authService.brandLogin(request);
    }
}
