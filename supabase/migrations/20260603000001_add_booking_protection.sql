-- =====================================================
-- Migration: Add booking protection policies to detailers
-- =====================================================
-- Purpose: Allow each detailer to configure their own deposit requirements
--          (none, fixed amount, or percentage of booking total)
-- =====================================================

-- Create enum for protection types
CREATE TYPE booking_protection_type AS ENUM ('none', 'fixed', 'percentage');

-- Add booking protection columns to detailers table
ALTER TABLE detailers
ADD COLUMN IF NOT EXISTS booking_protection_type booking_protection_type NOT NULL DEFAULT 'fixed',
ADD COLUMN IF NOT EXISTS booking_protection_value INTEGER;

-- Set default for existing detailers (£30 fixed deposit - matches current behavior)
UPDATE detailers
SET booking_protection_value = 3000
WHERE booking_protection_type = 'fixed' AND booking_protection_value IS NULL;

-- Add check constraints
ALTER TABLE detailers
ADD CONSTRAINT booking_protection_value_valid CHECK (
  (booking_protection_type = 'none' AND booking_protection_value IS NULL) OR
  (booking_protection_type = 'fixed' AND booking_protection_value > 0) OR
  (booking_protection_type = 'percentage' AND booking_protection_value > 0 AND booking_protection_value <= 100)
);

-- Add comments
COMMENT ON COLUMN detailers.booking_protection_type IS 'Type of deposit required: none (no deposit), fixed (fixed amount in pence), percentage (% of booking total)';
COMMENT ON COLUMN detailers.booking_protection_value IS 'Deposit amount: pence for fixed, percentage for percentage, null for none';

-- Update payment_status enum to include 'not_required'
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'not_required';

-- Add index for filtering by protection type
CREATE INDEX IF NOT EXISTS idx_detailers_protection_type ON detailers(booking_protection_type);
