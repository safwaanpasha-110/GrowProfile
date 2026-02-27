-- GrowProfile Database Seed
-- Seeds plans, super admin user, and system settings

-- ─── Create Plans ──────────────────────────────────────────
INSERT INTO plans (id, name, display_name, price, first_month_price, max_ig_accounts, max_leads,
  allow_reels, allow_posts, allow_stories, allow_dms, allow_lives, advanced_flows, features, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'STARTER',
  'Starter',
  0,
  0,
  1,
  10,
  true,
  true,
  false,
  false,
  false,
  false,
  '{"autodm_reels": true, "autodm_posts": true, "autodm_stories": false, "autodm_dms": false, "autodm_lives": false, "lead_magnets": true, "advanced_flows": false, "monetization": false}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO plans (id, name, display_name, price, first_month_price, max_ig_accounts, max_leads,
  allow_reels, allow_posts, allow_stories, allow_dms, allow_lives, advanced_flows, features, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'CREATOR',
  'Creator',
  29.00,
  4.99,
  3,
  -1,
  true,
  true,
  true,
  true,
  true,
  true,
  '{"autodm_reels": true, "autodm_posts": true, "autodm_stories": true, "autodm_dms": true, "autodm_lives": true, "lead_magnets": true, "advanced_flows": true, "monetization": true, "follow_gate": true, "follow_ups": true, "email_collection": true}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING;

-- ─── Create Default Super Admin ────────────────────────────
-- This user will be linked when admin@growprofile.com signs in via Firebase
INSERT INTO users (id, firebase_uid, email, name, role, status, plan_id, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'pending_firebase_link',
  'admin@growprofile.com',
  'Super Admin',
  'SUPER_ADMIN',
  'ACTIVE',
  p.id,
  NOW(),
  NOW()
FROM plans p
WHERE p.name = 'STARTER'
ON CONFLICT (email) DO UPDATE SET role = 'SUPER_ADMIN';

-- ─── Create Default System Settings ────────────────────────
INSERT INTO system_settings (id, key, value, updated_at)
VALUES
  (gen_random_uuid(), 'maintenance_mode',
   '{"enabled": false, "message": "We are performing scheduled maintenance. Please try again later."}'::jsonb,
   NOW()),
  (gen_random_uuid(), 'global_rate_limits',
   '{"max_dms_per_account_per_day": 500, "max_comment_replies_per_hour": 750, "max_campaigns_free": 3, "max_campaigns_creator": 50}'::jsonb,
   NOW()),
  (gen_random_uuid(), 'default_messages',
   '{"comment_reply": "Thanks for commenting! Check your DMs 👀", "follow_request": "Hey! To get the link, please follow us and reply DONE 🙌", "follow_confirmed": "Awesome, thanks for following! Here''s your link: {link}", "not_following": "It looks like you haven''t followed yet. Please follow @{username} and reply DONE!"}'::jsonb,
   NOW()),
  (gen_random_uuid(), 'feature_flags',
   '{"story_autodm": true, "live_autodm": true, "dm_keyword_triggers": true, "referral_program": true, "email_collection": true}'::jsonb,
   NOW())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
