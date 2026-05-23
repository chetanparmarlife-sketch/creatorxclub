package com.creatorx.domain.notification.dto;

import com.creatorx.domain.notification.Notification;
import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
    UUID id,
    Notification.Type type,
    String title,
    String message,
    String deepLink,
    Boolean isRead,
    Instant createdAt
) {
}
