package com.creatorx.domain.notification;

import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification sendToUser(UUID userId, Notification.Type type, String title, String message, String deepLink,
                                   Map<String, String> data) {
        return notificationRepository.save(Notification.builder()
            .userId(userId)
            .type(type)
            .title(title)
            .message(message)
            .deepLink(deepLink)
            .isRead(false)
            .build());
    }
}
