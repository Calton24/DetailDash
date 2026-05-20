/**
 * DetailDash mock data layer
 *
 * In production this becomes the API client. Today it's a deterministic
 * in-memory store that simulates network latency so loading/empty/error
 * states render naturally.
 */

import type {
    Booking,
    BookingRequest,
    Detailer,
    ServiceCategory,
    VehicleType,
} from "../types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "express",
    name: "Express Wash",
    icon: "zap",
    blurb: "Fast exterior refresh",
  },
  {
    id: "exterior",
    name: "Exterior",
    icon: "droplet",
    blurb: "Wash, wax & shine",
  },
  {
    id: "interior",
    name: "Interior",
    icon: "spray",
    blurb: "Deep clean cabin",
  },
  {
    id: "full",
    name: "Full Detail",
    icon: "sparkle",
    blurb: "The works",
  },
  {
    id: "ceramic",
    name: "Ceramic Coating",
    icon: "shield",
    blurb: "Long-term protection",
  },
  {
    id: "paint",
    name: "Paint Correction",
    icon: "wrench",
    blurb: "Restore showroom finish",
  },
];

export const VEHICLE_TYPES: { id: VehicleType; label: string }[] = [
  { id: "sedan", label: "Sedan" },
  { id: "suv", label: "SUV" },
  { id: "truck", label: "Truck" },
  { id: "coupe", label: "Coupe" },
  { id: "van", label: "Van" },
  { id: "motorcycle", label: "Motorcycle" },
];

// Stable, royalty-free Unsplash car detailing imagery
const IMG = {
  car1: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80",
  car2: "https://images.unsplash.com/photo-1605618826115-fb9e0a93cc70?w=1200&q=80",
  car3: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1200&q=80",
  car4: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80",
  car5: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  detail1:
    "https://images.unsplash.com/photo-1572312284621-c4c75d3a51e1?w=1200&q=80",
  detail2:
    "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=1200&q=80",
  detail3:
    "https://images.unsplash.com/photo-1606577924006-27d39b132ae2?w=1200&q=80",
};

export const DETAILERS: Detailer[] = [
  {
    id: "d1",
    name: "Apex Mobile Detail",
    tagline: "Showroom finish, on your driveway.",
    about:
      "10+ years detailing exotics and daily drivers across the bay. Fully insured, eco-friendly water reclamation, and a satisfaction guarantee on every job.",
    city: "Brisbane",
    distanceKm: 1.2,
    rating: 4.96,
    reviewsCount: 312,
    priceFrom: 89,
    heroImage: IMG.detail1,
    gallery: [IMG.detail1, IMG.car1, IMG.detail2, IMG.car3, IMG.detail3],
    badges: ["verified", "topRated", "pro"],
    available: true,
    nextSlot: "Today, 2:30 PM",
    yearsExperience: 11,
    services: [
      {
        id: "d1-s1",
        name: "Express Exterior",
        description: "Foam wash, rinse & towel dry",
        category: "express",
        priceFrom: 49,
        estimatedMinutes: 45,
      },
      {
        id: "d1-s2",
        name: "Signature Detail",
        description: "Full exterior + cabin deep clean",
        category: "full",
        priceFrom: 189,
        estimatedMinutes: 150,
      },
      {
        id: "d1-s3",
        name: "Ceramic 1Y Coating",
        description: "Pro-grade hydrophobic protection",
        category: "ceramic",
        priceFrom: 489,
        estimatedMinutes: 300,
      },
    ],
  },
  {
    id: "d2",
    name: "Lustre Auto Spa",
    tagline: "Luxury detailing, mobile.",
    about:
      "Boutique mobile detailing studio specialising in European marques. Hand-finished, paint-safe products, white-glove service.",
    city: "Brisbane",
    distanceKm: 2.8,
    rating: 4.88,
    reviewsCount: 178,
    priceFrom: 119,
    heroImage: IMG.car2,
    gallery: [IMG.car2, IMG.detail2, IMG.car4, IMG.detail3],
    badges: ["verified", "ecoFriendly"],
    available: true,
    nextSlot: "Tomorrow, 9:00 AM",
    yearsExperience: 7,
    services: [
      {
        id: "d2-s1",
        name: "Interior Refresh",
        description: "Vacuum, steam clean & UV treatment",
        category: "interior",
        priceFrom: 99,
        estimatedMinutes: 90,
      },
      {
        id: "d2-s2",
        name: "Premium Detail",
        description: "Exterior wax + interior steam",
        category: "full",
        priceFrom: 229,
        estimatedMinutes: 180,
      },
    ],
  },
  {
    id: "d3",
    name: "ShineWorks Co.",
    tagline: "Honest pricing, ridiculous results.",
    about:
      "Owner-operated. Every booking is handled personally by Mike with 6 years of mobile detailing experience.",
    city: "Brisbane",
    distanceKm: 4.5,
    rating: 4.79,
    reviewsCount: 96,
    priceFrom: 69,
    heroImage: IMG.car3,
    gallery: [IMG.car3, IMG.car5, IMG.detail1],
    badges: ["verified"],
    available: false,
    nextSlot: "Wed, 11:00 AM",
    yearsExperience: 6,
    services: [
      {
        id: "d3-s1",
        name: "Express Wash",
        description: "Quick clean & dry",
        category: "express",
        priceFrom: 39,
        estimatedMinutes: 30,
      },
      {
        id: "d3-s2",
        name: "Standard Detail",
        description: "Full exterior & interior",
        category: "full",
        priceFrom: 149,
        estimatedMinutes: 120,
      },
    ],
  },
  {
    id: "d4",
    name: "Midnight Detailing",
    tagline: "After-hours mobile pros.",
    about:
      "Evening and weekend specialists. We come to you when it suits your schedule.",
    city: "Brisbane",
    distanceKm: 6.1,
    rating: 4.84,
    reviewsCount: 211,
    priceFrom: 79,
    heroImage: IMG.car4,
    gallery: [IMG.car4, IMG.detail2, IMG.car1],
    badges: ["verified", "pro"],
    available: true,
    nextSlot: "Today, 7:30 PM",
    yearsExperience: 9,
    services: [
      {
        id: "d4-s1",
        name: "Twilight Detail",
        description: "Full detail after sunset",
        category: "full",
        priceFrom: 169,
        estimatedMinutes: 150,
      },
      {
        id: "d4-s2",
        name: "Paint Correction Stage 1",
        description: "Single-stage swirl removal",
        category: "paint",
        priceFrom: 349,
        estimatedMinutes: 240,
      },
    ],
  },
  {
    id: "d5",
    name: "Hydro Detailing",
    tagline: "Eco-conscious mobile detailing.",
    about:
      "Waterless and rinseless wash methods. We use 90% less water than traditional detailers.",
    city: "Brisbane",
    distanceKm: 3.3,
    rating: 4.91,
    reviewsCount: 142,
    priceFrom: 75,
    heroImage: IMG.car5,
    gallery: [IMG.car5, IMG.detail3, IMG.car2],
    badges: ["verified", "ecoFriendly", "topRated"],
    available: true,
    nextSlot: "Today, 4:00 PM",
    yearsExperience: 5,
    services: [
      {
        id: "d5-s1",
        name: "Waterless Wash",
        description: "Eco wash + tyre dressing",
        category: "exterior",
        priceFrom: 55,
        estimatedMinutes: 45,
      },
      {
        id: "d5-s2",
        name: "Full Eco Detail",
        description: "Complete service, minimal water",
        category: "full",
        priceFrom: 175,
        estimatedMinutes: 150,
      },
    ],
  },
];

