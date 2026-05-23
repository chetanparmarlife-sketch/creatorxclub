package com.creatorx.domain.dispute;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisputeCaseRepository extends JpaRepository<DisputeCase, UUID> {
    boolean existsByCampaignIdAndStatusIn(UUID campaignId, Collection<DisputeCase.Status> statuses);

    Optional<DisputeCase> findByCampaignIdAndRaisedByUserId(UUID campaignId, UUID raisedByUserId);
}
