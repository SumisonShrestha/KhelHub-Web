"use server";
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
