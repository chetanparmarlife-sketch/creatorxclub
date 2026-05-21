CREATE TYPE deliverable_status AS ENUM ('PENDING_REVIEW', 'REVISION_REQUESTED', 'APPROVED', 'REJECTED');
CREATE TYPE digital_contract_status AS ENUM ('PENDING', 'COMPLETED');

CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
    content_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    captions TEXT,
    hashtags JSONB NOT NULL DEFAULT '[]'::jsonb,
    posting_instructions TEXT,
    submitted_at TIMESTAMPTZ,
    status deliverable_status NOT NULL DEFAULT 'PENDING_REVIEW',
    revision_notes TEXT,
    sla_deadline TIMESTAMPTZ NOT NULL,
    product_receipt_confirmed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (application_id)
);

CREATE TABLE digital_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    deliverable_id UUID NOT NULL UNIQUE REFERENCES deliverables(id) ON DELETE CASCADE,
    usage_rights_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    creator_signature TEXT,
    brand_signature TEXT,
    creator_signed_at TIMESTAMPTZ,
    brand_signed_at TIMESTAMPTZ,
    status digital_contract_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
