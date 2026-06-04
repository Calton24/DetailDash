import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { supabase } from "./supabase";

/**
 * Get the currently authenticated user from Supabase Auth
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Sign in with Apple using Supabase Auth
 *
 * Flow:
 * 1. Request Apple credential with identityToken
 * 2. Send identityToken to Supabase for verification
 * 3. Supabase validates with Apple and creates/returns user
 * 4. Upsert profile with customer role
 *
 * @returns Supabase user object
 * @throws Error if Apple Sign In fails or identityToken is missing
 */
export async function signInWithApple() {
  if (Platform.OS !== "ios") {
    throw new Error("Apple Sign In is only available on iOS");
  }

  try {
    // Request Apple credential
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    console.log("Apple credential received:", {
      user: credential.user,
      email: credential.email,
      fullName: credential.fullName,
      hasIdentityToken: !!credential.identityToken,
    });

    // Apple must provide identityToken for backend verification
    if (!credential.identityToken) {
      throw new Error(
        "Apple Sign In failed: No identity token received. Please try again."
      );
    }

    // Sign in to Supabase with Apple identity token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
    });

    if (error) {
      console.error("Supabase Apple Sign In error:", error);
      throw error;
    }

    if (!data.user) {
      throw new Error("Apple Sign In succeeded but no user returned");
    }

    console.log("Supabase user signed in:", {
      id: data.user.id,
      email: data.user.email,
    });

    // Build full name from Apple credential
    let fullName: string | undefined;
    if (credential.fullName?.givenName && credential.fullName?.familyName) {
      fullName =
        `${credential.fullName.givenName} ${credential.fullName.familyName}`.trim();
    } else if (credential.fullName?.givenName) {
      fullName = credential.fullName.givenName;
    }

    // Upsert profile with customer role
    await upsertCustomerProfile(data.user.id, data.user.email, fullName);

    return data.user;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("ERR_REQUEST_CANCELED")
    ) {
      // User cancelled Apple Sign In - this is not an error
      console.log("User cancelled Apple Sign In");
      throw new Error("Apple Sign In was cancelled");
    }
    console.error("signInWithApple error:", error);
    throw error;
  }
}

/**
 * Upsert customer profile after successful authentication
 *
 * Idempotent - safe to call multiple times.
 * Creates or updates profile row for authenticated user.
 * MUST be called before creating bookings to satisfy FK constraint.
 *
 * @param userId - Supabase auth user ID
 * @param email - User email (optional)
 * @param fullName - User's full name (optional, defaults to "Customer")
 * @throws Error if profile upsert fails
 */
export async function upsertCustomerProfile(
  userId: string,
  email?: string,
  fullName?: string | null
) {
  try {
    const displayName = fullName?.trim() || "Customer";

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("full_name, email, phone, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    // Upsert profile - preserve existing data if present
    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        email: email || existingProfile?.email || "",
        full_name: existingProfile?.full_name || displayName,
        role: "customer",
        phone: existingProfile?.phone || "",
        avatar_url: existingProfile?.avatar_url || null,
      },
      {
        onConflict: "id",
      }
    );

    if (error) {
      console.error("Failed to upsert customer profile:", error);
      throw new Error("Could not prepare customer profile.");
    }

    console.log("Customer profile ready:", userId);
  } catch (error) {
    console.error("upsertCustomerProfile error:", error);
    throw error instanceof Error
      ? error
      : new Error("Could not prepare customer profile.");
  }
}

/**
 * Require authenticated user or throw error
 *
 * Use this when an action requires authentication.
 * If no user is signed in, this will throw and caller should trigger sign in.
 *
 * @returns Supabase user object
 * @throws Error if no authenticated user
 */
export async function requireAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

/**
 * Check if Apple Sign In is available on this device
 */
export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== "ios") {
    return false;
  }
  return await AppleAuthentication.isAvailableAsync();
}
