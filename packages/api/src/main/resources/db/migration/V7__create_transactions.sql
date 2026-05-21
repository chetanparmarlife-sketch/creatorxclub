CREATE TYPE transaction_type AS ENUM (
    'ESCROW_LOCK',
    'ESCROW_RELEASE',
    'CREATOR_WITHDRAWAL',
    'BRAND_DEPOSIT',
    'PLATFORM_FEE',
    'REFUND',
    'REFERRAL_CREDIT'
);
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type transaction_type NOT NULL,
    from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_amount DECIMAL(10,2) NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE,
    razorpay_ref VARCHAR(255),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    status transaction_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
