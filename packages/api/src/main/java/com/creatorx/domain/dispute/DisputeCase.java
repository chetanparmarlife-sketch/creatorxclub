package com.creatorx.domain.dispute;

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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dispute_cases")
public class DisputeCase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "campaign_id", nullable = false)
    private UUID campaignId;

    @Column(name = "raised_by_user_id", nullable = false)
    private UUID raisedByUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false)
    private Reason reason;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "evidence", nullable = false, columnDefinition = "jsonb")
    private String evidence;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "admin_notes")
    private String adminNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "resolution")
    private Resolution resolution;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public enum Reason {
        QUALITY_ISSUE,
        NON_PAYMENT,
        CONTRACT_BREACH,
        NON_COMPLIANCE,
        OTHER
    }

    public enum Status {
        OPEN,
        UNDER_REVIEW,
        RESOLVED
    }

    public enum Resolution {
        RELEASED_TO_CREATOR,
        REFUNDED_TO_BRAND
    }
}
