package com.creatorx.domain.notification.dto;

import java.util.List;

public record NotificationPageResponse(
    List<NotificationResponse> notifications,
    int page,
    int totalPages,
    long totalElements,
    boolean last
) {
}
