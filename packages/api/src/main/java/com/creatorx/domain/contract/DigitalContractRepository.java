package com.creatorx.domain.contract;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DigitalContractRepository extends JpaRepository<DigitalContract, UUID> {
    Optional<DigitalContract> findByCampaignId(UUID campaignId);

    Optional<DigitalContract> findByDeliverableId(UUID deliverableId);
}
