package com.creatorx.domain.creator;

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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "social_accounts")
public class SocialAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "creator_id", nullable = false)
    private UUID creatorId;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform", nullable = false)
    private CreatorProfile.Platform platform;

    @Column(name = "access_token")
    private String accessToken;

    @Column(name = "follower_count", nullable = false)
    private Integer followerCount;

    @Column(name = "engagement_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal engagementRate;

    @Column(name = "synced_at", nullable = false)
    private Instant syncedAt;
}
