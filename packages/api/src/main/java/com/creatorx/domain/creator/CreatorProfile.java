package com.creatorx.domain.creator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "creator_profiles")
public class CreatorProfile {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "bio")
    private String bio;

    @Column(name = "niche_categories", nullable = false, columnDefinition = "jsonb")
    private String nicheCategories;

    @Enumerated(EnumType.STRING)
    @Column(name = "primary_platform")
    private Platform primaryPlatform;

    @Column(name = "target_budget_min", precision = 10, scale = 2)
    private BigDecimal targetBudgetMin;

    @Column(name = "target_budget_max", precision = 10, scale = 2)
    private BigDecimal targetBudgetMax;

    @Column(name = "audience_demographics", nullable = false, columnDefinition = "jsonb")
    private String audienceDemographics;

    @Column(name = "follower_count", nullable = false)
    private Integer followerCount;

    @Column(name = "engagement_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal engagementRate;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    private KycStatus kycStatus;

    @Column(name = "kyc_documents", nullable = false, columnDefinition = "jsonb")
    private String kycDocuments;

    @Column(name = "referral_code", nullable = false, unique = true)
    private String referralCode;

    @Column(name = "available_balance", nullable = false, precision = 10, scale = 2)
    private BigDecimal availableBalance;

    @Column(name = "product_receipt_confirmed", nullable = false)
    private Boolean productReceiptConfirmed;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum Platform {
        INSTAGRAM,
        YOUTUBE,
        TIKTOK
    }

    public enum KycStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
