package com.creatorx.domain.ai;

import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.campaign.CampaignRepository;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class DefaultAIMatchingService implements AIMatchingService {

    private static final Duration CACHE_TTL = Duration.ofHours(1);
    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final CreatorProfileRepository creatorProfileRepository;
    private final CampaignRepository campaignRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final RestClient.Builder restClientBuilder;

    @Value("${creatorx.ai-scoring.api-url:}")
    private String aiScoringApiUrl;

    @Value("${creatorx.ai-scoring.api-key:}")
    private String aiScoringApiKey;

    @Override
    public BigDecimal getMatchScore(UUID creatorId, UUID campaignId) {
        String cacheKey = "match:%s:%s".formatted(creatorId, campaignId);
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (StringUtils.hasText(cached)) {
            return new BigDecimal(cached);
        }

        BigDecimal score = externalScore(creatorId, campaignId);
        if (score == null) {
            score = deterministicScore(creatorId, campaignId);
        }

        redisTemplate.opsForValue().set(cacheKey, score.toPlainString(), CACHE_TTL);
        return score;
    }

    private BigDecimal externalScore(UUID creatorId, UUID campaignId) {
        if (!StringUtils.hasText(aiScoringApiUrl)) {
            return null;
        }

        try {
            Map<String, Object> response = restClientBuilder.build()
                .post()
                .uri(aiScoringApiUrl)
                .header("X-API-Key", aiScoringApiKey == null ? "" : aiScoringApiKey)
                .body(Map.of("creatorId", creatorId, "campaignId", campaignId))
                .retrieve()
                .body(Map.class);

            Object rawScore = response == null ? null : response.getOrDefault("score", response.get("matchScore"));
            if (rawScore == null) {
                return null;
            }
            return clamp(new BigDecimal(rawScore.toString())).setScale(1, RoundingMode.HALF_UP);
        } catch (Exception ignored) {
            return null;
        }
    }

    private BigDecimal deterministicScore(UUID creatorId, UUID campaignId) {
        CreatorProfile creator = creatorProfileRepository.findById(creatorId)
            .orElseThrow(() -> new EntityNotFoundException("Creator profile not found"));
        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));

        Set<String> creatorNiches = normalize(parseList(creator.getNicheCategories()));
        List<String> campaignNiches = parseList(campaign.getNicheCategories());
        Set<String> campaignNicheSet = normalize(campaignNiches);

        long matchingNiches = campaignNicheSet.stream().filter(creatorNiches::contains).count();
        double nicheOverlap = campaignNicheSet.isEmpty() ? 0.0 : (double) matchingNiches / campaignNicheSet.size();

        Set<String> targetPlatforms = normalize(parseList(campaign.getTargetPlatforms()));
        String primaryPlatform = creator.getPrimaryPlatform() == null ? "" : creator.getPrimaryPlatform().name();
        double platformMatch = targetPlatforms.contains(primaryPlatform.toLowerCase(Locale.ROOT)) ? 1.0 : 0.5;

        double baseScore = (nicheOverlap * 0.6 + platformMatch * 0.4) * 100.0;
        int variation = Math.abs((creatorId.hashCode() ^ campaignId.hashCode()) % 10);
        return clamp(BigDecimal.valueOf(baseScore + variation)).setScale(1, RoundingMode.HALF_UP);
    }

    private BigDecimal clamp(BigDecimal score) {
        BigDecimal minimum = BigDecimal.valueOf(55);
        BigDecimal maximum = BigDecimal.valueOf(98);
        if (score.compareTo(minimum) < 0) {
            return minimum;
        }
        if (score.compareTo(maximum) > 0) {
            return maximum;
        }
        return score;
    }

    private List<String> parseList(String json) {
        if (!StringUtils.hasText(json)) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, STRING_LIST);
        } catch (Exception ignored) {
            return List.of();
        }
    }

    private Set<String> normalize(List<String> values) {
        return values.stream()
            .filter(StringUtils::hasText)
            .map(value -> value.toLowerCase(Locale.ROOT))
            .collect(Collectors.toSet());
    }
}
