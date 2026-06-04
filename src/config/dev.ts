/**
 * Development/Testing Configuration
 *
 * TEMPORARY: These values are for MVP development only.
 * Replace with real auth before production launch.
 */

/**
 * Test customer UUID for MVP booking flow testing
 *
 * TODO: Remove this once Supabase Auth is wired up.
 * Real customer_id should come from auth.user().id
 */
export const DEV_TEST_CUSTOMER_ID = "20000000-0000-0000-0000-000000000001";

/**
 * Test detailer UUID for MVP dashboard testing
 * Uses Apex Mobile Detail from seeded data
 *
 * TODO: Remove this once Supabase Auth is wired up.
 * Real detailer profile should come from auth.user() -> profiles -> detailers
 */
export const DEV_TEST_DETAILER_ID = "10000000-0000-0000-0000-000000000001";

/**
 * Check if we're in development mode
 */
export const IS_DEV = __DEV__;

/**
 * Guard to prevent production booking creation without auth
 */
export function requireTestCustomer(): string {
  if (!IS_DEV) {
    throw new Error(
      "Production booking requires authentication. DEV_TEST_CUSTOMER_ID should not be used in production."
    );
  }
  return DEV_TEST_CUSTOMER_ID;
}

/**
 * Guard to prevent production detailer access without auth
 */
export function requireTestDetailer(): string {
  if (!IS_DEV) {
    throw new Error(
      "Production detailer access requires authentication. DEV_TEST_DETAILER_ID should not be used in production."
    );
  }
  return DEV_TEST_DETAILER_ID;
}
