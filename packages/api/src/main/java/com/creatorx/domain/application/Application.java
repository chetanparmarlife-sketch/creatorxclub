package com.creatorx.domain.application;

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
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "campaign_id", nullable = false)
    private UUID campaignId;

    @Column(name = "creator_id", nullable = false)
    private UUID creatorId;

    @Column(name = "pitch_message", nullable = false)
    private String pitchMessage;

    @Column(name = "proposed_price", precision = 10, scale = 2)
    private BigDecimal proposedPrice;

    @Column(name = "portfolio_links", nullable = false, columnDefinition = "jsonb")
    private String portfolioLinks;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "brand_feedback")
    private String brandFeedback;

    @Column(name = "counter_offer_amount", precision = 10, scale = 2)
    private BigDecimal counterOfferAmount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum Status {
        PENDING,
        SHORTLISTED,
        APPROVED,
        REJECTED,
        COUNTERED
    }
}
