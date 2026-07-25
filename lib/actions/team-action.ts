"use server";

import { getTokenCookie } from "@/lib/cookies";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function handleCreateTeam(data: { name: string; description?: string; sport?: string; location?: string; level?: string; maxPlayers?: number; phone?: string; preferredVenue?: string; ageGroup?: string }) {
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

export async function handleJoinTeam(teamId: string, senderName: string, phone: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.post(
      `${BASE_URL}/api/v1/teams/${teamId}/join`,
      { senderName, phone },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message, data: res.data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to send join request",
    };
  }
}

export async function handleDeleteTeam(teamId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.delete(
      `${BASE_URL}/api/v1/teams/${teamId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to cancel team",
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

export async function handleGetReceivedRequests() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: [] };

    const res = await axios.get(`${BASE_URL}/api/v1/teams/join-requests/received`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: res.data.data as any[] };
  } catch {
    return { success: false, message: "Failed to fetch requests", data: [] };
  }
}

export async function handleGetSentRequests() {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: [] };

    const res = await axios.get(`${BASE_URL}/api/v1/teams/join-requests/sent`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: res.data.data as any[] };
  } catch {
    return { success: false, message: "Failed to fetch requests", data: [] };
  }
}

export async function handleApproveRequest(requestId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.put(
      `${BASE_URL}/api/v1/teams/join-requests/${requestId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to approve request" };
  }
}

export async function handleDenyRequest(requestId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.put(
      `${BASE_URL}/api/v1/teams/join-requests/${requestId}/deny`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to deny request" };
  }
}

export async function handleCancelJoinRequest(requestId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.put(
      `${BASE_URL}/api/v1/teams/join-requests/${requestId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to cancel request" };
  }
}

export async function handleLeaveTeam(teamId: string) {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await axios.post(
      `${BASE_URL}/api/v1/teams/${teamId}/leave`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: res.data.message };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to leave team" };
  }
}
