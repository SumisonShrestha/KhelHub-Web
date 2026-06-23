import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("Invalid email address"),
    firstName: z.string("Firstname must be string")
        .min(2, "First name must be at least 2 characters length"),
    lastName: z.string("Last name must be string")
        .min(2, "Last name must be at least 2 characters length"),
    username: z.string("Username must be string")
        .min(3, "Username must be at least 3 characters length"),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters length"),
    confirmPassword: z.string("Confirm Password must be string")
        .min(6, "Confirm Password must be at least 6 characters lengthg")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters length")
});

export type LoginFormData = z.infer<typeof loginSchema>;

//  update profile schema huncha
export const updateProfileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters length"),
    lastName: z.string().min(2, "Last name must be at least 2 characters length"),
    username: z.string().min(3, "Username must be at least 3 characters lenght"),
    email: z.email("Invalid email address"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// change password schema
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters length"),
    newPassword: z.string().min(6, "New password must be at least 6 characters length"),
    confirmNewPassword: z.string().min(6, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
