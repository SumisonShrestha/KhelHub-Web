"use server";
import { register, login, whoami, updateProfile, changePassword } from "@/lib/api/auth";
import { LoginFormData, RegisterFormData } from "@/app/(auth)/_components/schema";
import { setTokenCookie, storeUserData, getTokenCookie, clearAuthCookies } from "@/lib/cookies";

// Register
export const handleRegisterUser = async (data: RegisterFormData) => {
    try {
        const result = await register(data);
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || "Registration failed" };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || "Registration failed" };
    }
}

//  Login 
export const handleLoginUser = async (data: LoginFormData) => {
    try {
        const result = await login(data);
        const user = result.data.user;
        const token = result.data.token;
        await setTokenCookie(token);
        await storeUserData(user);
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || "Login failed" };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || "Login failed" };
    }
}

// Logout
export const handleLogout = async () => {
    try {
        await clearAuthCookies();
        return { success: true, message: "Logged out successfully" };
    } catch (error: Error | any) {
        return { success: false, message: error?.message || "Logout failed" };
    }
}

// Who Am I 
export const handleWhoami = async () => {
    try {
        const token = await getTokenCookie();
        if (!token) return { success: false, message: "Not authenticated", data: null };
        const result = await whoami(token);
        return { success: true, message: result.message, data: result.data };
    } catch (error: Error | any) {
        return { success: false, message: error?.message || "Failed to fetch user", data: null };
    }
}

// Get Token (for client-side axios calls that need the token)
export const getToken = async () => {
    return await getTokenCookie();
}

// Update Profile (plain fields only — file upload handled client-side) 
export const handleUpdateProfile = async (data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}) => {
    try {
        const token = await getTokenCookie();
        if (!token) return { success: false, message: "Not authenticated" };

        // Build FormData server-side with just the text fields
        const fd = new FormData();
        fd.append("firstName", data.firstName);
        fd.append("lastName", data.lastName);
        fd.append("username", data.username);
        fd.append("email", data.email);

        const result = await updateProfile(token, fd);
        if (result.success) {
            await storeUserData(result.data);
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || "Update failed" };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || "Update failed" };
    }
}

//  Change Password 
export const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
}) => {
    try {
        const token = await getTokenCookie();
        if (!token) return { success: false, message: "Not authenticated" };
        const result = await changePassword(token, data);
        if (result.success) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message || "Password change failed" };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || "Password change failed" };
    }
}
