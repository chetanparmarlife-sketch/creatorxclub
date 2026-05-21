CREATE TYPE event_type AS ENUM ('VIRTUAL', 'PHYSICAL');
CREATE TYPE event_sponsorship_status AS ENUM ('PENDING', 'COMPLETED');

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(220) NOT NULL,
    description TEXT,
    event_type event_type NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    registration_count INTEGER NOT NULL DEFAULT 0,
    sponsored_by_brand_id UUID REFERENCES brands(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT events_capacity_positive CHECK (capacity > 0),
    CONSTRAINT events_registration_count_non_negative CHECK (registration_count >= 0)
);

CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reminder_sent BOOLEAN NOT NULL DEFAULT false,
    UNIQUE (event_id, creator_id)
);

CREATE TABLE event_sponsorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(user_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    tier VARCHAR(100),
    razorpay_ref VARCHAR(255),
    status event_sponsorship_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
