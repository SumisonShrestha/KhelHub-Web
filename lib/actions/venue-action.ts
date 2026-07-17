"use server";

import { getTokenCookie } from "@/lib/cookies";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function handleCreateVenue(data: {
  name: string;
  description: string;
  sport: string;
  city: string;
  location: string;
  image: string;
  pricePerHour: number;
  amenities: string[];
}) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.post(
      `${BASE_URL}/api/v1/venues`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message, data: res.data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create venue",
    };
  }
}
