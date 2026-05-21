CREATE TYPE application_status AS ENUM ('PENDING', 'SHORTLISTED', 'APPROVED', 'REJECTED', 'COUNTERED');

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
    pitch_message TEXT NOT NULL,
    proposed_price DECIMAL(10,2),
    portfolio_links JSONB NOT NULL DEFAULT '[]'::jsonb,
    status application_status NOT NULL DEFAULT 'PENDING',
    brand_feedback TEXT,
    counter_offer_amount DECIMAL(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (campaign_id, creator_id)
);
