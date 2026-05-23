package com.creatorx.domain.campaign;

import java.io.Serializable;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedCampaignId implements Serializable {

    private UUID creatorId;
    private UUID campaignId;
}
