import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase credentials. Check .env.local has EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Type definitions for DetailDash schema
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: "customer" | "detailer" | "admin";
  avatar_url: string | null;
  created_at: string;
}

export interface Detailer {
  id: string;
  owner_id: string;
  business_name: string;
  tagline: string;
  description: string;
  hero_image_url: string | null;
  rating: number;
  review_count: number;
  years_experience: number;
  jobs_completed: number;
  is_verified: boolean;
  is_available: boolean;
  service_radius_km: number;
  latitude: number;
  longitude: number;
  city: string;
  status: "active" | "inactive" | "suspended";
  created_at: string;
}

export interface Service {
  id: string;
  detailer_id: string;
  name: string;
  description: string;
  price_pence: number;
  deposit_pence: number;
  duration_minutes: number;
  includes: string[];
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  detailer_id: string;
  service_id: string;
  vehicle_id: string | null;
  customer_name: string;
  customer_phone: string;
  address_line: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
  booking_start: string;
  booking_end: string | null;
  notes: string | null;
  status:
    | "pending"
    | "accepted"
    | "declined"
    | "on_the_way"
    | "arrived"
    | "detailing"
    | "completed"
    | "cancelled";
  payment_status: "unpaid" | "deposit_paid" | "paid" | "refunded" | "failed";
  total_pence: number;
  deposit_pence: number;
  platform_fee_pence: number;
  detailer_payout_pence: number;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingEvent {
  id: string;
  booking_id: string;
  actor_id: string | null;
  event_type: string;
  message: string | null;
  created_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  vehicle_type: string;
  registration: string;
  make: string;
  model: string;
  colour: string;
  created_at: string;
}
