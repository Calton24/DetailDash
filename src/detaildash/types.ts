/**
 * DetailDash domain types
 */

export type VehicleType =
  | "sedan"
  | "suv"
  | "truck"
  | "coupe"
  | "van"
  | "motorcycle";

export type ServiceCategoryId =
  | "exterior"
  | "interior"
  | "full"
  | "ceramic"
  | "paint"
  | "express";

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  icon: "sparkle" | "spray" | "shield" | "droplet" | "wrench" | "zap";
  blurb: string;
}

export interface DetailerService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategoryId;
  priceFrom: number;
  estimatedMinutes: number;
}

export interface Detailer {
  id: string;
  name: string;
  tagline: string;
  about: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  priceFrom: number;
  heroImage: string;
  gallery: string[];
  badges: ("verified" | "topRated" | "pro" | "ecoFriendly")[];
  available: boolean;
  nextSlot: string; // e.g. "Today, 2:30 PM"
  services: DetailerService[];
  yearsExperience: number;
  bookingProtectionType: "none" | "fixed" | "percentage";
  bookingProtectionValue: number | null;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "enRoute"
  | "active"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  detailerId: string;
  detailerName: string;
  detailerImage: string;
  serviceId: string;
  serviceName: string;
  vehicleType: VehicleType;
  vehicleRegistration: string;
  address: string;
  scheduledFor: string; // ISO
  notes?: string;
  priceCents: number;
  depositCents: number;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingRequest extends Booking {
  customerName: string;
  customerInitials: string;
  paymentStatus: "authorized" | "paid" | "deposit_held";
}
