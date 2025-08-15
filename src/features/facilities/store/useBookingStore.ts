// stores/useBookingStore.ts
import { BookingDetails } from "@/src/types/Types";
import { create } from "zustand";
import { bookingApi } from "../api/facilitiesApi";

interface BookingState {
  loading: boolean;
  error: string | null;
  success: boolean;
  bookFacility: (details: BookingDetails) => Promise<void>;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  loading: false,
  error: null,
  success: false,

  bookFacility: async (details) => {
    set({ loading: true, error: null, success: false });
    try {
      const res = await bookingApi(details);
      set({ success: true });
    } catch (err: any) {
      console.error("Booking error", err);
      set({ error: err.response?.data?.message || "Booking failed" });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ loading: false, error: null, success: false }),
}));
