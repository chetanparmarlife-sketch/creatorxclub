CREATE TYPE brand_verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE brand_team_role AS ENUM ('OWNER', 'MANAGER', 'VIEWER');
CREATE TYPE invitation_status AS ENUM ('PENDING', 'ACCEPTED');

CREATE TABLE brands (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(100) NOT NULL,
    gst_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    verification_status brand_verification_status NOT NULL DEFAULT 'PENDING',
    wallet_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    escrow_allocated DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE brand_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(user_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    role brand_team_role NOT NULL,
    invitation_status invitation_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (brand_id, email)
);
