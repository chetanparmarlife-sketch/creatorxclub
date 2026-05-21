package com.creatorx.domain.chat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chat_threads")
public class ChatThread {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "campaign_id", nullable = false)
    private UUID campaignId;

    @Column(name = "creator_id", nullable = false)
    private UUID creatorId;

    @Column(name = "brand_id", nullable = false)
    private UUID brandId;

    @Column(name = "admin_joined", nullable = false)
    private Boolean adminJoined;

    @Enumerated(EnumType.STRING)
    @Column(name = "flag_status", nullable = false)
    private FlagStatus flagStatus;

    @Column(name = "sentiment_score", nullable = false)
    private Float sentimentScore;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum FlagStatus {
        NONE,
        USER_FLAGGED,
        AUTO_FLAGGED
    }
}
