"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { AdminUser } from "@/lib/api/admin";

const createSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName:  z.string().min(1, "Last name is required"),
    username:  z.string().min(3, "Username must be at least 3 characters"),
    email:     z.string().email("Invalid email address"),
    password:  z.string().min(6, "Password must be at least 6 characters"),
    role:      z.enum(["admin", "user"]),
});

const editSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName:  z.string().min(1, "Last name is required"),
    username:  z.string().min(3, "Username must be at least 3 characters"),
    email:     z.string().email("Invalid email address"),
    password:  z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    role:      z.enum(["admin", "user"]),
});

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData   = z.infer<typeof editSchema>;

interface UserFormModalProps {
    mode: "create" | "edit";
    user?: AdminUser | null;
    isSubmitting: boolean;
    onSubmit: (data: CreateFormData | EditFormData) => void;
    onClose: () => void;
}

export default function UserFormModal({
    mode, user, isSubmitting, onSubmit, onClose,
}: UserFormModalProps) {
    const schema = mode === "create" ? createSchema : editSchema;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateFormData | EditFormData>({
        resolver: zodResolver(schema as any),
        defaultValues: {
            firstName: "",
            lastName:  "",
            username:  "",
            email:     "",
            password:  "",
            role:      "user",
        },
    });

    useEffect(() => {
        if (mode === "edit" && user) {
            reset({
                firstName: user.firstName,
                lastName:  user.lastName,
                username:  user.username,
                email:     user.email,
                password:  "",
                role:      user.role,
            });
        } else {
            reset({ firstName: "", lastName: "", username: "", email: "", password: "", role: "user" });
        }
    }, [mode, user, reset]);

    const inputCls = (hasError: boolean) =>
        `w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 ${
            hasError
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-gray-200 bg-gray-50 focus:border-blue-400"
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {mode === "create" ? "Add New User" : "Edit User"}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {mode === "create"
                                ? "Fill in the details to create a new account"
                                : "Update the user's information below"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                First Name
                            </label>
                            <input {...register("firstName")} className={inputCls(!!errors.firstName)} placeholder="John" />
                            {errors.firstName && (
                                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Last Name
                            </label>
                            <input {...register("lastName")} className={inputCls(!!errors.lastName)} placeholder="Doe" />
                            {errors.lastName && (
                                <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Username</label>
                        <input {...register("username")} className={inputCls(!!errors.username)} placeholder="johndoe" />
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            className={inputCls(!!errors.email)}
                            placeholder="john@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">
                            {mode === "edit" ? "New Password (leave blank to keep current)" : "Password"}
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            className={inputCls(!!errors.password)}
                            placeholder={mode === "edit" ? "Leave blank to keep current" : "Min. 6 characters"}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Role</label>
                        <select {...register("role")} className={`${inputCls(!!errors.role)} cursor-pointer`}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                            {mode === "create" ? "Create User" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
