export interface FacilityImage {
  id: number;
  originalName: string;
  filename: string;
  filePath: string;
  mimeType: string;
  size: number;
  extension: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: number;
  name: string;
  description: string;
  maxCapacity: number;
  maxAdvanceBookingDays: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  images?: FacilityImage[];
}

export interface BookingDetails {
  facilityId: number;
  bookingDate: string;
  startHour: number;
  notes: string;
}

export interface Booking {
  id: number;
  facilityId: number;
  bookingDate: string;
  startHour: number;
  endHour: number;
  status: string;
  createdAt: string;
}