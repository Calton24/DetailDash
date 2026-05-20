-- Dev-only RLS policies for test detailer booking operations
-- TODO: Remove this entire file before production launch
-- This allows the test detailer to update/manage bookings without Supabase Auth

-- Allow test detailer to update assigned bookings (accept/decline)
CREATE POLICY "Dev: Test detailer can update assigned bookings"
ON bookings
FOR UPDATE
USING (
  detailer_id = '10000000-0000-0000-0000-000000000001'::UUID
)
WITH CHECK (
  detailer_id = '10000000-0000-0000-0000-000000000001'::UUID
);

-- Allow test detailer to select their bookings
CREATE POLICY "Dev: Test detailer can select assigned bookings"
ON bookings
FOR SELECT
USING (
  detailer_id = '10000000-0000-0000-0000-000000000001'::UUID
);
