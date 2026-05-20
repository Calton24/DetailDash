-- Dev-only fix: Reassign all pending bookings to test detailer for MVP testing
-- This migration should be removed before production

-- Update all pending bookings to use the test detailer
UPDATE bookings
SET detailer_id = '10000000-0000-0000-0000-000000000001'::UUID
WHERE status = 'pending'
  AND detailer_id != '10000000-0000-0000-0000-000000000001'::UUID;

-- Update all accepted/active bookings to use the test detailer (optional)
UPDATE bookings
SET detailer_id = '10000000-0000-0000-0000-000000000001'::UUID
WHERE status IN ('accepted', 'on_the_way', 'arrived', 'detailing')
  AND detailer_id != '10000000-0000-0000-0000-000000000001'::UUID;
