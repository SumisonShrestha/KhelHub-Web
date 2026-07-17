import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface Booking {
  _id: string;
  userId: string;
  venueId: string;
  venueName: string;
  sport: string;
  city: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: "upcoming" | "cancelled" | "completed";
  createdAt: string;
}

export interface CreateBookingData {
  venueId: string;
  venueName: string;
  sport: string;
  city: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
}

export async function getMyBookings(params?: { status?: string }) {
  const res = await axiosInstance.get(API.BOOKINGS.ALL, { params });
  return res.data.data as Booking[];
}

export async function createBooking(data: CreateBookingData) {
  const res = await axiosInstance.post(API.BOOKINGS.ALL, data);
  return res.data.data as Booking;
}

export async function cancelBooking(id: string) {
  const res = await axiosInstance.put(API.BOOKINGS.CANCEL(id));
  return res.data.data as Booking;
}
