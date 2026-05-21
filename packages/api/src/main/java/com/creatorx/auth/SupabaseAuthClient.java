package com.creatorx.auth;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class SupabaseAuthClient {

    private final RestClient restClient;
    private final String serviceRoleKey;

    public SupabaseAuthClient(
        RestClient.Builder restClientBuilder,
        @Value("${creatorx.supabase.url}") String supabaseUrl,
        @Value("${creatorx.supabase.service-role-key}") String serviceRoleKey
    ) {
        this.restClient = restClientBuilder.baseUrl(supabaseUrl).build();
        this.serviceRoleKey = serviceRoleKey;
    }

    public void sendOtp(String phoneNumber) {
        try {
            restClient.post()
                .uri("/auth/v1/otp")
                .header("apikey", serviceRoleKey)
                .body(Map.of("phone", phoneNumber))
                .retrieve()
                .toBodilessEntity();
        } catch (RestClientResponseException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to send OTP", ex);
        }
    }

    public void verifyOtp(String phoneNumber, String otp) {
        try {
            restClient.post()
                .uri("/auth/v1/verify")
                .header("apikey", serviceRoleKey)
                .body(Map.of(
                    "phone", phoneNumber,
                    "token", otp,
                    "type", "sms"
                ))
                .retrieve()
                .toBodilessEntity();
        } catch (RestClientResponseException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid OTP", ex);
        }
    }
}
