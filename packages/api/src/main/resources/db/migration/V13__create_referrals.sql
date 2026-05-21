CREATE TYPE referral_status AS ENUM ('PENDING', 'COMPLETED');

CREATE TABLE referral_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referee_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    status referral_status NOT NULL DEFAULT 'PENDING',
    reward_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    credited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT referral_not_self CHECK (referrer_id <> referee_id)
);
