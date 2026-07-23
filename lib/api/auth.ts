import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Registration failed");
    }
}

export const login = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.LOGIN, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Login failed");
    }
}

export const whoami = async (token: string) => {
    try {
        const response = await axiosInstance.get(API.AUTH.WHOAMI, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch user");
    }
}

// Update profile fields + optional profile picture (multipart/form-data)
export const updateProfile = async (token: string, formData: FormData) => {
    try {
        const response = await axiosInstance.put(API.AUTH.UPDATE, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Update failed");
    }
}

export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post(API.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to send reset email");
  }
}

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await axiosInstance.post(API.AUTH.RESET_PASSWORD, { token, password });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Password reset failed");
  }
}

// Change password — uses its own dedicated endpoint, NOT /update
export const changePassword = async (
    token: string,
    data: { currentPassword: string; newPassword: string }
) => {
    try {
        const response = await axiosInstance.put(API.AUTH.CHANGE_PASSWORD, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Password change failed");
    }
}
