"use server";
import axiosInstance from "@/lib/api/axios-instance";
import { API } from "@/lib/api/endpoints";
import {
    adminGetUsers,
    adminGetUserById,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
    AdminCreateUserPayload,
    AdminUpdateUserPayload,
} from "@/lib/api/admin";
import { getTokenCookie } from "@/lib/cookies";

async function requireToken() {
    const token = await getTokenCookie();
    if (!token) throw new Error("Not authenticated");
    return token;
}

export async function handleAdminGetUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    try {
        const token = await requireToken();
        const result = await adminGetUsers(token, params);
        return { success: true, data: result.data, meta: result.meta };
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message || e?.message || "Failed to fetch users",
        };
    }
}

export async function handleAdminGetUser(id: string) {
    try {
        const token = await requireToken();
        const user = await adminGetUserById(token, id);
        return { success: true, data: user };
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message || e?.message || "Failed to fetch user",
        };
    }
}

export async function handleAdminCreateUser(payload: AdminCreateUserPayload) {
    try {
        const token = await requireToken();
        const user = await adminCreateUser(token, payload);
        return { success: true, data: user, message: "User created successfully" };
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message || e?.message || "Failed to create user",
        };
    }
}

export async function handleAdminUpdateUser(id: string, payload: AdminUpdateUserPayload) {
    try {
        const token = await requireToken();
        const user = await adminUpdateUser(token, id, payload);
        return { success: true, data: user, message: "User updated successfully" };
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message || e?.message || "Failed to update user",
        };
    }
}

export async function handleAdminDeleteUser(id: string) {
    try {
        const token = await requireToken();
        await adminDeleteUser(token, id);
        return { success: true, message: "User deleted successfully" };
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message || e?.message || "Failed to delete user",
        };
    }
}

export async function handleAdminGetVenues(params: { page?: number; limit?: number; search?: string }) {
    try {
        const token = await requireToken();
        const res = await axiosInstance.get(API.ADMIN.VENUES, {
            params,
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: res.data.data, meta: res.data.meta };
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message || e?.message || "Failed to fetch venues",
        };
    }
}

export async function handleAdminDeleteVenue(id: string) {
    try {
        const token = await requireToken();
        await axiosInstance.delete(API.ADMIN.VENUE_BY_ID(id), {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, message: "Venue deleted successfully" };
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message || e?.message || "Failed to delete venue",
        };
    }
}

export async function handleAdminGetTeams(params: { page?: number; limit?: number; search?: string }) {
    try {
        const token = await requireToken();
        const res = await axiosInstance.get(API.ADMIN.TEAMS, {
            params,
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: res.data.data, meta: res.data.meta };
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message || e?.message || "Failed to fetch teams",
        };
    }
}

export async function handleAdminDeleteTeam(id: string) {
    try {
        const token = await requireToken();
        await axiosInstance.delete(API.ADMIN.TEAM_BY_ID(id), {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, message: "Team deleted successfully" };
    } catch (e: any) {
        return {
            success: false,
            message: e?.response?.data?.message || e?.message || "Failed to delete team",
        };
    }
}
