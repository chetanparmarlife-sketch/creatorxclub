CREATE TYPE compensation_type AS ENUM ('CASH', 'GIFTING', 'DIGITAL', 'MIXED');
CREATE TYPE campaign_status AS ENUM ('DRAFT', 'PENDING_MODERATION', 'LIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(user_id) ON DELETE CASCADE,
    title VARCHAR(220) NOT NULL,
    description TEXT NOT NULL,
    niche_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
    target_platforms JSONB NOT NULL DEFAULT '[]'::jsonb,
    deliverable_requirements JSONB NOT NULL DEFAULT '{}'::jsonb,
    sla_terms TEXT,
    usage_rights JSONB NOT NULL DEFAULT '{}'::jsonb,
    compensation_type compensation_type NOT NULL,
    total_budget DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    creator_payout DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    fixed_service_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    negotiation_enabled BOOLEAN NOT NULL DEFAULT false,
    status campaign_status NOT NULL DEFAULT 'DRAFT',
    escrow_locked BOOLEAN NOT NULL DEFAULT false,
    inventory_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(user_id) ON DELETE CASCADE,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_count INTEGER NOT NULL DEFAULT 0,
    sku VARCHAR(100),
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT inventory_stock_non_negative CHECK (stock_count >= 0)
);
