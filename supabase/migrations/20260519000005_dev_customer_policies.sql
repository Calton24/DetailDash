-- ⚠️ DEV ONLY — REMOVE BEFORE PRODUCTION AUTH LAUNCH ⚠️
-- Temporary RLS policies for test customer without Supabase Auth
-- These policies allow the test customer (20000000-0000-0000-0000-000000000001)
-- to create and view bookings, vehicles, and booking events without auth.uid()
-- TODO: Delete this entire migration before production and restore proper auth-based RLS

-- Test customer ID constant
-- Matches DEV_TEST_CUSTOMER_ID in src/config/dev.ts
DO $$ 
BEGIN
  -- Just documenting the test customer ID
  -- '20000000-0000-0000-0000-000000000001'
END $$;

-- ========================================
-- BOOKINGS: Allow test customer to insert and select
-- ========================================

CREATE POLICY "DEV: Test customer can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (customer_id = '20000000-0000-0000-0000-000000000001');

CREATE POLICY "DEV: Test customer can view their bookings"
  ON bookings FOR SELECT
  USING (customer_id = '20000000-0000-0000-0000-000000000001');

-- ========================================
-- VEHICLES: Allow test customer CRUD operations
-- ========================================

CREATE POLICY "DEV: Test customer can create vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (customer_id = '20000000-0000-0000-0000-000000000001');

CREATE POLICY "DEV: Test customer can view their vehicles"
  ON vehicles FOR SELECT
  USING (customer_id = '20000000-0000-0000-0000-000000000001');

CREATE POLICY "DEV: Test customer can update their vehicles"
  ON vehicles FOR UPDATE
  USING (customer_id = '20000000-0000-0000-0000-000000000001');

CREATE POLICY "DEV: Test customer can delete their vehicles"
  ON vehicles FOR DELETE
  USING (customer_id = '20000000-0000-0000-0000-000000000001');

-- ========================================
-- BOOKING_EVENTS: Allow creating events for test customer bookings
-- ========================================

CREATE POLICY "DEV: Test customer can create booking events"
  ON booking_events FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_id = '20000000-0000-0000-0000-000000000001'
    )
  );

CREATE POLICY "DEV: Test customer can view booking events"
  ON booking_events FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_id = '20000000-0000-0000-0000-000000000001'
    )
  );

-- ========================================
-- IMPORTANT: BEFORE PRODUCTION LAUNCH
-- ========================================
-- 1. Delete this entire migration file
-- 2. Wire up Supabase Auth in the mobile app
-- 3. Replace DEV_TEST_CUSTOMER_ID with auth.user().id
-- 4. Verify all RLS policies work with real auth.uid()
-- 5. Test with real user accounts, not test IDs
-- ========================================
