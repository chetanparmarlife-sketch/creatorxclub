package com.creatorx.domain.notification;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    @Query("""
        select n
        from Notification n
        where n.userId = :userId
        order by n.createdAt desc
        """)
    Page<Notification> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId, Pageable pageable);

    @Query("""
        select count(n)
        from Notification n
        where n.userId = :userId
          and n.isRead = false
        """)
    long countByUserIdAndIsReadFalse(@Param("userId") UUID userId);

    @Query("""
        select n
        from Notification n
        where n.userId = :userId
          and (:type is null or n.type = :type)
        order by n.createdAt desc
        """)
    Page<Notification> findByUserIdAndOptionalType(
        @Param("userId") UUID userId,
        @Param("type") Notification.Type type,
        Pageable pageable
    );

    @Modifying
    @Query("""
        update Notification n
        set n.isRead = true
        where n.userId = :userId
          and n.isRead = false
        """)
    int markAllRead(@Param("userId") UUID userId);
}
