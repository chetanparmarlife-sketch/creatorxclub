package com.creatorx.domain.contract;

import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.contract.dto.ContractResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Component;

@Component
public class ContractMapper {

    public ContractResponse toResponse(DigitalContract contract, Campaign campaign) {
        BigDecimal netPayout = campaign == null ? BigDecimal.ZERO : campaign.getCreatorPayout()
            .multiply(BigDecimal.valueOf(0.90))
            .setScale(2, RoundingMode.HALF_UP);
        return new ContractResponse(
            contract.getId(),
            contract.getStatus(),
            contract.getUsageRightsSnapshot(),
            contract.getCreatorSignature(),
            contract.getBrandSignature(),
            contract.getCreatorSignedAt(),
            contract.getBrandSignedAt(),
            contract.getCampaignId(),
            netPayout
        );
    }
}
