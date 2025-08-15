import api from "@/src/shared/axios/axiosInstance";
import { Booking } from "@/src/types/Types";
import { create } from "zustand";

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  hasMore: boolean;
  status?: 'booked' | 'cancelled';
  sortBy: 'createdAt';
  sortDirection: 'asc' | 'desc';
  fetchBookings: (reset?: boolean) => Promise<void>;
  cancelBooking: (id: number) => Promise<void>;
  setStatus: (status: 'booked' | 'cancelled') => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

export const useMyBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  hasMore: false,
  sortBy: 'createdAt',
  sortDirection: 'desc',

  fetchBookings: async (reset = false) => {
    const { page, pageSize, status, sortBy, sortDirection } = get();
    set({ loading: true, error: null });

    try {
      const res = await api.get('/facilities/bookings/my', {
        params: {
          page,
          pageSize,
          ...(status ? { status } : {}),
          sortBy, 
          sortDirection,
        },
      });

      const { bookings, hasMore } = res.data;

      set({
        bookings: reset ? bookings : [...get().bookings, ...bookings],
        hasMore,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch bookings', loading: false });
    }
  },

  cancelBooking: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/facilities/bookings/${id}`);
      await get().fetchBookings(true);
    } catch (err: any) {
      set({ error: err.message || 'Failed to cancel booking', loading: false });
    }
  },

  setStatus: (status) => {
    set({ status, page: 1 });
    get().fetchBookings(true);
  },

  setSortDirection: (direction) => {
    set({ sortDirection: direction, page: 1 });
    get().fetchBookings(true);
  },
}));

