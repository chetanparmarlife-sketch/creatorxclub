CREATE TYPE chat_flag_status AS ENUM ('NONE', 'USER_FLAGGED', 'AUTO_FLAGGED');

CREATE TABLE chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(user_id) ON DELETE CASCADE,
    admin_joined BOOLEAN NOT NULL DEFAULT false,
    flag_status chat_flag_status NOT NULL DEFAULT 'NONE',
    sentiment_score REAL NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (campaign_id, creator_id, brand_id)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_admin_message BOOLEAN NOT NULL DEFAULT false,
    attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
