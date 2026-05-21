CREATE INDEX idx_creator_profiles_user_id ON creator_profiles(user_id);

CREATE INDEX idx_social_accounts_creator_id ON social_accounts(creator_id);

CREATE INDEX idx_brands_user_id ON brands(user_id);

CREATE INDEX idx_brand_team_members_brand_id ON brand_team_members(brand_id);
CREATE INDEX idx_brand_team_members_user_id ON brand_team_members(user_id);

CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_inventory_items_brand_id ON inventory_items(brand_id);

CREATE INDEX idx_applications_campaign_id ON applications(campaign_id);
CREATE INDEX idx_applications_creator_id ON applications(creator_id);

CREATE INDEX idx_deliverables_application_id ON deliverables(application_id);
CREATE INDEX idx_deliverables_campaign_id ON deliverables(campaign_id);
CREATE INDEX idx_deliverables_creator_id ON deliverables(creator_id);
CREATE INDEX idx_digital_contracts_campaign_id ON digital_contracts(campaign_id);
CREATE INDEX idx_digital_contracts_deliverable_id ON digital_contracts(deliverable_id);

CREATE INDEX idx_transactions_from_user_id ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user_id ON transactions(to_user_id);
CREATE INDEX idx_transactions_campaign_id ON transactions(campaign_id);

CREATE INDEX idx_chat_threads_campaign_id ON chat_threads(campaign_id);
CREATE INDEX idx_chat_threads_creator_id ON chat_threads(creator_id);
CREATE INDEX idx_chat_threads_brand_id ON chat_threads(brand_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);

CREATE INDEX idx_dispute_cases_campaign_id ON dispute_cases(campaign_id);
CREATE INDEX idx_dispute_cases_raised_by_user_id ON dispute_cases(raised_by_user_id);

CREATE INDEX idx_community_posts_author_id ON community_posts(author_id);

CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_sponsored_by_brand_id ON events(sponsored_by_brand_id);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_creator_id ON event_registrations(creator_id);
CREATE INDEX idx_event_sponsorships_event_id ON event_sponsorships(event_id);
CREATE INDEX idx_event_sponsorships_brand_id ON event_sponsorships(brand_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);

CREATE INDEX idx_referral_records_referrer_id ON referral_records(referrer_id);
CREATE INDEX idx_referral_records_referee_id ON referral_records(referee_id);

CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_creator_profiles_kyc_status ON creator_profiles(kyc_status);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_deliverables_status ON deliverables(status);
CREATE INDEX idx_deliverables_sla_deadline ON deliverables(sla_deadline);
CREATE INDEX idx_notifications_user_id_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_chat_messages_thread_id_created_at ON chat_messages(thread_id, created_at);
CREATE INDEX idx_dispute_cases_status ON dispute_cases(status);

-- transactions.idempotency_key is already backed by a unique constraint from V7.
