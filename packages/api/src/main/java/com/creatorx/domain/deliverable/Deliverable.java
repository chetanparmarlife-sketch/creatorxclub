package com.creatorx.domain.deliverable;

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
@Table(name = "deliverables")
public class Deliverable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "application_id", nullable = false)
    private UUID applicationId;

    @Column(name = "campaign_id", nullable = false)
    private UUID campaignId;

    @Column(name = "creator_id", nullable = false)
    private UUID creatorId;

    @Column(name = "content_files", nullable = false, columnDefinition = "jsonb")
    private String contentFiles;

    @Column(name = "captions")
    private String captions;

    @Column(name = "hashtags", nullable = false, columnDefinition = "jsonb")
    private String hashtags;

    @Column(name = "posting_instructions")
    private String postingInstructions;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "revision_notes")
    private String revisionNotes;

    @Column(name = "sla_deadline", nullable = false)
    private Instant slaDeadline;

    @Column(name = "product_receipt_confirmed", nullable = false)
    private Boolean productReceiptConfirmed;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum Status {
        PENDING_REVIEW,
        REVISION_REQUESTED,
        APPROVED,
        REJECTED
    }
}
