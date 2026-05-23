package com.creatorx.domain.creator.dto;

import jakarta.validation.constraints.NotBlank;

public record ShippingAddressRequest(
    @NotBlank String street,
    @NotBlank String city,
    @NotBlank String state,
    @NotBlank String pincode,
    @NotBlank String country
) {
}
