-- DetailDash Seed Data
-- 5 Manchester-based mobile detailers with services

-- ============================================
-- SEED DETAILERS
-- ============================================

INSERT INTO detailers (
  id,
  owner_id,
  business_name,
  tagline,
  description,
  hero_image_url,
  rating,
  review_count,
  years_experience,
  jobs_completed,
  is_verified,
  is_available,
  service_radius_km,
  latitude,
  longitude,
  city,
  status
) VALUES
-- 1. Apex Mobile Detail (City Centre)
(
  '10000000-0000-0000-0000-000000000001'::UUID,
  NULL,
  'Apex Mobile Detail',
  'Showroom finish, on your driveway.',
  '10+ years detailing exotics and daily drivers. Fully insured, eco-friendly water reclamation, and a satisfaction guarantee on every job.',
  'https://images.unsplash.com/photo-1572312284621-c4c75d3a51e1?w=1200&q=80',
  4.96,
  312,
  11,
  2847,
  TRUE,
  TRUE,
  15,
  53.4808,
  -2.2426,
  'Manchester',
  'active'::detailer_status
),
-- 2. Pro Shine Detailing (South Manchester)
(
  '10000000-0000-0000-0000-000000000002'::UUID,
  NULL,
  'Pro Shine Detailing',
  'Professional detailing at home. Fast, thorough, reliable.',
  'Specialists in paint correction and ceramic coating. We come to you with top-tier equipment and premium products. Family-run business with 8 years of experience.',
  'https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=1200&q=80',
  4.87,
  156,
  8,
  1203,
  TRUE,
  TRUE,
  12,
  53.4020,
  -2.2011,
  'Manchester',
  'active'::detailer_status
),
-- 3. Gleam Auto Care (North Manchester)
(
  '10000000-0000-0000-0000-000000000003'::UUID,
  NULL,
  'Gleam Auto Care',
  'Expert car detailing. Affordable luxury.',
  'From exterior washes to full interior detail. We handle all vehicle types. Eco-conscious with water recycling systems. 6-year track record.',
  'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?w=1200&q=80',
  4.79,
  89,
  6,
  634,
  FALSE,
  TRUE,
  10,
  53.5250,
  -2.2130,
  'Manchester',
  'active'::detailer_status
),
-- 4. Crystal Car Care (Stockport, near Manchester)
(
  '10000000-0000-0000-0000-000000000004'::UUID,
  NULL,
  'Crystal Car Care',
  'Pristine cars guaranteed. Professional mobile detailing.',
  'Serving Manchester and Stockport for 12 years. Specialising in deep cleans, ceramic coatings, and fleet services. Same-day availability.',
  'https://images.unsplash.com/photo-1605618826115-fb9e0a93cc70?w=1200&q=80',
  4.92,
  278,
  12,
  2156,
  TRUE,
  TRUE,
  20,
  53.3876,
  -2.1625,
  'Manchester',
  'active'::detailer_status
),
-- 5. Detail Genius (East Manchester)
(
  '10000000-0000-0000-0000-000000000005'::UUID,
  NULL,
  'Detail Genius',
  'Your car deserves the best. We deliver it.',
  'Mobile detailing for perfectionists. Hand-wax finishes, interior extractions, and paint protection films. Premium products. 5-star service.',
  'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80',
  4.85,
  201,
  7,
  912,
  TRUE,
  TRUE,
  14,
  53.4356,
  -2.1845,
  'Manchester',
  'active'::detailer_status
);

-- ============================================
-- SEED SERVICES
-- ============================================

