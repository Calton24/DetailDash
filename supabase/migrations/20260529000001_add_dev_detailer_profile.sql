-- =====================================================
-- Migration: Add DEV detailer profile
-- =====================================================
-- Purpose: Create a dev detailer profile row so booking_events
--          can reference a valid actor_id during detailer operations.
--
-- DEV ONLY - Remove once detailer auth is implemented
-- =====================================================

-- Insert dev detailer profile
INSERT INTO profiles (id, role, full_name, email, phone, avatar_url, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'detailer',
  'Apex Mobile Detail',
  'detailer@detaildash.dev',
  '+447000000001',
  null,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Comment for clarity
COMMENT ON TABLE profiles IS 'User profiles. DEV: Contains test detailer profile 10000000-0000-0000-0000-000000000001';
