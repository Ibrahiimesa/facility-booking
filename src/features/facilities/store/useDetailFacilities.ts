import { Facility } from "@/src/types/Types";
import { create } from "zustand";
import { detailedFacilitiesApi } from "../api/facilitiesApi";

interface DetailFacilitiesState {
  facilities: Facility | null;
  loading: boolean;
  error: string | null;
  fetchDetailFacilities: (id : number) => Promise<void>;
}

export const useDetailFacilitiesStore = create<DetailFacilitiesState>((set) => ({
  facilities: null,
  loading: false,
  error: null,

  fetchDetailFacilities: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await detailedFacilitiesApi(id);
      set({ facilities: res, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
}));