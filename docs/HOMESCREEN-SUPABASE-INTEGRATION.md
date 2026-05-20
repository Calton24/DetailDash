# HomeScreen Supabase Integration

## ✅ Completed: May 19, 2026

### Summary

Connected **HomeScreen only** to real Supabase data. All other screens still use mock data.

---

## Changes Made

### 1. **Created Data Mapper** (`src/detaildash/data/mappers.ts`)

Maps Supabase schema to UI types:

- `mapDetailer()` - Transform single detailer
- `mapDetailers()` - Transform array of detailers
- `mapService()` - Transform services
- `mapServiceCategory()` - Map category strings to ServiceCategoryId enums
- `mapBadges()` - Generate badges from detailer attributes

**Field Mappings:**
| Supabase Field | UI Field | Transformation |
|---|---|---|
| `business_name` | `name` | Direct |
| `tagline` | `tagline` | Direct |
| `description` | `about` | Direct |
| `rating` | `rating` | Direct |
| `review_count` | `reviewsCount` | Direct |
| `price_pence` | `priceFrom` | Divide by 100 |
| `hero_image_url` | `heroImage` | Direct |
| `is_verified` | `badges` | → "verified" |
| `rating >= 4.8` | `badges` | → "topRated" |
| `years_experience >= 5` | `badges` | → "pro" |

### 2. **Updated API Client** (`src/utils/api.ts`)

Enhanced `detailersApi.listDetailers()`:

- Fetches detailers with `status = 'active'` and `is_available = true`
- Orders by rating (descending)
- Fetches all services for detailers in a single query
- Attaches services to each detailer
- Returns type: `(Detailer & { services: Service[] })[]`

### 3. **Updated HomeScreen** (`src/detaildash/screens/HomeScreen.tsx`)

**Imports Changed:**

- ❌ Removed: `import { listDetailers } from "../data/mock"`
- ✅ Added: `import { detailersApi } from "../../utils/api"`
- ✅ Added: `import { mapDetailers } from "../data/mappers"`

**Logic Changed:**

- `load()` function now calls `detailersApi.listDetailers()`
- Maps Supabase response with `mapDetailers()`
- Adds error message state for better debugging
- Passes error message to `ErrorState` component

**UI Preserved:**

- ✅ All UI components unchanged
- ✅ Search filtering preserved
- ✅ Category filtering preserved
- ✅ Featured carousel preserved
- ✅ Nearby list preserved
- ✅ Loading states preserved
- ✅ Empty states preserved
- ✅ Error states preserved (enhanced with error messages)

---

## Data Source

### Seeded Detailers (Manchester, UK)

1. **Apex Mobile Detail** - Rating: 4.96 ⭐ (312 reviews)
2. **Pro Shine Detailing** - Rating: 4.87 ⭐ (156 reviews)
3. **Gleam Auto Care** - Rating: 4.79 ⭐ (89 reviews)
4. **Crystal Car Care** - Rating: 4.92 ⭐ (278 reviews)
5. **Detail Genius** - Rating: 4.85 ⭐ (201 reviews)

Each detailer has 3-4 services (Express Wash, Exterior, Interior, Full Detail, Ceramic Coating, Paint Correction).

---

## Testing Checklist

### ✅ Compilation

- [x] `npm run typecheck` passes (no HomeScreen-related errors)
- [x] Mappers compile correctly
- [x] API client types are correct

### 🧪 On-Device Testing Required

- [ ] HomeScreen loads real detailers from Supabase
- [ ] 5 Manchester detailers appear in UI
- [ ] Featured carousel shows detailers with high ratings
- [ ] Nearby list shows all detailers
- [ ] Search filtering works with real data
- [ ] Category filtering works with real services
- [ ] Tapping detailer card navigates to profile (still uses mock data)
- [ ] Pull-to-refresh refetches from Supabase
- [ ] Error state displays if Supabase is unreachable
- [ ] Loading skeleton appears during fetch

---

## Known Limitations

### Stub Functions (To Be Implemented)

1. **Distance Calculation** - Currently returns fixed 5km
   - TODO: Implement geospatial search with user location
   - Requires: User location permission + PostGIS queries

2. **Next Available Slot** - Returns "Tomorrow, 9:00 AM"
   - TODO: Fetch from detailer availability table
   - Requires: Availability/calendar feature implementation

3. **Gallery Images** - Returns empty array
   - TODO: Fetch from `detailer_photos` table
   - Requires: Query join in `detailersApi.listDetailers()`

4. **Eco-Friendly Badge** - Not implemented
   - Requires: `is_eco_friendly` flag in `detailers` table

---

## Screens Still Using Mock Data

🔴 **Not Modified (Still Mock):**

- DetailerProfileScreen
- ServiceSelectScreen
- BookingDetailsScreen
- MyBookingsScreen
- DetailerDashboardScreen
- DetailerJobRequestsScreen
- DetailerProfileMgmtScreen
- All booking flow screens
- All payment screens

---

## Next Steps

### Immediate

1. **Test on device** - Run app and verify HomeScreen displays real data
2. **Validate RLS** - Ensure public read access works for unauthenticated users

### Next Screen: DetailerProfileScreen

After confirming HomeScreen works:

1. Update `DetailerProfileScreen` to use `detailersApi.getDetailer(id)`
2. Map response with `mapDetailer()`
3. Fetch gallery images from `detailer_photos` table
4. Test profile view with real detailer data

---

## Rollback Instructions

If issues arise, revert these files:

```bash
git checkout src/detaildash/screens/HomeScreen.tsx
rm src/detaildash/data/mappers.ts
git checkout src/utils/api.ts
```

Then HomeScreen will use mock data again.

---

## Environment Variables Required

Ensure `.env.local` contains:

```
EXPO_PUBLIC_SUPABASE_URL=https://vsaqmipqgrhuvbsekxoe.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6RKiRsy2r900uIHGuditPA_sZkO1mXB
```

---

## Success Criteria

✅ **Integration Complete When:**

- [x] TypeScript compiles with no errors
- [ ] HomeScreen displays 5 real Manchester detailers
- [ ] All UI interactions work as before
- [ ] No crashes or runtime errors
- [ ] Data loads within 2 seconds on good connection
- [ ] Error handling works when network fails

**Status:** ✅ Code complete, ⏳ awaiting device testing
