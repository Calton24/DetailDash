/**
 * DetailDash API client layer
 * Replaces mock data once Supabase is seeded
 */

import {
    supabase,
    type Booking,
    type Detailer,
    type Service,
} from "./supabase";

export const detailersApi = {
  /**
   * Get all active detailers near a location with their services
   * TODO: Implement geospatial search once Supabase PostGIS is set up
   */
  async listDetailers() {
    const { data: detailers, error: detailersError } = await supabase
      .from("detailers")
      .select("*")
      .eq("status", "active")
      .eq("is_available", true)
      .order("rating", { ascending: false })
      .limit(50);

    if (detailersError) throw detailersError;

    // Fetch services for all detailers
    const detailerIds = (detailers || []).map((d) => d.id);
    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("*")
      .in("detailer_id", detailerIds)
      .eq("is_active", true);

    if (servicesError) throw servicesError;

    // Attach services to each detailer
    const detailersWithServices = (detailers || []).map((detailer) => ({
      ...detailer,
      services: (services || []).filter((s) => s.detailer_id === detailer.id),
    }));

    return detailersWithServices as (Detailer & { services: Service[] })[];
  },

  /**
   * Get detailer profile with services
   */
  async getDetailer(id: string) {
    const { data: detailer, error: detailerError } = await supabase
      .from("detailers")
      .select("*")
      .eq("id", id)
      .single();

    if (detailerError) throw detailerError;

    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("*")
      .eq("detailer_id", id)
      .eq("is_active", true);

    if (servicesError) throw servicesError;

    return {
      ...detailer,
      services: services || [],
    } as Detailer & { services: Service[] };
  },

  /**
   * Get detailer services (active only)
   */
  async getServices(detailerId: string) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("detailer_id", detailerId)
      .eq("is_active", true);

    if (error) throw error;
    return data as Service[];
  },

  /**
   * Get all detailer services (including inactive) for management
   */
  async getAllServices(detailerId: string) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("detailer_id", detailerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Service[];
  },

  /**
   * Update service details
   */
  async updateService(
    serviceId: string,
    detailerId: string,
    patch: Partial<{
      name: string;
      description: string;
      price_pence: number;
      deposit_pence: number;
      duration_minutes: number;
      category: string;
    }>
  ) {
    const { data, error } = await supabase
      .from("services")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", serviceId)
      .eq("detailer_id", detailerId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Service not found or permission denied");
    return data as Service;
  },

  /**
   * Toggle service active/inactive status
   */
  async toggleServiceActive(
    serviceId: string,
    detailerId: string,
    isActive: boolean
  ) {
    const { data, error } = await supabase
      .from("services")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", serviceId)
      .eq("detailer_id", detailerId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Service not found or permission denied");
    return data as Service;
  },

  /**
   * Create new service for detailer
   */
  async createService(input: {
    detailer_id: string;
    name: string;
    description: string;
    price_pence: number;
    deposit_pence: number;
    duration_minutes: number;
    category: string;
  }) {
    const { data, error } = await supabase
      .from("services")
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data as Service;
  },
};

export const bookingsApi = {
  /**
   * Get customer's booking history with joined detailer and service data
   */
  async getCustomerBookings(customerId: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        detailer:detailers!bookings_detailer_id_fkey(business_name, hero_image_url),
        service:services!bookings_service_id_fkey(name)
      `
      )
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get detailer's incoming booking requests with joined customer and service data
   */
  async getBookingRequests(detailerId: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        detailer:detailers!bookings_detailer_id_fkey(business_name, hero_image_url),
        service:services!bookings_service_id_fkey(name)
      `
      )
      .eq("detailer_id", detailerId)
      .eq("status", "pending")
      .eq("payment_status", "deposit_paid")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get detailer's active/upcoming jobs with joined customer and service data
   */
  async getUpcomingJobs(detailerId: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        detailer:detailers!bookings_detailer_id_fkey(business_name, hero_image_url),
        service:services!bookings_service_id_fkey(name)
      `
      )
      .eq("detailer_id", detailerId)
      .in("status", ["accepted", "on_the_way", "arrived", "detailing"])
      .order("booking_start", { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Accept a booking request (detailer action)
   */
  async acceptBooking(bookingId: string, detailerId: string) {
    console.log("Accepting booking:", { bookingId, detailerId });

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "accepted",
        accepted_at: now,
        updated_at: now,
      })
      .eq("id", bookingId)
      .eq("detailer_id", detailerId)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error("Booking not found or permission denied");
    }

    // Create booking event
    await this.addBookingEvent(
      bookingId,
      "booking_accepted",
      detailerId,
      "Detailer accepted the booking request"
    );

    return data;
  },

  /**
   * Decline a booking request (detailer action)
   */
  async declineBooking(bookingId: string, detailerId: string) {
    console.log("Declining booking:", { bookingId, detailerId });

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "declined",
        declined_at: now,
        updated_at: now,
      })
      .eq("id", bookingId)
      .eq("detailer_id", detailerId)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error("Booking not found or permission denied");
    }

    // Create booking event
    await this.addBookingEvent(
      bookingId,
      "booking_declined",
      detailerId,
      "Detailer declined the booking request"
    );

    return data;
  },

  /**
   * Cancel a booking (customer action)
   */
  async cancelBooking(bookingId: string, customerId: string) {
    console.log("Cancelling booking:", { bookingId, customerId });

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_at: now,
        updated_at: now,
      })
      .eq("id", bookingId)
      .eq("customer_id", customerId)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error("Booking not found or permission denied");
    }

    // Create booking event
    await this.addBookingEvent(
      bookingId,
      "booking_cancelled",
      customerId,
      "Customer cancelled the booking"
    );

    return data;
  },

  /**
   * Get booking by ID with joined detailer and service data
   */
  async getBooking(bookingId: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        detailer:detailers!bookings_detailer_id_fkey(business_name, hero_image_url),
        service:services!bookings_service_id_fkey(name)
      `
      )
      .eq("id", bookingId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get booking details with timeline
   */
  async getBookingWithEvents(bookingId: string) {
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError) throw bookingError;

    const { data: events, error: eventsError } = await supabase
      .from("booking_events")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });

    if (eventsError) throw eventsError;

    return {
      booking: booking as Booking,
      events: events || [],
    };
  },

  /**
   * Create a new booking
   */
  async createBooking(
    booking: Omit<Booking, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase
      .from("bookings")
      .insert([booking])
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: string, status: Booking["status"]) {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },

  /**
   * Add booking event (status change, message, etc)
   */
  async addBookingEvent(
    bookingId: string,
    eventType: string,
    actorId?: string,
    message?: string
  ) {
    const { data, error } = await supabase
      .from("booking_events")
      .insert([
        {
          booking_id: bookingId,
          actor_id: actorId || null,
          event_type: eventType,
          message: message || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create booking from booking draft
   * Handles field mapping from UI draft to Supabase schema
   */
  async createBookingFromDraft(params: {
    customerId: string;
    detailerId: string;
    serviceId: string;
    vehicleType: string;
    vehicleRegistration: string;
    address: string;
    city: string;
    scheduledDate: string;
    scheduledTime: string;
    notes: string;
    totalPence: number;
    depositPence: number;
    stripePaymentIntentId?: string;
    paymentStatus?:
      | "unpaid"
      | "deposit_paid"
      | "not_required"
      | "paid"
      | "refunded"
      | "failed";
  }) {
    // Calculate platform fee (6%) and detailer payout
    const platformFeePence = Math.round(params.totalPence * 0.06);
    const detailerPayoutPence = params.totalPence - platformFeePence;

    // Create booking start timestamp
    const bookingStart = new Date(
      `${params.scheduledDate}T${params.scheduledTime}:00`
    ).toISOString();

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          customer_id: params.customerId,
          detailer_id: params.detailerId,
          service_id: params.serviceId,
          vehicle_id: null, // TODO: Create vehicle record if needed
          customer_name: "Test Customer", // TODO: Get from auth profile
          customer_phone: "+44 7700 900000", // TODO: Get from auth profile
          address_line: params.address,
          city: params.city,
          postcode: "M1 1AA", // TODO: Parse from address or collect separately
          latitude: 53.4808, // TODO: Geocode address
          longitude: -2.2426, // TODO: Geocode address
          booking_start: bookingStart,
          booking_end: null,
          notes: params.notes || null,
          status: "pending",
          payment_status: params.paymentStatus || "unpaid",
          total_pence: params.totalPence,
          deposit_pence: params.depositPence,
          platform_fee_pence: platformFeePence,
          detailer_payout_pence: detailerPayoutPence,
          stripe_payment_intent_id: params.stripePaymentIntentId || null,
          stripe_customer_id: null,
        },
      ])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Create initial booking event
    await this.addBookingEvent(
      booking.id,
      "booking_created",
      params.customerId,
      `Booking created for ${params.vehicleType} at ${params.address}`
    );

    // If deposit was paid, add payment event
    if (params.paymentStatus === "deposit_paid") {
      await this.addBookingEvent(
        booking.id,
        "deposit_paid",
        params.customerId,
        `Customer paid £${(params.depositPence / 100).toFixed(2)} deposit`
      );
    }

    return booking as Booking;
  },
};
