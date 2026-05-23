package com.creatorx.domain.notification;

import com.creatorx.domain.notification.dto.MarkAllReadResponse;
import com.creatorx.domain.notification.dto.NotificationPageResponse;
import com.creatorx.domain.notification.dto.NotificationResponse;
import com.creatorx.domain.notification.dto.UnreadCountResponse;
import jakarta.persistence.EntityNotFoundException;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final StringRedisTemplate redisTemplate;

    public Notification sendToUser(UUID userId, Notification.Type type, String title, String message, String deepLink,
                                   Map<String, String> data) {
        Notification notification = notificationRepository.save(Notification.builder()
            .userId(userId)
            .type(type)
            .title(title)
            .message(message)
            .deepLink(deepLink)
            .isRead(false)
            .build());
        invalidateUnread(userId);
        return notification;
    }

    @Transactional(readOnly = true)
    public NotificationPageResponse list(UUID userId, Notification.Type type, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(Math.max(page, 0), Math.min(Math.max(limit, 1), 100));
        Page<Notification> notifications = notificationRepository.findByUserIdAndOptionalType(userId, type, pageRequest);
        return new NotificationPageResponse(
            notifications.getContent().stream().map(this::toResponse).toList(),
            notifications.getNumber(),
            notifications.getTotalPages(),
            notifications.getTotalElements(),
            notifications.isLast()
        );
    }

    @Transactional(readOnly = true)
    public UnreadCountResponse unreadCount(UUID userId) {
        String key = unreadKey(userId);
        String cached = redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return new UnreadCountResponse(Long.parseLong(cached));
        }
        long count = notificationRepository.countByUserIdAndIsReadFalse(userId);
        redisTemplate.opsForValue().set(key, Long.toString(count), Duration.ofSeconds(60));
        return new UnreadCountResponse(count);
    }

    @Transactional
    public MarkAllReadResponse markAllRead(UUID userId) {
        int updated = notificationRepository.markAllRead(userId);
        invalidateUnread(userId);
        return new MarkAllReadResponse(updated);
    }

    @Transactional
    public NotificationResponse markOneRead(UUID userId, UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new EntityNotFoundException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Notification does not belong to user");
        }
        notification.setIsRead(true);
        invalidateUnread(userId);
        return toResponse(notificationRepository.save(notification));
    }

    private void invalidateUnread(UUID userId) {
        redisTemplate.delete(unreadKey(userId));
    }

    private String unreadKey(UUID userId) {
        return "unread:" + userId;
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
            notification.getId(),
            notification.getType(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getDeepLink(),
            notification.getIsRead(),
            notification.getCreatedAt()
        );
    }
}
