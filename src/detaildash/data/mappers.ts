/**
 * Map Supabase schema to UI types
 */

import type {
    Booking as SupabaseBooking,
    Detailer as SupabaseDetailer,
    Service as SupabaseService,
} from "../../utils/supabase";
import type {
    Booking,
    BookingRequest,
    BookingStatus,
    Detailer,
    DetailerService,
    ServiceCategoryId,
    VehicleType,
} from "../types";

/**
 * Map Supabase service category to UI category
 */
function mapServiceCategory(name: string): ServiceCategoryId {
  const lower = name.toLowerCase();
  if (lower.includes("interior")) return "interior";
  if (lower.includes("exterior")) return "exterior";
  if (lower.includes("express") || lower.includes("wash")) return "express";
  if (lower.includes("ceramic") || lower.includes("coating")) return "ceramic";
  if (
    lower.includes("polish") ||
    lower.includes("correction") ||
    lower.includes("paint")
  )
    return "paint";
  return "full";
}

/**
 * Map Supabase service to UI service
 */
function mapService(service: SupabaseService): DetailerService {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    category: mapServiceCategory(service.category),
    priceFrom: service.price_pence / 100, // Convert pence to dollars
    estimatedMinutes: service.duration_minutes,
  };
}

/**
 * Calculate distance (stub - returns fixed 5km for now)
 * TODO: Implement geospatial calculation once user location is available
 */
function calculateDistance(
  _lat: number,
  _lng: number,
  _userLat?: number,
  _userLng?: number
): number {
  return 5; // Default 5km
}

/**
 * Format next available slot (stub)
 * TODO: Fetch from detailer availability once implemented
 */
function getNextSlot(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return "Tomorrow, 9:00 AM";
}

/**
 * Map detailer badges from Supabase flags
 */
function mapBadges(
  detailer: SupabaseDetailer
): ("verified" | "topRated" | "pro" | "ecoFriendly")[] {
  const badges: ("verified" | "topRated" | "pro" | "ecoFriendly")[] = [];

  if (detailer.is_verified) badges.push("verified");
  if (detailer.rating >= 4.8) badges.push("topRated");
  if (detailer.years_experience >= 5) badges.push("pro");
  // ecoFriendly would need a dedicated flag in DB

  return badges;
}

/**
 * Map Supabase detailer to UI detailer
 */
export function mapDetailer(
  detailer: SupabaseDetailer & { services?: SupabaseService[] }
): Detailer {
  const services = (detailer.services || []).map(mapService);
  const priceFrom =
    services.length > 0 ? Math.min(...services.map((s) => s.priceFrom)) : 0;

  return {
    id: detailer.id,
    name: detailer.business_name,
    tagline: detailer.tagline,
    about: detailer.description,
    city: detailer.city,
    distanceKm: calculateDistance(detailer.latitude, detailer.longitude),
    rating: detailer.rating,
    reviewsCount: detailer.review_count,
    priceFrom,
    heroImage: detailer.hero_image_url || "",
    gallery: [], // TODO: Fetch from detailer_photos table once needed
    badges: mapBadges(detailer),
    available: detailer.is_available,
    nextSlot: getNextSlot(),
    services,
    yearsExperience: detailer.years_experience,
    bookingProtectionType: detailer.booking_protection_type,
    bookingProtectionValue: detailer.booking_protection_value,
  };
}

/**
 * Map array of Supabase detailers to UI detailers
 */
export function mapDetailers(
  detailers: (SupabaseDetailer & { services?: SupabaseService[] })[]
): Detailer[] {
  return detailers.map(mapDetailer);
}
/**
 * Map Supabase booking status to UI booking status
 */
function mapBookingStatus(status: SupabaseBooking["status"]): BookingStatus {
  const statusMap: Record<SupabaseBooking["status"], BookingStatus> = {
    pending: "pending",
    accepted: "confirmed",
    declined: "cancelled",
    on_the_way: "enRoute",
    arrived: "active",
    detailing: "active",
    completed: "completed",
    cancelled: "cancelled",
  };
  return statusMap[status];
}

/**
 * Map Supabase booking to UI booking
 * Requires detailer and service data to be joined/provided
 */
export function mapBooking(
  booking: SupabaseBooking,
  detailer: { business_name: string; hero_image_url: string },
  service: { name: string }
): Booking {
  return {
    id: booking.id,
    detailerId: booking.detailer_id,
    detailerName: detailer.business_name || "Detailer",
    detailerImage: detailer.hero_image_url || "",
    serviceId: booking.service_id,
    serviceName: service.name || "Service",
    vehicleType: (booking.vehicle_id as VehicleType) || "sedan", // TODO: Fetch from vehicles table
    vehicleRegistration: "Reg not provided", // TODO: Fetch from vehicles table
    address: booking.address_line || "Address not provided",
    scheduledFor: booking.booking_start,
    notes: booking.notes || undefined,
    priceCents: booking.total_pence,
    depositCents: booking.deposit_pence,
    status: mapBookingStatus(booking.status),
    createdAt: booking.created_at,
  };
}

/**
 * Map array of Supabase bookings to UI bookings
 */
export function mapBookings(
  bookings: Array<
    SupabaseBooking & {
      detailer: { business_name: string; hero_image_url: string };
      service: { name: string };
    }
  >
): Booking[] {
  return bookings.map((b) => mapBooking(b, b.detailer, b.service));
}

/**
 * Map Supabase booking to UI BookingRequest (for detailer dashboard)
 * Includes customer information for detailer to review
 */
export function mapBookingRequest(
  booking: SupabaseBooking,
  detailer: { business_name: string; hero_image_url: string },
  service: { name: string }
): BookingRequest {
  // Extract initials from customer name with null safety
  const customerName = booking.customer_name || "Customer";
  const nameParts = customerName.split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
      : customerName.slice(0, 2);

  return {
    ...mapBooking(booking, detailer, service),
    customerName,
    customerInitials: initials.toUpperCase(),
    paymentStatus:
      booking.payment_status === "paid"
        ? "paid"
        : booking.payment_status === "deposit_paid"
          ? "deposit_held"
          : "authorized",
  };
}

/**
 * Map array of Supabase bookings to UI BookingRequests
 */
export function mapBookingRequests(
  bookings: Array<
    SupabaseBooking & {
      detailer: { business_name: string; hero_image_url: string };
      service: { name: string };
    }
  >
): BookingRequest[] {
  return bookings.map((b) => mapBookingRequest(b, b.detailer, b.service));
}
