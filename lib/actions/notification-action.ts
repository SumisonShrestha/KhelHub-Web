"use server";

import { getTokenCookie } from "@/lib/cookies";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function handleGetNotifications() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: [] };

    const res = await axios.get(`${BASE_URL}/api/v1/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: res.data.data };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to fetch notifications", data: [] };
  }
}

export async function handleGetUnreadCount() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", count: 0 };

    const res = await axios.get(`${BASE_URL}/api/v1/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, count: res.data.data.count };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to get unread count", count: 0 };
  }
}

export async function handleMarkAsRead(notificationId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    await axios.put(
      `${BASE_URL}/api/v1/notifications/${notificationId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to mark as read" };
  }
}

export async function handleMarkAllAsRead() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    await axios.put(
      `${BASE_URL}/api/v1/notifications/read-all`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to mark all as read" };
  }
}
