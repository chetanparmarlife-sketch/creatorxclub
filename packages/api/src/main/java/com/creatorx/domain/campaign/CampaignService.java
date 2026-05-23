package com.creatorx.domain.campaign;

import com.creatorx.domain.ai.AIMatchingService;
import com.creatorx.domain.application.Application;
import com.creatorx.domain.application.ApplicationRepository;
import com.creatorx.domain.brand.Brand;
import com.creatorx.domain.brand.BrandRepository;
import com.creatorx.domain.campaign.dto.CampaignDetailResponse;
import com.creatorx.domain.campaign.dto.CampaignFeedResponse;
import com.creatorx.domain.campaign.dto.CampaignFilterRequest;
import com.creatorx.domain.campaign.dto.CampaignSummaryResponse;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.creatorx.domain.user.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };
    private static final TypeReference<List<Map<String, Object>>> MAP_LIST = new TypeReference<>() {
    };

    private final CampaignRepository campaignRepository;
    private final BrandRepository brandRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final SavedCampaignRepository savedCampaignRepository;
    private final ApplicationRepository applicationRepository;
    private final AIMatchingService aiMatchingService;
    private final ObjectMapper objectMapper;

    @Value("${creatorx.platform.fee-percent:10}")
    private BigDecimal platformFeePercent;

    @Transactional(readOnly = true)
    public CampaignFeedResponse getExploreCampaigns(UUID creatorId, CampaignFilterRequest filters) {
        creatorProfileRepository.findById(creatorId)
            .orElseThrow(() -> new EntityNotFoundException("Creator profile not found"));

        Page<Campaign> page = campaignRepository.findAll(
            liveCampaignSpecification(filters),
            PageRequest.of(filters.pageOrDefault(), filters.limitOrDefault())
        );

        Set<UUID> savedIds = savedCampaignIds(creatorId);
        List<CampaignSummaryResponse> campaigns = page.getContent().stream()
            .map(campaign -> toSummary(campaign, creatorId, savedIds.contains(campaign.getId())))
            .sorted(Comparator.comparing(CampaignSummaryResponse::matchScore).reversed())
            .toList();

        return new CampaignFeedResponse(campaigns, page.getNumber(), page.getTotalPages(), page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public CampaignDetailResponse getCampaignDetail(UUID requesterId, User.UserType requesterType, UUID campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        Brand brand = brandRepository.findById(campaign.getBrandId())
            .orElseThrow(() -> new EntityNotFoundException("Brand not found"));

        if (requesterType == User.UserType.CREATOR && brand.getVerificationStatus() != Brand.VerificationStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Creators cannot view campaigns from unverified brands");
        }

        BigDecimal creatorNetPayout = requesterType == User.UserType.CREATOR
            ? creatorNetPayout(campaign.getCreatorPayout())
            : null;
        return toDetail(campaign, brand, creatorNetPayout);
    }

    @Transactional(readOnly = true)
    public Application getMyApplication(UUID creatorId, UUID campaignId) {
        return applicationRepository.findByCampaignIdAndCreatorId(campaignId, creatorId)
            .orElseThrow(() -> new EntityNotFoundException("Application not found"));
    }

    @Transactional
    public void saveCampaign(UUID creatorId, UUID campaignId) {
        if (!campaignRepository.existsById(campaignId)) {
            throw new EntityNotFoundException("Campaign not found");
        }
        if (!savedCampaignRepository.existsByCreatorIdAndCampaignId(creatorId, campaignId)) {
            savedCampaignRepository.save(SavedCampaign.builder()
                .creatorId(creatorId)
                .campaignId(campaignId)
                .build());
        }
    }

    @Transactional
    public void deleteSavedCampaign(UUID creatorId, UUID campaignId) {
        savedCampaignRepository.deleteByCreatorIdAndCampaignId(creatorId, campaignId);
    }

    @Transactional(readOnly = true)
    public List<UUID> getSavedCampaignIds(UUID creatorId) {
        return savedCampaignRepository.findByCreatorIdOrderByCreatedAtDesc(creatorId).stream()
            .map(SavedCampaign::getCampaignId)
            .toList();
    }

    private Specification<Campaign> liveCampaignSpecification(CampaignFilterRequest filters) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(builder.equal(root.get("status"), Campaign.Status.LIVE));

            if (filters.compensationType() != null) {
                predicates.add(builder.equal(root.get("compensationType"), filters.compensationType()));
            }
            if (filters.platform() != null) {
                predicates.add(jsonContains(builder, root.get("targetPlatforms"), filters.platform().name()));
            }
            if (StringUtils.hasText(filters.category())) {
                predicates.add(jsonContains(builder, root.get("nicheCategories"), filters.category()));
            }
            if (filters.budgetMin() != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("totalBudget"), filters.budgetMin()));
            }
            if (filters.budgetMax() != null) {
                predicates.add(builder.lessThanOrEqualTo(root.get("totalBudget"), filters.budgetMax()));
            }
            if (StringUtils.hasText(filters.search())) {
                String search = "%" + filters.search().toLowerCase(Locale.ROOT) + "%";
                predicates.add(builder.or(
                    builder.like(builder.lower(root.get("title")), search),
                    builder.like(builder.lower(root.get("description")), search)
                ));
            }

            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Predicate jsonContains(jakarta.persistence.criteria.CriteriaBuilder builder,
                                   jakarta.persistence.criteria.Expression<String> path,
                                   String value) {
        return builder.like(builder.lower(path), "%" + value.toLowerCase(Locale.ROOT) + "%");
    }

    private CampaignSummaryResponse toSummary(Campaign campaign, UUID creatorId, boolean isSaved) {
        Brand brand = brandRepository.findById(campaign.getBrandId()).orElse(null);
        return new CampaignSummaryResponse(
            campaign.getId(),
            brand == null ? "Unknown Brand" : brand.getCompanyName(),
            null,
            brand != null && brand.getVerificationStatus() == Brand.VerificationStatus.APPROVED,
            campaign.getTitle(),
            parseStringList(campaign.getNicheCategories()),
            parseStringList(campaign.getTargetPlatforms()),
            campaign.getCompensationType(),
            creatorNetPayout(campaign.getCreatorPayout()),
            aiMatchingService.getMatchScore(creatorId, campaign.getId()),
            campaign.getSlaTerms(),
            isSaved
        );
    }

    private CampaignDetailResponse toDetail(Campaign campaign, Brand brand, BigDecimal creatorNetPayout) {
        return new CampaignDetailResponse(
            campaign.getId(),
            campaign.getTitle(),
            campaign.getDescription(),
            parseStringList(campaign.getNicheCategories()),
            parseStringList(campaign.getTargetPlatforms()),
            campaign.getDeliverableRequirements(),
            campaign.getSlaTerms(),
            campaign.getUsageRights(),
            campaign.getCompensationType(),
            campaign.getTotalBudget(),
            campaign.getCreatorPayout(),
            creatorNetPayout,
            campaign.getFixedServiceFee(),
            Boolean.TRUE.equals(campaign.getNegotiationEnabled()),
            campaign.getStatus(),
            inventoryItems(campaign),
            brandProfile(brand),
            campaign.getCreatedAt(),
            campaign.getUpdatedAt()
        );
    }

    private CampaignDetailResponse.BrandProfileResponse brandProfile(Brand brand) {
        List<Campaign> campaigns = campaignRepository.findByBrandId(brand.getUserId());
        BigDecimal averagePayout = campaigns.stream()
            .map(Campaign::getCreatorPayout)
            .filter(java.util.Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (!campaigns.isEmpty()) {
            averagePayout = averagePayout.divide(BigDecimal.valueOf(campaigns.size()), 2, RoundingMode.HALF_UP);
        }

        return new CampaignDetailResponse.BrandProfileResponse(
            brand.getUserId(),
            brand.getCompanyName(),
            null,
            brand.getVerificationStatus() == Brand.VerificationStatus.APPROVED,
            campaigns.size(),
            BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP),
            averagePayout
        );
    }

    private List<CampaignDetailResponse.InventoryItemResponse> inventoryItems(Campaign campaign) {
        List<UUID> ids = parseInventoryIds(campaign.getInventoryItems());
        if (!ids.isEmpty()) {
            return inventoryItemRepository.findAllById(ids).stream()
                .map(this::toInventoryResponse)
                .toList();
        }

        return parseInventoryObjects(campaign.getInventoryItems());
    }

    private CampaignDetailResponse.InventoryItemResponse toInventoryResponse(InventoryItem item) {
        return new CampaignDetailResponse.InventoryItemResponse(
            item.getId(),
            item.getProductName(),
            item.getDescription(),
            item.getValue(),
            item.getStockCount(),
            item.getSku(),
            item.getImages(),
            item.getIsActive()
        );
    }

    private List<CampaignDetailResponse.InventoryItemResponse> parseInventoryObjects(String json) {
        try {
            return objectMapper.readValue(json, MAP_LIST).stream()
                .map(this::inventoryFromMap)
                .toList();
        } catch (Exception ignored) {
            return List.of();
        }
    }

    private CampaignDetailResponse.InventoryItemResponse inventoryFromMap(Map<String, Object> item) {
        return new CampaignDetailResponse.InventoryItemResponse(
            uuid(item, "id"),
            string(item, "productName", "product_name", "name"),
            string(item, "description"),
            decimal(item, "value"),
            integer(item, "stockCount", "stock_count"),
            string(item, "sku"),
            jsonString(item.get("images")),
            bool(item, "isActive", "is_active")
        );
    }

    private List<UUID> parseInventoryIds(String json) {
        return parseStringList(json).stream()
            .map(value -> {
                try {
                    return UUID.fromString(value);
                } catch (IllegalArgumentException ignored) {
                    return null;
                }
            })
            .filter(java.util.Objects::nonNull)
            .toList();
    }

    private Set<UUID> savedCampaignIds(UUID creatorId) {
        return new LinkedHashSet<>(getSavedCampaignIds(creatorId));
    }

    private BigDecimal creatorNetPayout(BigDecimal creatorPayout) {
        if (creatorPayout == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        BigDecimal multiplier = BigDecimal.valueOf(100).subtract(platformFeePercent)
            .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        return creatorPayout.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }

    private List<String> parseStringList(String json) {
        if (!StringUtils.hasText(json)) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, STRING_LIST);
        } catch (Exception ignored) {
            return List.of();
        }
    }

    private String string(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            Object value = map.get(key);
            if (value != null) {
                return value.toString();
            }
        }
        return null;
    }

    private UUID uuid(Map<String, Object> map, String key) {
        String value = string(map, key);
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private BigDecimal decimal(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) {
            return null;
        }
        return new BigDecimal(value.toString());
    }

    private Integer integer(Map<String, Object> map, String... keys) {
        String value = string(map, keys);
        return StringUtils.hasText(value) ? Integer.valueOf(value) : null;
    }

    private Boolean bool(Map<String, Object> map, String... keys) {
        String value = string(map, keys);
        return StringUtils.hasText(value) ? Boolean.valueOf(value) : null;
    }

    private String jsonString(Object value) {
        if (value == null) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ignored) {
            return value.toString();
        }
    }
}
