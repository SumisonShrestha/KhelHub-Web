import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface AdminUser {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: "admin" | "user";
    profilePicture: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedUsersResponse {
    data: AdminUser[];
    meta: PaginationMeta;
}

export interface AdminCreateUserPayload {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
}

export interface AdminUpdateUserPayload {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: "admin" | "user";
}

export const adminGetUsers = async (
    token: string,
    params: { page?: number; limit?: number; search?: string } = {}
): Promise<PaginatedUsersResponse> => {
    const { page = 1, limit = 10, search } = params;
    const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
    });
    const response = await axiosInstance.get(
        `${API.ADMIN.USERS}?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return { data: response.data.data, meta: response.data.meta };
};

export const adminGetUserById = async (token: string, id: string): Promise<AdminUser> => {
    const response = await axiosInstance.get(API.ADMIN.USER_BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const adminCreateUser = async (
    token: string,
    payload: AdminCreateUserPayload
): Promise<AdminUser> => {
    const response = await axiosInstance.post(API.ADMIN.USERS, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const adminUpdateUser = async (
    token: string,
    id: string,
    payload: AdminUpdateUserPayload
): Promise<AdminUser> => {
    const response = await axiosInstance.put(API.ADMIN.USER_BY_ID(id), payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const adminDeleteUser = async (token: string, id: string): Promise<void> => {
    await axiosInstance.delete(API.ADMIN.USER_BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
    });
};
