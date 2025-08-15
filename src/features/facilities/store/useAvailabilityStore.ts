import { create } from "zustand";
import { availableFacilitiesApi } from "../api/facilitiesApi";

export interface TimeSlot {
  hour: number;
  startTime: string;
  endTime: string;
  available: boolean;
  currentBookings: number;
  maxCapacity: number;
}

export interface AvailabilityData {
  date: string;
  dayName: string;
  fullyBooked: boolean;
  timeSlots: TimeSlot[];
}

interface AvailabilityState {
  availability: AvailabilityData | null;
  loading: boolean;
  error: string | null;
  selectedTimeSlots: TimeSlot[];
  fetchAvailability: (id: number, date: string) => Promise<void>;
  toggleTimeSlot: (timeSlot: TimeSlot) => void;
  clearSelectedSlots: () => void;
  reset: () => void;
}

export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
  availability: null,
  loading: false,
  error: null,
  selectedTimeSlots: [],

  fetchAvailability: async (id: number, date: string) => {
    set({ loading: true, error: null });
    try {
      const data = await availableFacilitiesApi(id, date);
      set({
        availability: data,
        loading: false,
        selectedTimeSlots: [],
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch availability",
        loading: false,
        availability: null,
      });
    }
  },

  toggleTimeSlot: (timeSlot: TimeSlot) => {
    set({ selectedTimeSlots: [timeSlot] });
  },

  clearSelectedSlots: () => {
    set({ selectedTimeSlots: [] });
  },

  reset: () => {
    set({
      availability: null,
      loading: false,
      error: null,
      selectedTimeSlots: [],
    });
  },
}));
