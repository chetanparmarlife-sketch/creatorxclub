package com.creatorx.domain.notification;

import com.creatorx.auth.CurrentUser;
import com.creatorx.domain.notification.dto.MarkAllReadResponse;
import com.creatorx.domain.notification.dto.NotificationPageResponse;
import com.creatorx.domain.notification.dto.NotificationResponse;
import com.creatorx.domain.notification.dto.UnreadCountResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final CurrentUser currentUser;

    @GetMapping
    @PreAuthorize("hasRole('CREATOR') or hasRole('BRAND') or hasRole('ADMIN')")
    public NotificationPageResponse list(
        @RequestParam(required = false) Notification.Type type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int limit
    ) {
        return notificationService.list(currentUser.id(), type, page, limit);
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public UnreadCountResponse unreadCount() {
        return notificationService.unreadCount(currentUser.id());
    }

    @PutMapping("/mark-all-read")
    @PreAuthorize("isAuthenticated()")
    public MarkAllReadResponse markAllRead() {
        return notificationService.markAllRead(currentUser.id());
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public NotificationResponse markOneRead(@PathVariable UUID id) {
        return notificationService.markOneRead(currentUser.id(), id);
    }
}
