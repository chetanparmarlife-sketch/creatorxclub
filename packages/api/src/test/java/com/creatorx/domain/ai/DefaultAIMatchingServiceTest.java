package com.creatorx.domain.ai;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.campaign.CampaignRepository;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;

@ExtendWith(MockitoExtension.class)
class DefaultAIMatchingServiceTest {

    @Mock
    private CreatorProfileRepository creatorProfileRepository;
    @Mock
    private CampaignRepository campaignRepository;
    @Mock
    private StringRedisTemplate redisTemplate;
    @Mock
    private ValueOperations<String, String> valueOperations;

    private DefaultAIMatchingService aiMatchingService;

    @BeforeEach
    void setUp() {
        aiMatchingService = new DefaultAIMatchingService(
            creatorProfileRepository,
            campaignRepository,
            redisTemplate,
            new ObjectMapper(),
            RestClient.builder()
        );
        ReflectionTestUtils.setField(aiMatchingService, "aiScoringApiUrl", "");
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void deterministicScoresAreReturnedAndCachedInRedis() {
        UUID creatorId = UUID.randomUUID();
        UUID campaignId = UUID.randomUUID();
        when(valueOperations.get("match:" + creatorId + ":" + campaignId)).thenReturn(null);
        when(creatorProfileRepository.findById(creatorId)).thenReturn(Optional.of(CreatorProfile.builder()
            .userId(creatorId)
            .nicheCategories("[\"Fashion\",\"Lifestyle\"]")
            .primaryPlatform(CreatorProfile.Platform.INSTAGRAM)
            .build()));
        when(campaignRepository.findById(campaignId)).thenReturn(Optional.of(Campaign.builder()
            .id(campaignId)
            .nicheCategories("[\"Fashion\",\"Beauty\"]")
            .targetPlatforms("[\"INSTAGRAM\"]")
            .build()));

        BigDecimal score = aiMatchingService.getMatchScore(creatorId, campaignId);

        assertThat(score).isBetween(new BigDecimal("55.0"), new BigDecimal("98.0"));
        verify(valueOperations).set(eq("match:" + creatorId + ":" + campaignId), eq(score.toPlainString()), any(Duration.class));
    }

    @Test
    void cachedScoreSkipsDeterministicCalculation() {
        UUID creatorId = UUID.randomUUID();
        UUID campaignId = UUID.randomUUID();
        when(valueOperations.get("match:" + creatorId + ":" + campaignId)).thenReturn("91.5");

        BigDecimal score = aiMatchingService.getMatchScore(creatorId, campaignId);

        assertThat(score).isEqualByComparingTo("91.5");
    }
}
