-- Seed test customer for MVP development
-- TODO: Remove before production launch
-- WARNING: This temporarily drops the profiles → auth.users foreign key constraint
-- because auth is not wired up yet. This must be restored before production.

-- Drop foreign key constraint temporarily (MVP only)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Create test customer profile (not linked to auth.users)
INSERT INTO profiles (
  id,
  role,
  full_name,
  email,
  phone,
  avatar_url
) VALUES (
  '20000000-0000-0000-0000-000000000001'::UUID,
  'customer',
  'Test Customer',
  'test@detaildash.dev',
  '+44 7700 900000',
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Note: The foreign key will be restored when Supabase Auth is properly integrated

-- Note: This profile is not linked to auth.users (auth not wired yet)
-- Once auth is implemented, this should be removed and replaced with real authenticated users
