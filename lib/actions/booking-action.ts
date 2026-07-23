"use server";

import { getTokenCookie } from "@/lib/cookies";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CreateBookingData {
  venueId: string;
  venueName: string;
  sport: string;
  city: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  paymentMethod?: string;
  paymentId?: string;
}

interface Booking {
  _id: string;
  venueId: string;
  venueName: string;
  sport: string;
  city: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export async function handleCreateBooking(data: CreateBookingData) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.post(
      `${BASE_URL}/api/v1/bookings`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message, data: res.data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Booking failed",
    };
  }
}

export async function handleGetMyBookings() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: [] };

    const res = await axios.get(`${BASE_URL}/api/v1/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: res.data.data as Booking[] };
  } catch {
    return { success: false, message: "Failed to fetch bookings", data: [] };
  }
}

export async function handleCancelBooking(bookingId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    await axios.put(
      `${BASE_URL}/api/v1/bookings/${bookingId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: "Booking cancelled" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to cancel booking",
    };
  }
}
