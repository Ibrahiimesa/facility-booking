import api from "@/src/shared/axios/axiosInstance";
import { BookingDetails, Facility } from "@/src/types/Types";

export const facilitiesApi = async (search?: string) => {
  const res = await api.get<Facility[]>(
      `/facilities${search ? `?search=${encodeURIComponent(search)}` : ""}`
  );
  console.log("res", res);
  return res.data;
}

export const detailedFacilitiesApi = async (id: number) => {
  const res = await api.get<Facility>(`/facilities/${id}`);
  console.log("res", res);
  return res.data;
};

export const availableFacilitiesApi = async (id: number, date: string) => {
  const res = await api.get(`/facilities/${id}/availability/daily?date=${date}`);
  console.log("res", res);
  return res.data;
};

export const bookingApi = async (bookingDetails: BookingDetails) => {
  const res = await api.post("/facilities/bookings", bookingDetails);
  console.log("res", res);
  return res.data;
};