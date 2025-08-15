import { Facility } from "@/src/types/Types";
import { create } from "zustand";
import { detailedFacilitiesApi, facilitiesApi } from "../api/facilitiesApi";

interface FacilitiesState {
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  fetchFacilities: (search?: string) => Promise<void>;
}

export const useFacilitiesStore = create<FacilitiesState>((set) => ({
  facilities: [],
  loading: false,
  error: null,

  fetchFacilities: async (search) => {
    set({ loading: true, error: null });
    try {
      const listRes = await facilitiesApi(search);
      const basicFacilities = listRes;

      const detailedFacilities = await Promise.all(
        basicFacilities.map(async (facility) => {
          try {
            const detailRes = await detailedFacilitiesApi(facility.id);
            console.log("detailRes", detailRes);
            return detailRes; 
          } catch (err) {
            console.error(
              `Failed to fetch details for facility ${facility.id}`,
              err
            );
            return facility;
          }
        })
      );

      set({ facilities: detailedFacilities, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
}));
