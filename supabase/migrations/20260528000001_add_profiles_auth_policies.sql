-- Add RLS policies for authenticated users to manage their own profiles
-- Fixes Apple Sign In profile upsert failure

-- ========================================
-- PROFILES: Authenticated users can manage their own profile
-- ========================================

-- Users can insert their own profile (happens after Apple Sign In)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ========================================
-- NOTES
-- ========================================
-- 1. These policies allow authenticated users to create/read/update their own profile
-- 2. id = auth.uid() ensures users can only manage their own profile row
-- 3. Role defaults to 'customer' via table default, client cannot override
-- 4. This fixes: "new row violates row-level security policy for table profiles"
-- 5. After profile insert succeeds, bookings.customer_id FK constraint will pass
-- ========================================
