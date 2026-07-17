"use server";

import { getTokenCookie } from "@/lib/cookies";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function handleCreateTeam(data: { name: string; location?: string; level?: string }) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.post(
      `${BASE_URL}/api/v1/teams`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message, data: res.data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create team",
    };
  }
}

export async function handleJoinTeam(teamId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.post(
      `${BASE_URL}/api/v1/teams/${teamId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message, data: res.data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to join team",
    };
  }
}

export async function handleGetMyTeams() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: [] };

    const res = await axios.get(`${BASE_URL}/api/v1/teams/my-teams`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: res.data.data as any[] };
  } catch {
    return { success: false, message: "Failed to fetch my teams", data: [] };
  }
}
