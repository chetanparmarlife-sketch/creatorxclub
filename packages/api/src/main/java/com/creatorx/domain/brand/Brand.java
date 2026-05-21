package com.creatorx.domain.brand;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
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
@Table(name = "brands")
public class Brand {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "tax_id", nullable = false)
    private String taxId;

    @Column(name = "gst_documents", nullable = false, columnDefinition = "jsonb")
    private String gstDocuments;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private VerificationStatus verificationStatus;

    @Column(name = "wallet_balance", nullable = false, precision = 10, scale = 2)
    private BigDecimal walletBalance;

    @Column(name = "escrow_allocated", nullable = false, precision = 10, scale = 2)
    private BigDecimal escrowAllocated;

    @Column(name = "total_spent", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalSpent;

    @Version
    @Column(name = "version")
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum VerificationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
