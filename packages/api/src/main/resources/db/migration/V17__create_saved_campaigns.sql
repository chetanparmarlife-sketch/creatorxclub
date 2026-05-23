CREATE TABLE saved_campaigns (
    creator_id UUID NOT NULL REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (creator_id, campaign_id)
);

CREATE INDEX idx_saved_campaigns_campaign_id ON saved_campaigns(campaign_id);
