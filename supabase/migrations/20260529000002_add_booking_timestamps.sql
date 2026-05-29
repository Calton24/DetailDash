-- =====================================================
-- Migration: Add booking state timestamps
-- =====================================================
-- Purpose: Track when bookings transition between states
--          for analytics, SLA tracking, and audit trails.
-- =====================================================

-- Add timestamp columns for state transitions
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS declined_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_bookings_accepted_at ON bookings(accepted_at) WHERE accepted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_completed_at ON bookings(completed_at) WHERE completed_at IS NOT NULL;

-- Add comments
COMMENT ON COLUMN bookings.accepted_at IS 'Timestamp when detailer accepted the booking';
COMMENT ON COLUMN bookings.declined_at IS 'Timestamp when detailer declined the booking';
COMMENT ON COLUMN bookings.completed_at IS 'Timestamp when service was marked complete';
COMMENT ON COLUMN bookings.cancelled_at IS 'Timestamp when customer cancelled the booking';
