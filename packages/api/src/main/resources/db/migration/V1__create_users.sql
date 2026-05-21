CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_type AS ENUM ('CREATOR', 'BRAND', 'ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_DELETION');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(32),
    password_hash VARCHAR(255),
    user_type user_type NOT NULL,
    status user_status NOT NULL DEFAULT 'ACTIVE',
    notification_prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
