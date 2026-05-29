/// <reference lib="deno.ns" />
/**
 * Supabase Edge Function: Create Stripe Payment Intent
 *
 * Creates a PaymentIntent for booking deposit payment.
 * Called by mobile client before showing Stripe Payment Sheet.
 *
 * Security:
 * - Validates user JWT from Authorization header
 * - Uses authenticated user.id as customerId (doesn't trust client)
 * - Keeps Stripe secret key server-side
 *
 * Environment variables required:
 * - STRIPE_SECRET_KEY (sk_test_... or sk_live_...)
 * - SUPABASE_URL (auto-provided)
 * - SUPABASE_ANON_KEY (auto-provided)
 */

import { createClient } from "@supabase/supabase-js";
import { serve } from "std/http/server.ts";
import Stripe from "stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

interface PaymentIntentRequest {
  depositPence: number;
  detailerId: string;
  serviceId: string;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Extract and validate Bearer token
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          debug: "Missing bearer token",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client and validate token
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          debug: authError?.message ?? "No user returned",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Authenticated user: ${user.id}`);

    // Parse request body
    const body: PaymentIntentRequest = await req.json();
    const { depositPence, detailerId, serviceId } = body;

    // Validate request
    if (!depositPence || depositPence < 50) {
      return new Response(
        JSON.stringify({ error: "Invalid deposit amount (minimum 50 pence)" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Use authenticated user.id as customerId (don't trust client input)
    const customerId = user.id;

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: depositPence,
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer_id: customerId,
        detailer_id: detailerId,
        service_id: serviceId,
        app: "detaildash",
        type: "booking_deposit",
      },
    });

    console.log(
      `Payment Intent created: ${paymentIntent.id} for ${depositPence}p`
    );

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
