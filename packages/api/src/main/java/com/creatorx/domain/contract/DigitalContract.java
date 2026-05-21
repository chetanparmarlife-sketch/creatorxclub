package com.creatorx.domain.contract;

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
@Table(name = "digital_contracts")
public class DigitalContract {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "campaign_id", nullable = false)
    private UUID campaignId;

    @Column(name = "deliverable_id", nullable = false, unique = true)
    private UUID deliverableId;

    @Column(name = "usage_rights_snapshot", nullable = false, columnDefinition = "jsonb")
    private String usageRightsSnapshot;

    @Column(name = "creator_signature")
    private String creatorSignature;

    @Column(name = "brand_signature")
    private String brandSignature;

    @Column(name = "creator_signed_at")
    private Instant creatorSignedAt;

    @Column(name = "brand_signed_at")
    private Instant brandSignedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum Status {
        PENDING,
        COMPLETED
    }
}