-- Apex Mobile Detail services
INSERT INTO services (detailer_id, name, description, price_pence, deposit_pence, duration_minutes, includes, category, is_active)
VALUES
(
  '10000000-0000-0000-0000-000000000001'::UUID,
  'Express Wash',
  'Quick exterior wash and dry. Perfect for keeping your car fresh between full details.',
  4900,
  2450,
  45,
  ARRAY['Exterior wash', 'Dry'],
  'express',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000001'::UUID,
  'Exterior Detail',
  'Deep clean, wax, and polish. Paint protection and stunning shine.',
  8900,
  4450,
  120,
  ARRAY['Wash', 'Clay bar', 'Wax', 'Polish'],
  'exterior',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000001'::UUID,
  'Full Detail',
  'Complete interior and exterior detail. The works. Includes hand wax finish.',
  16900,
  8450,
  240,
  ARRAY['Interior vacuum', 'Exterior wash', 'Clay bar', 'Wax', 'Polish', 'Interior clean'],
  'full',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000001'::UUID,
  'Ceramic Coating',
  'Professional ceramic coating. Long-term protection with hydrophobic finish.',
  24900,
  12450,
  180,
  ARRAY['Ceramic coat', 'Paint prep', 'Buff and polish'],
  'ceramic',
  TRUE
);

-- Pro Shine Detailing services
INSERT INTO services (detailer_id, name, description, price_pence, deposit_pence, duration_minutes, includes, category, is_active)
VALUES
(
  '10000000-0000-0000-0000-000000000002'::UUID,
  'Wash & Wax',
  'Professional wash and hand-applied wax. Swift and thorough.',
  6900,
  3450,
  90,
  ARRAY['Wash', 'Wax'],
  'exterior',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000002'::UUID,
  'Interior Detailing',
  'Deep clean cabin. Vacuums, steam clean, leather treatment.',
  7900,
  3950,
  120,
  ARRAY['Vacuum', 'Steam clean', 'Leather treatment', 'Air freshener'],
  'interior',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000002'::UUID,
  'Paint Correction',
  'Remove swirls and scratches. Restore showroom finish.',
  18900,
  9450,
  180,
  ARRAY['Paint prep', 'Compound', 'Polish', 'Protection'],
  'paint',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000002'::UUID,
  'Full Interior & Exterior',
  'Comprehensive detail. Inside and out. Ready for the road.',
  13900,
  6950,
  210,
  ARRAY['Exterior wash', 'Interior vacuum', 'Wax', 'Interior clean'],
  'full',
  TRUE
);

-- Gleam Auto Care services
INSERT INTO services (detailer_id, name, description, price_pence, deposit_pence, duration_minutes, includes, category, is_active)
VALUES
(
  '10000000-0000-0000-0000-000000000003'::UUID,
  'Standard Wash',
  'Exterior wash and dry. Affordable and fast.',
  3900,
  1950,
  45,
  ARRAY['Wash', 'Dry'],
  'express',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000003'::UUID,
  'Premium Exterior',
  'Wash, clay bar, wax. Deep shine protection.',
  7900,
  3950,
  120,
  ARRAY['Wash', 'Clay bar', 'Wax'],
  'exterior',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000003'::UUID,
  'Interior Refresh',
  'Vacuum, wipe-down, freshen. Quick turnaround.',
  4900,
  2450,
  60,
  ARRAY['Vacuum', 'Wipe surfaces', 'Freshen'],
  'interior',
  TRUE
);

-- Crystal Car Care services
INSERT INTO services (detailer_id, name, description, price_pence, deposit_pence, duration_minutes, includes, category, is_active)
VALUES
(
  '10000000-0000-0000-0000-000000000004'::UUID,
  'Quick Detail',
  'Express service. Wash, dry, quick interior tidy.',
  5900,
  2950,
  75,
  ARRAY['Wash', 'Dry', 'Interior tidy'],
  'express',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000004'::UUID,
  'Signature Detail',
  'Full exterior detail with interior vacuum and wipe.',
  10900,
  5450,
  150,
  ARRAY['Wash', 'Clay', 'Wax', 'Interior vacuum'],
  'full',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000004'::UUID,
  'Ceramic Pro',
  'Professional ceramic coating application. Premium protection.',
  26900,
  13450,
  200,
  ARRAY['Paint prep', 'Ceramic coat', 'Top coat', 'Buff'],
  'ceramic',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000004'::UUID,
  'Fleet Service',
  'Multi-vehicle discount available. Perfect for businesses.',
  8900,
  4450,
  100,
  ARRAY['Wash', 'Wax', 'Tidy'],
  'exterior',
  TRUE
);

