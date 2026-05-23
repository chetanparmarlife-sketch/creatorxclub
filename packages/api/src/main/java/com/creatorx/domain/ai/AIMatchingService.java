package com.creatorx.domain.ai;

import java.math.BigDecimal;
import java.util.UUID;

public interface AIMatchingService {

    BigDecimal getMatchScore(UUID creatorId, UUID campaignId);
}
