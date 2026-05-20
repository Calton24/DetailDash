-- DetailDash MVP Schema
-- Creates core tables for booking, detailing, and profiles

-- ============================================
-- TYPES & ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('customer', 'detailer', 'admin');
CREATE TYPE booking_status AS ENUM (
  'pending',
  'accepted',
  'declined',
  'on_the_way',
  'arrived',
  'detailing',
  'completed',
  'cancelled'
);
CREATE TYPE payment_status AS ENUM (
  'unpaid',
  'deposit_paid',
  'paid',
  'refunded',
  'failed'
);
CREATE TYPE detailer_status AS ENUM ('active', 'inactive', 'suspended');

-- ============================================
-- TABLES
-- ============================================

-- 1. Profiles (Auth users + customer/detailer metadata)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Detailers (Business profiles)
CREATE TABLE IF NOT EXISTS detailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  hero_image_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  years_experience INT DEFAULT 0,
  jobs_completed INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  service_radius_km INT DEFAULT 10,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  city TEXT,
  status detailer_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Detailer Photos (Gallery)
CREATE TABLE IF NOT EXISTS detailer_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detailer_id UUID NOT NULL REFERENCES detailers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Services (Packages/offerings per detailer)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detailer_id UUID NOT NULL REFERENCES detailers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_pence INT NOT NULL,
  deposit_pence INT NOT NULL,
  duration_minutes INT NOT NULL,
  includes TEXT[] DEFAULT '{}',
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Vehicles (Customer's cars)
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,
  registration TEXT,
  make TEXT,
  model TEXT,
  colour TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bookings (Core transaction)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  detailer_id UUID NOT NULL REFERENCES detailers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  
  -- Customer details (snapshot at booking time)
  customer_name TEXT,
  customer_phone TEXT,
  address_line TEXT NOT NULL,
  city TEXT,
  postcode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  
  -- Job details
  booking_start TIMESTAMPTZ NOT NULL,
  booking_end TIMESTAMPTZ,
  notes TEXT,
  
  -- Status tracking
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  
  -- Pricing (all in pence)
  total_pence INT NOT NULL,
  deposit_pence INT NOT NULL,
  platform_fee_pence INT DEFAULT 0,
  detailer_payout_pence INT DEFAULT 0,
  
  -- Stripe integration
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Booking Events (Timeline/audit)
CREATE TABLE IF NOT EXISTS booking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_detailers_location ON detailers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_detailers_status ON detailers(status, is_available);
CREATE INDEX IF NOT EXISTS idx_detailers_owner ON detailers(owner_id);
CREATE INDEX IF NOT EXISTS idx_services_detailer ON services(detailer_id, is_active);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_detailer ON bookings(detailer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings(booking_start);
CREATE INDEX IF NOT EXISTS idx_booking_events_booking ON booking_events(booking_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at on profiles
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- Update updated_at on detailers
CREATE OR REPLACE FUNCTION update_detailers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER detailers_updated_at
BEFORE UPDATE ON detailers
FOR EACH ROW
EXECUTE FUNCTION update_detailers_updated_at();

-- Update updated_at on services
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_services_updated_at();

-- Update updated_at on vehicles
CREATE OR REPLACE FUNCTION update_vehicles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION update_vehicles_updated_at();

-- Update updated_at on bookings
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_bookings_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE detailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE detailer_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_events ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update their own
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Detailers: public can read active
CREATE POLICY "Public can view active detailers"
  ON detailers FOR SELECT
  USING (status = 'active');

CREATE POLICY "Detailer can update own business"
  ON detailers FOR UPDATE
  USING (
    auth.uid() = owner_id
  );

CREATE POLICY "Admins can manage detailers"
  ON detailers FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Detailer Photos: public can read
CREATE POLICY "Public can view detailer photos"
  ON detailer_photos FOR SELECT
  USING (TRUE);

CREATE POLICY "Detailer can manage own photos"
  ON detailer_photos FOR ALL
  USING (
    detailer_id IN (
      SELECT id FROM detailers WHERE owner_id = auth.uid()
    )
  );

-- Services: public can read active
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Detailer can manage own services"
  ON services FOR ALL
  USING (
    detailer_id IN (
      SELECT id FROM detailers WHERE owner_id = auth.uid()
    )
  );

-- Vehicles: customers read/write their own
CREATE POLICY "Customers can view their own vehicles"
  ON vehicles FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own vehicles"
  ON vehicles FOR UPDATE
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can delete their own vehicles"
  ON vehicles FOR DELETE
  USING (auth.uid() = customer_id);

-- Bookings: customers read/create their own, detailers read/update assigned
CREATE POLICY "Customers can view their bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Detailers can view assigned bookings"
  ON bookings FOR SELECT
  USING (
    detailer_id IN (
      SELECT id FROM detailers WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Detailers can update assigned bookings"
  ON bookings FOR UPDATE
  USING (
    detailer_id IN (
      SELECT id FROM detailers WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Booking Events: tied to booking access
CREATE POLICY "Users can view events on their bookings"
  ON booking_events FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings
      WHERE customer_id = auth.uid()
      OR detailer_id IN (
        SELECT id FROM detailers WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create events on their bookings"
  ON booking_events FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings
      WHERE customer_id = auth.uid()
      OR detailer_id IN (
        SELECT id FROM detailers WHERE owner_id = auth.uid()
      )
    )
  );
