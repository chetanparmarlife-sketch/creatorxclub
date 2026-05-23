package com.creatorx.domain.application.dto;

import java.util.List;

public record ApplicationPageResponse(
    List<ApplicationResponse> applications,
    int page,
    int totalPages,
    long total
) {
}
