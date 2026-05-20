/**
 * Static Feature Flags
 *
 * Single source of truth for tab/screen visibility.
 * Auth capabilities are in src/features/auth/authCapabilities.ts.
 * Defaults can depend on __DEV__ — that's fine.
 * E2E tests force-enable what they need via EXPO_PUBLIC_E2E=1.
 *
 * Forked apps: replace this file or flip flags. Tabs disappear without
 * hacking routing logic.
 */

const isE2E = process.env.EXPO_PUBLIC_E2E === "1";

type FlagName =
  | "SHOW_HOME"
  | "SHOW_NOTES"
  | "SHOW_AUTH"
  | "SHOW_PLAYGROUND"
  | "SHOW_MOBILE_CORE"
  // DetailDash MVP features
  | "SHOW_MESSAGING"
  | "SHOW_BEFORE_AFTER_PHOTOS"
  | "SHOW_TIPS_ANALYTICS"
  | "SHOW_EARNINGS_ANALYTICS"
  | "SHOW_REVIEWS_COUNT"
  | "SHOW_PAYMENT_METHODS"
  | "SHOW_SAVED_ADDRESSES"
  | "SHOW_DARK_MODE_TOGGLE"
  | "SHOW_RATE_APP"
  | "SHOW_DETAILER_PAYOUTS"
  | "SHOW_AVAILABILITY_CALENDAR";

type Flags = Record<FlagName, boolean>;

export const FeatureFlags: Flags = {
  /** Home tab — always visible */
  SHOW_HOME: true,

  /** Notes harness — dev + E2E only */
  SHOW_NOTES: __DEV__ || isE2E,

  /** Auth tab (demo) — dev only, forked apps should remove */
  SHOW_AUTH: __DEV__,

  /** Playground tab — dev + E2E only */
  SHOW_PLAYGROUND: __DEV__ || isE2E,

  /** Mobile Core dev tools — dev only */
  SHOW_MOBILE_CORE: __DEV__,

  // ============================================
  // DetailDash MVP Feature Flags
  // ============================================
  // All set to false for MVP launch, can enable post-launch

  /** Messaging between customer and detailer */
  SHOW_MESSAGING: false,

  /** Before/after photo uploads for jobs */
  SHOW_BEFORE_AFTER_PHOTOS: false,

  /** Tips analytics in detailer dashboard */
  SHOW_TIPS_ANALYTICS: false,

  /** Earnings/revenue analytics in detailer screens */
  SHOW_EARNINGS_ANALYTICS: false,

  /** Display review count alongside rating */
  SHOW_REVIEWS_COUNT: false,

  /** Payment methods management in settings */
  SHOW_PAYMENT_METHODS: false,

  /** Saved addresses in customer settings */
  SHOW_SAVED_ADDRESSES: false,

  /** Dark mode toggle in settings */
  SHOW_DARK_MODE_TOGGLE: false,

  /** "Rate DetailDash" in settings */
  SHOW_RATE_APP: false,

  /** Payouts section in detailer profile */
  SHOW_DETAILER_PAYOUTS: false,

  /** Availability calendar management */
  SHOW_AVAILABILITY_CALENDAR: false,
};

export type FeatureFlag = keyof typeof FeatureFlags;
