CREATE TYPE dispute_reason AS ENUM ('QUALITY_ISSUE', 'NON_PAYMENT', 'CONTRACT_BREACH', 'NON_COMPLIANCE', 'OTHER');
CREATE TYPE dispute_status AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED');
CREATE TYPE dispute_resolution AS ENUM ('RELEASED_TO_CREATOR', 'REFUNDED_TO_BRAND');

CREATE TABLE dispute_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    raised_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason dispute_reason NOT NULL,
    evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    status dispute_status NOT NULL DEFAULT 'OPEN',
    admin_notes TEXT,
    resolution dispute_resolution,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
