-- Fix infinite recursion in RLS policies
-- Issue: Policies on profiles were querying profiles table, causing recursion

-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage detailers" ON detailers;

-- For MVP: Admin access not required
-- TODO: Implement JWT-based role claims for admin access in production

-- Note: Remaining policies are safe:
-- - "Users can view their own profile" uses auth.uid() = id (no recursion)
-- - "Users can update their own profile" uses auth.uid() = id (no recursion)
-- - "Public can view active detailers" uses simple status check (no recursion)
-- - All other policies use direct auth.uid() comparisons
