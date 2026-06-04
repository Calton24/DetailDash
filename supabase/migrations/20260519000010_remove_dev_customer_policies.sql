-- Remove DEV customer policies and replace with proper auth.uid() policies
-- Part 1: Drop all DEV test customer policies

-- ========================================
-- DROP DEV CUSTOMER POLICIES
-- ========================================

-- Drop bookings policies
DROP POLICY IF EXISTS "DEV: Test customer can create bookings" ON bookings;
DROP POLICY IF EXISTS "DEV: Test customer can view their bookings" ON bookings;

-- Drop vehicles policies
DROP POLICY IF EXISTS "DEV: Test customer can create vehicles" ON vehicles;
DROP POLICY IF EXISTS "DEV: Test customer can view their vehicles" ON vehicles;
DROP POLICY IF EXISTS "DEV: Test customer can update their vehicles" ON vehicles;
DROP POLICY IF EXISTS "DEV: Test customer can delete their vehicles" ON vehicles;

-- Drop booking_events policies
DROP POLICY IF EXISTS "DEV: Test customer can create booking events" ON booking_events;
DROP POLICY IF EXISTS "DEV: Test customer can view booking events" ON booking_events;

-- ========================================
-- CREATE PROPER AUTH-BASED POLICIES
-- ========================================

-- BOOKINGS: Customers can manage their own bookings

DROP POLICY IF EXISTS "Customers can create their own bookings" ON bookings;
CREATE POLICY "Customers can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Customers can view their own bookings" ON bookings;
CREATE POLICY "Customers can view their own bookings"
  ON bookings FOR SELECT
  USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Customers can update their own bookings" ON bookings;
CREATE POLICY "Customers can update their own bookings"
  ON bookings FOR UPDATE
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- VEHICLES: Customers can manage their own vehicles

DROP POLICY IF EXISTS "Customers can create their own vehicles" ON vehicles;
CREATE POLICY "Customers can create their own vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Customers can view their own vehicles" ON vehicles;
CREATE POLICY "Customers can view their own vehicles"
  ON vehicles FOR SELECT
  USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Customers can update their own vehicles" ON vehicles;
CREATE POLICY "Customers can update their own vehicles"
  ON vehicles FOR UPDATE
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Customers can delete their own vehicles" ON vehicles;
CREATE POLICY "Customers can delete their own vehicles"
  ON vehicles FOR DELETE
  USING (customer_id = auth.uid());

-- BOOKING_EVENTS: Customers can manage events for their bookings

DROP POLICY IF EXISTS "Customers can create booking events for their bookings" ON booking_events;
CREATE POLICY "Customers can create booking events for their bookings"
  ON booking_events FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Customers can view booking events for their bookings" ON booking_events;
CREATE POLICY "Customers can view booking events for their bookings"
  ON booking_events FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_id = auth.uid()
    )
  );

-- ========================================
-- IMPORTANT NOTES
-- ========================================
-- 1. DEV_TEST_DETAILER_ID policies remain in place (migration 20260519000007)
--    These will be removed when detailer authentication is implemented
-- 2. All customer operations now require Supabase Auth
-- 3. Anonymous browsing still works - only booking creation requires auth
-- 4. Profile upsert happens in auth.ts after successful Apple Sign In
-- ========================================
