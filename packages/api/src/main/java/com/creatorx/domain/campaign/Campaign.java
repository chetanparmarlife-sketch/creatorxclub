package com.creatorx.domain.campaign;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
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
@Table(name = "campaigns")
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "brand_id", nullable = false)
    private UUID brandId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "niche_categories", nullable = false, columnDefinition = "jsonb")
    private String nicheCategories;

    @Column(name = "target_platforms", nullable = false, columnDefinition = "jsonb")
    private String targetPlatforms;

    @Column(name = "deliverable_requirements", nullable = false, columnDefinition = "jsonb")
    private String deliverableRequirements;

    @Column(name = "sla_terms")
    private String slaTerms;

    @Column(name = "usage_rights", nullable = false, columnDefinition = "jsonb")
    private String usageRights;

    @Enumerated(EnumType.STRING)
    @Column(name = "compensation_type", nullable = false)
    private CompensationType compensationType;

    @Column(name = "total_budget", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalBudget;

    @Column(name = "creator_payout", nullable = false, precision = 10, scale = 2)
    private BigDecimal creatorPayout;

    @Column(name = "fixed_service_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal fixedServiceFee;

    @Column(name = "negotiation_enabled", nullable = false)
    private Boolean negotiationEnabled;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "escrow_locked", nullable = false)
    private Boolean escrowLocked;

    @Column(name = "inventory_items", nullable = false, columnDefinition = "jsonb")
    private String inventoryItems;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum CompensationType {
        CASH,
        GIFTING,
        DIGITAL,
        MIXED
    }

    public enum Status {
        DRAFT,
        PENDING_MODERATION,
        LIVE,
        PAUSED,
        COMPLETED,
        CANCELLED
    }
}