// ───── In-memory mutable booking store ─────
const bookings: Booking[] = [
  {
    id: "b1",
    detailerId: "d1",
    detailerName: "Apex Mobile Detail",
    detailerImage: IMG.detail1,
    serviceId: "d1-s2",
    serviceName: "Signature Detail",
    vehicleType: "suv",
    vehicleRegistration: "ABC-123",
    address: "12 Riverside Dr, Brisbane",
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    priceCents: 18900,
    depositCents: 3000,
    status: "confirmed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "b2",
    detailerId: "d4",
    detailerName: "Midnight Detailing",
    detailerImage: IMG.car4,
    serviceId: "d4-s1",
    serviceName: "Twilight Detail",
    vehicleType: "sedan",
    vehicleRegistration: "ZED-901",
    address: "44 Coastal Pde, Brisbane",
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    priceCents: 16900,
    depositCents: 3000,
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
];

const detailerRequests: BookingRequest[] = [
  {
    id: "r1",
    detailerId: "d1",
    detailerName: "Apex Mobile Detail",
    detailerImage: IMG.detail1,
    serviceId: "d1-s1",
    serviceName: "Express Exterior",
    vehicleType: "sedan",
    vehicleRegistration: "DAF-228",
    address: "7 Garden St, New Farm",
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    notes: "Bird droppings on bonnet, please pay extra attention.",
    priceCents: 4900,
    depositCents: 1500,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    customerName: "Sarah Chen",
    customerInitials: "SC",
    paymentStatus: "deposit_held",
  },
  {
    id: "r2",
    detailerId: "d1",
    detailerName: "Apex Mobile Detail",
    detailerImage: IMG.detail1,
    serviceId: "d1-s2",
    serviceName: "Signature Detail",
    vehicleType: "suv",
    vehicleRegistration: "TR8-444",
    address: "201 Eagle Tce, Brisbane",
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 27).toISOString(),
    priceCents: 18900,
    depositCents: 3000,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    customerName: "Marcus Reid",
    customerInitials: "MR",
    paymentStatus: "authorized",
  },
];

// ───── Public API ─────

export async function listDetailers(): Promise<Detailer[]> {
  await wait(450);
  return DETAILERS;
}

export async function getDetailer(id: string): Promise<Detailer | null> {
  await wait(280);
  return DETAILERS.find((d) => d.id === id) ?? null;
}

export async function listBookings(): Promise<Booking[]> {
  await wait(380);
  return [...bookings].sort(
    (a, b) =>
      new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime()
  );
}

export async function getBooking(id: string): Promise<Booking | null> {
  await wait(220);
  return bookings.find((b) => b.id === id) ?? null;
}

export async function createBooking(
  input: Omit<Booking, "id" | "status" | "createdAt">
): Promise<Booking> {
  await wait(620);
  const booking: Booking = {
    ...input,
    id: `b${bookings.length + 1}-${Date.now()}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(booking);
  return booking;
}

export async function listBookingRequests(): Promise<BookingRequest[]> {
  await wait(380);
  return [...detailerRequests];
}

export async function listCompletedJobs(): Promise<Booking[]> {
  await wait(320);
  return bookings.filter((b) => b.status === "completed");
}

export async function listUpcomingJobs(): Promise<Booking[]> {
  await wait(320);
  return bookings.filter(
    (b) => b.status === "confirmed" || b.status === "enRoute"
  );
}
