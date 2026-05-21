DO $$
DECLARE
    admin_id UUID := gen_random_uuid();
    creator_id UUID := gen_random_uuid();
    brand_user_id UUID := gen_random_uuid();
    cash_campaign_id UUID := gen_random_uuid();
    gifting_campaign_id UUID := gen_random_uuid();
    perfume_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO users (id, email, password_hash, user_type, status, notification_prefs)
    VALUES (
        admin_id,
        'admin@creatorx.dev',
        '$2y$10$.jE/MWFQwxu5sukGF5Nzr.9dI28gar/gGIcOuj151hoW4PQW10CdS',
        'ADMIN',
        'ACTIVE',
        '{"email": true, "push": true}'::jsonb
    );

    INSERT INTO users (id, email, phone_number, password_hash, user_type, status, notification_prefs)
    VALUES (
        creator_id,
        'creator@creatorx.dev',
        '+919999999991',
        '$2y$10$.jE/MWFQwxu5sukGF5Nzr.9dI28gar/gGIcOuj151hoW4PQW10CdS',
        'CREATOR',
        'ACTIVE',
        '{"email": true, "push": true, "sms": true}'::jsonb
    );

    INSERT INTO creator_profiles (
        user_id,
        display_name,
        bio,
        niche_categories,
        primary_platform,
        target_budget_min,
        target_budget_max,
        audience_demographics,
        follower_count,
        engagement_rate,
        kyc_status,
        kyc_documents,
        referral_code,
        available_balance
    )
    VALUES (
        creator_id,
        'Maya Creator',
        'Fashion and lifestyle creator building high-trust brand stories.',
        '["Fashion", "Lifestyle"]'::jsonb,
        'INSTAGRAM',
        10000.00,
        75000.00,
        '{"ageRanges": ["18-24", "25-34"], "topLocations": ["Mumbai", "Delhi", "Bengaluru"]}'::jsonb,
        50000,
        4.80,
        'APPROVED',
        '{"idFrontUrl": "seed/id-front.jpg", "idBackUrl": "seed/id-back.jpg", "selfieUrl": "seed/selfie.jpg"}'::jsonb,
        'TESTCREATOR',
        0.00
    );

    INSERT INTO social_accounts (creator_id, platform, access_token, follower_count, engagement_rate)
    VALUES (creator_id, 'INSTAGRAM', 'seed-token', 50000, 4.80);

    INSERT INTO users (id, email, password_hash, user_type, status, notification_prefs)
    VALUES (
        brand_user_id,
        'brand@creatorx.dev',
        '$2y$10$.jE/MWFQwxu5sukGF5Nzr.9dI28gar/gGIcOuj151hoW4PQW10CdS',
        'BRAND',
        'ACTIVE',
        '{"email": true, "push": true}'::jsonb
    );

    INSERT INTO brands (
        user_id,
        company_name,
        tax_id,
        gst_documents,
        verification_status,
        wallet_balance,
        escrow_allocated,
        total_spent
    )
    VALUES (
        brand_user_id,
        'Glossier India Test',
        'GSTINTEST1234',
        '["seed/gst-certificate.pdf"]'::jsonb,
        'APPROVED',
        100000.00,
        0.00,
        0.00
    );

    INSERT INTO brand_team_members (brand_id, user_id, email, role, invitation_status)
    VALUES (brand_user_id, brand_user_id, 'brand@creatorx.dev', 'OWNER', 'ACCEPTED');

    INSERT INTO inventory_items (
        id,
        brand_id,
        product_name,
        description,
        value,
        stock_count,
        sku,
        images,
        is_active
    )
    VALUES (
        perfume_id,
        brand_user_id,
        'Glossier You Perfume',
        'Seed product for physical gifting campaigns.',
        4800.00,
        25,
        'GLS-PERF-SEED',
        '["seed/glossier-you-perfume.jpg"]'::jsonb,
        true
    );

    INSERT INTO campaigns (
        id,
        brand_id,
        title,
        description,
        niche_categories,
        target_platforms,
        deliverable_requirements,
        sla_terms,
        usage_rights,
        compensation_type,
        total_budget,
        creator_payout,
        fixed_service_fee,
        negotiation_enabled,
        status,
        escrow_locked,
        inventory_items
    )
    VALUES (
        cash_campaign_id,
        brand_user_id,
        'Spring Glow Cash Campaign',
        'Create an Instagram Reel and carousel introducing the Spring Glow routine.',
        '["Fashion", "Lifestyle", "Beauty"]'::jsonb,
        '["INSTAGRAM"]'::jsonb,
        '{"contentType": "reel", "quantity": 1, "deadlineDays": 7}'::jsonb,
        'Submit draft content within 7 days of approval.',
        '{"exclusivity": "category", "duration": "6 months", "territory": "India", "restrictions": ["No competitor skincare ads for 30 days"]}'::jsonb,
        'CASH',
        50000.00,
        45000.00,
        0.00,
        true,
        'LIVE',
        false,
        '[]'::jsonb
    );

    INSERT INTO campaigns (
        id,
        brand_id,
        title,
        description,
        niche_categories,
        target_platforms,
        deliverable_requirements,
        sla_terms,
        usage_rights,
        compensation_type,
        total_budget,
        creator_payout,
        fixed_service_fee,
        negotiation_enabled,
        status,
        escrow_locked,
        inventory_items
    )
    VALUES (
        gifting_campaign_id,
        brand_user_id,
        'Glossier Gifting Creator Drop',
        'Receive and feature the Glossier You Perfume in a lifestyle story set.',
        '["Fashion", "Lifestyle"]'::jsonb,
        '["INSTAGRAM"]'::jsonb,
        '{"contentType": "stories", "quantity": 3, "deadlineDays": 5, "requiresProductReceipt": true}'::jsonb,
        'Confirm product receipt before uploading deliverables. Submit within 5 days of receipt.',
        '{"exclusivity": "none", "duration": "3 months", "territory": "India"}'::jsonb,
        'GIFTING',
        0.00,
        0.00,
        2500.00,
        false,
        'LIVE',
        false,
        jsonb_build_array(jsonb_build_object('inventoryItemId', perfume_id, 'quantity', 1))
    );
END $$;
