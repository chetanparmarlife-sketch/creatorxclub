ALTER TABLE creator_profiles
    ADD COLUMN IF NOT EXISTS shipping_address JSONB;
