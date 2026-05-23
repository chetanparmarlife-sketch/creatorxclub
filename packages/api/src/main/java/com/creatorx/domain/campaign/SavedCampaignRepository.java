package com.creatorx.domain.campaign;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedCampaignRepository extends JpaRepository<SavedCampaign, SavedCampaignId> {

    boolean existsByCreatorIdAndCampaignId(UUID creatorId, UUID campaignId);

    void deleteByCreatorIdAndCampaignId(UUID creatorId, UUID campaignId);

    List<SavedCampaign> findByCreatorIdOrderByCreatedAtDesc(UUID creatorId);
}
