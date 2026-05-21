CREATE TYPE social_platform AS ENUM ('INSTAGRAM', 'YOUTUBE', 'TIKTOK');
CREATE TYPE kyc_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE creator_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(160) NOT NULL,
    bio TEXT,
    niche_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
    primary_platform social_platform,
    target_budget_min DECIMAL(10,2),
    target_budget_max DECIMAL(10,2),
    audience_demographics JSONB NOT NULL DEFAULT '{}'::jsonb,
    follower_count INTEGER NOT NULL DEFAULT 0,
    engagement_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    kyc_status kyc_status NOT NULL DEFAULT 'PENDING',
    kyc_documents JSONB NOT NULL DEFAULT '{}'::jsonb,
    referral_code VARCHAR(64) NOT NULL UNIQUE,
    available_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    product_receipt_confirmed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT creator_budget_range_valid CHECK (
        target_budget_min IS NULL
        OR target_budget_max IS NULL
        OR target_budget_min <= target_budget_max
    )
);

CREATE TABLE social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    access_token TEXT,
    follower_count INTEGER NOT NULL DEFAULT 0,
    engagement_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (creator_id, platform)
);
