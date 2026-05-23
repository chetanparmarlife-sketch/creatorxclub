package com.creatorx.domain.creator;

import com.creatorx.auth.CurrentUser;
import com.creatorx.domain.creator.dto.CreatorProfileResponse;
import com.creatorx.domain.creator.dto.KycSubmissionRequest;
import com.creatorx.domain.creator.dto.KycSubmissionResponse;
import com.creatorx.domain.creator.dto.ShippingAddressRequest;
import com.creatorx.domain.creator.dto.ShippingAddressResponse;
import com.creatorx.domain.creator.dto.SocialAccountRequest;
import com.creatorx.domain.creator.dto.UpdateProfileRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/creators")
@RequiredArgsConstructor
public class CreatorController {

    private final CreatorService creatorService;
    private final CurrentUser currentUser;

    @GetMapping("/me")
    @PreAuthorize("hasRole('CREATOR')")
    public CreatorProfileResponse me() {
        return creatorService.getMe(currentUser.id());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CREATOR')")
    public CreatorProfileResponse updateProfile(@RequestBody UpdateProfileRequest request) {
        return creatorService.updateProfile(currentUser.id(), request);
    }

    @PostMapping("/social-accounts")
    @PreAuthorize("hasRole('CREATOR')")
    public CreatorProfileResponse.SocialAccountResponse connectSocial(@Valid @RequestBody SocialAccountRequest request) {
        return creatorService.connectSocial(currentUser.id(), request);
    }

    @DeleteMapping("/social-accounts/{platform}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('CREATOR')")
    public void disconnectSocial(@PathVariable CreatorProfile.Platform platform) {
        creatorService.disconnectSocial(currentUser.id(), platform);
    }

    @PostMapping("/kyc")
    @PreAuthorize("hasRole('CREATOR')")
    public KycSubmissionResponse submitKyc(@Valid @RequestBody KycSubmissionRequest request) {
        return creatorService.submitKyc(currentUser.id(), request);
    }

    @PutMapping("/shipping-address")
    @PreAuthorize("hasRole('CREATOR')")
    public ShippingAddressResponse updateShippingAddress(@Valid @RequestBody ShippingAddressRequest request) {
        return creatorService.updateShippingAddress(currentUser.id(), request);
    }
}