-- Detail Genius services
INSERT INTO services (detailer_id, name, description, price_pence, deposit_pence, duration_minutes, includes, category, is_active)
VALUES
(
  '10000000-0000-0000-0000-000000000005'::UUID,
  'Exterior Excellence',
  'Premium hand wash, clay bar treatment, professional wax.',
  9900,
  4950,
  130,
  ARRAY['Hand wash', 'Clay bar', 'Premium wax', 'Polish'],
  'exterior',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000005'::UUID,
  'Complete Transformation',
  'Full interior and exterior detail. Paint protection film consultation included.',
  19900,
  9950,
  240,
  ARRAY['Full interior detail', 'Exterior detail', 'Wax', 'Consultation'],
  'full',
  TRUE
),
(
  '10000000-0000-0000-0000-000000000005'::UUID,
  'Interior Perfection',
  'Deep interior detail. Extraction, leather care, odour removal.',
  8900,
  4450,
  150,
  ARRAY['Vacuum', 'Steam extraction', 'Leather care', 'Odour treatment'],
  'interior',
  TRUE
);

-- ============================================
-- SEED DETAILER PHOTOS
-- ============================================

INSERT INTO detailer_photos (detailer_id, image_url, sort_order)
VALUES
-- Apex photos
('10000000-0000-0000-0000-000000000001'::UUID, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80', 0),
('10000000-0000-0000-0000-000000000001'::UUID, 'https://images.unsplash.com/photo-1605618826115-fb9e0a93cc70?w=1200&q=80', 1),
('10000000-0000-0000-0000-000000000001'::UUID, 'https://images.unsplash.com/photo-1601362840469-51e4d8d58781?w=1200&q=80', 2),
('10000000-0000-0000-0000-000000000001'::UUID, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80', 3),

-- Pro Shine photos
('10000000-0000-0000-0000-000000000002'::UUID, 'https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=1200&q=80', 0),
('10000000-0000-0000-0000-000000000002'::UUID, 'https://images.unsplash.com/photo-1572312284621-c4c75d3a51e1?w=1200&q=80', 1),
('10000000-0000-0000-0000-000000000002'::UUID, 'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?w=1200&q=80', 2),

-- Gleam photos
('10000000-0000-0000-0000-000000000003'::UUID, 'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?w=1200&q=80', 0),
('10000000-0000-0000-0000-000000000003'::UUID, 'https://images.unsplash.com/photo-1605618826115-fb9e0a93cc70?w=1200&q=80', 1),
('10000000-0000-0000-0000-000000000003'::UUID, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80', 2),

-- Crystal photos
('10000000-0000-0000-0000-000000000004'::UUID, 'https://images.unsplash.com/photo-1605618826115-fb9e0a93cc70?w=1200&q=80', 0),
('10000000-0000-0000-0000-000000000004'::UUID, 'https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=1200&q=80', 1),
('10000000-0000-0000-0000-000000000004'::UUID, 'https://images.unsplash.com/photo-1601362840469-51e4d8d58781?w=1200&q=80', 2),
('10000000-0000-0000-0000-000000000004'::UUID, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80', 3),

-- Detail Genius photos
('10000000-0000-0000-0000-000000000005'::UUID, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80', 0),
('10000000-0000-0000-0000-000000000005'::UUID, 'https://images.unsplash.com/photo-1572312284621-c4c75d3a51e1?w=1200&q=80', 1),
('10000000-0000-0000-0000-000000000005'::UUID, 'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?w=1200&q=80', 2);
