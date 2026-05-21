CREATE TYPE notification_type AS ENUM ('CAMPAIGN', 'PAYMENT', 'SYSTEM', 'CHAT');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(180) NOT NULL,
    message TEXT NOT NULL,
    deep_link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
