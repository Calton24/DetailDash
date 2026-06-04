/**
 * Lightweight booking draft state (no Zustand dependency added)
 *
 * A tiny pub-sub store so the multi-step booking flow can share state
 * across routes without prop-drilling. React subscribes via useBookingDraft.
 */

import { useSyncExternalStore } from "react";
import type { Detailer, DetailerService, VehicleType } from "../types";

export interface BookingDraft {
  detailer: Detailer | null;
  service: DetailerService | null;
  vehicleType: VehicleType | null;
  vehicleRegistration: string;
  address: string;
  scheduledDate: string; // ISO date
  scheduledTime: string; // "HH:MM"
  notes: string;
}

const INITIAL: BookingDraft = {
  detailer: null,
  service: null,
  vehicleType: null,
  vehicleRegistration: "",
  address: "",
  scheduledDate: new Date().toISOString().slice(0, 10),
  scheduledTime: "10:00",
  notes: "",
};

let state: BookingDraft = { ...INITIAL };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const bookingDraftStore = {
  get: () => state,
  set: (patch: Partial<BookingDraft>) => {
    state = { ...state, ...patch };
    emit();
  },
  reset: () => {
    state = { ...INITIAL };
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useBookingDraft(): BookingDraft {
  return useSyncExternalStore(
    bookingDraftStore.subscribe,
    bookingDraftStore.get,
    bookingDraftStore.get
  );
}

export function getEstimatedTotalCents(draft: BookingDraft): {
  subtotalCents: number;
  serviceFeeCents: number;
  travelCents: number;
  totalCents: number;
  depositCents: number;
} {
  const base = (draft.service?.priceFrom ?? 0) * 100;
  const travel = base > 0 ? 600 : 0; // $6 flat travel fee
  const serviceFee = Math.round(base * 0.06);
  const total = base + travel + serviceFee;
  const deposit = Math.min(3000, Math.round(total * 0.2));
  return {
    subtotalCents: base,
    serviceFeeCents: serviceFee,
    travelCents: travel,
    totalCents: total,
    depositCents: deposit,
  };
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
