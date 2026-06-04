# DetailDash MVP UI Trimming

## Overview

The UI has been systematically trimmed for MVP launch by adding feature flags to hide non-essential features. All flags are set to `false` by default and can be enabled post-launch as features are built out.

## Feature Flags Added

Location: [`config/features.ts`](../config/features.ts)

```typescript
// DetailDash MVP Feature Flags - All false for MVP
SHOW_MESSAGING: false; // Customer ↔ Detailer messaging
SHOW_BEFORE_AFTER_PHOTOS: false; // Job photo uploads
SHOW_TIPS_ANALYTICS: false; // Tips in analytics
SHOW_EARNINGS_ANALYTICS: false; // Revenue/earnings stats
SHOW_REVIEWS_COUNT: false; // Review count alongside rating
SHOW_PAYMENT_METHODS: false; // Payment methods management
SHOW_SAVED_ADDRESSES: false; // Saved addresses feature
SHOW_DARK_MODE_TOGGLE: false; // Dark mode preference
SHOW_RATE_APP: false; // "Rate DetailDash" link
SHOW_DETAILER_PAYOUTS: false; // Payouts section
SHOW_AVAILABILITY_CALENDAR: false; // Calendar management
```

## What Was Hidden

### DetailerDashboardScreen

**Before:** 4 stat cards showing today's revenue, weekly revenue, jobs done, and rating with review count  
**After:** Stats completely hidden for MVP  
**Kept:** Availability toggle, new requests, upcoming jobs

### DetailerProfileMgmtScreen

**Before:** Monthly revenue, avg tip, payouts, availability calendar  
**After:** All earnings/analytics hidden  
**Kept:** Services & pricing, gallery management, settings link

### SettingsScreen

**Before:** Payment methods, saved addresses, dark mode toggle, "Rate DetailDash"  
**After:** All hidden for MVP  
**Kept:** Personal info, notifications toggle, help center, privacy & terms, sign out, "Switch to Pro mode"

### ActiveJobScreen

**Before:** Message button, "Add before/after photos" action  
**After:** Both hidden for MVP  
**Kept:** Call button, job progress stepper, customer card, vehicle info

### BookingDetailScreen

**Before:** Call + Message buttons  
**After:** Message button hidden  
**Kept:** Call button only

### DetailerProfileScreen & DetailerCard

**Before:** Rating displayed as "4.96 (312 reviews)"  
**After:** Review count hidden, shows "4.96" only  
**Kept:** Rating number, badges, gallery, services

## MVP Core Flow

### Customer Journey (Kept)

1. **Discover** → Browse detailers on home screen
2. **Profile** → View detailer details, services, rating
3. **Service** → Select service package
4. **Details** → Choose date/time, vehicle, address
5. **Payment** → Pay deposit via Stripe
6. **Confirmation** → Booking created, pending detailer acceptance
7. **My Bookings** → Track status, call detailer

### Detailer Journey (Kept)

1. **Dashboard** → Toggle availability, view new requests
2. **Request Detail** → Review booking, customer info
3. **Accept/Decline** → Confirm or reject booking
4. **Active Job** → Update status (en route → arrived → detailing → complete)
5. **Call** → Contact customer directly

## Database Alignment

The trimmed UI perfectly aligns with the lean MVP schema:

**Tables in use:**

- `profiles` — User accounts (customer/detailer/admin)
- `detailers` — Business profiles
- `detailer_photos` — Gallery images
- `services` — Service packages with pricing
- `vehicles` — Customer vehicles
- `bookings` — Booking records with status
- `booking_events` — Status change timeline

**Not needed for MVP:**

- ❌ `reviews` — No review system yet
- ❌ `messages` — No messaging
- ❌ `tips` — No tipping
- ❌ `saved_addresses` — No saved addresses
- ❌ `notifications` — Basic only
- ❌ `earnings_analytics` — No analytics tables
- ❌ `availability_calendar` — Simple on/off toggle

## Enabling Features Post-Launch

To enable a feature:

1. **Set flag to `true`** in `config/features.ts`
2. **Build backend support** (if needed)
3. **Test thoroughly** — UI already exists
4. **Deploy** — No code changes needed

Example:

```typescript
// Enable messaging once chat backend is ready
SHOW_MESSAGING: true,
```

## Benefits of This Approach

✅ **No code deletion** — Features preserved for later  
✅ **Clean launch** — MVP focused on core booking flow  
✅ **Fast iteration** — Flip flags to enable features  
✅ **User feedback** — Launch lean, learn what users need  
✅ **Data aligned** — Schema matches visible features

## Files Modified

- `config/features.ts` — Added 11 DetailDash MVP flags
- `src/detaildash/screens/DetailerDashboardScreen.tsx`
- `src/detaildash/screens/DetailerProfileMgmtScreen.tsx`
- `src/detaildash/screens/SettingsScreen.tsx`
- `src/detaildash/screens/ActiveJobScreen.tsx`
- `src/detaildash/screens/BookingDetailScreen.tsx`
- `src/detaildash/screens/DetailerProfileScreen.tsx`
- `src/detaildash/components/DetailerCard.tsx`

## Next Steps

1. ✅ **UI trimmed** — Feature flags applied
2. 🔲 **Seed database** — Add detailers and services
3. 🔲 **Connect home screen** — Real data instead of mocks
4. 🔲 **Implement booking flow** — Create booking records
5. 🔲 **Add Stripe** — Deposit payments
6. 🔲 **Detailer dashboard** — Accept/decline/status updates

---

**Last Updated:** 2026-05-19  
**Status:** Ready for MVP implementation
