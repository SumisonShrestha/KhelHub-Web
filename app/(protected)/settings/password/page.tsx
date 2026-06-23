"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
    changePasswordSchema,
    ChangePasswordFormData,
} from "@/app/(auth)/_components/schema";
import { handleChangePassword } from "@/lib/actions/auth-action";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // visibility states
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            try {
                const result = await handleChangePassword({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                });

                if (result.success) {
                    setSuccess("Password updated successfully.");
                    reset();
                } else {
                    setError(result.message || "Update failed");
                }
            } catch (err: any) {
                setError(err?.message || "Update failed");
            }
        });
    };

    const inputClass =
        "h-12 w-full border border-gray-200 bg-white px-4 pr-10 text-black placeholder:text-gray-400 outline-none transition focus:border-black";

    const labelClass =
        "mb-2 block text-xs font-bold uppercase tracking-[0.3em] text-gray-500";

    return (
        <section className="min-h-screen bg-white px-6 py-16 text-black">
            <div className="mx-auto max-w-md">

                {/* HEADER */}
                <div className="mb-10">
                    <Link
                        href="/dashboard"
                        className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-black"
                    >
                        ← Back to Dashboard
                    </Link>

                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight">
                        Change Password
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Keep your account secure
                    </p>
                </div>

                {/* CARD */}
                <div className="border border-gray-200 bg-white p-8 shadow-sm">

                    {/* ALERTS */}
                    {error && (
                        <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* CURRENT PASSWORD */}
                        <div>
                            <label className={labelClass}>
                                Current Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    {...register("currentPassword")}
                                    className={inputClass}
                                    placeholder="••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.currentPassword && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        {/* NEW PASSWORD */}
                        <div>
                            <label className={labelClass}>
                                New Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    {...register("newPassword")}
                                    className={inputClass}
                                    placeholder="••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.newPassword && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className={labelClass}>
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    {...register("confirmNewPassword")}
                                    className={inputClass}
                                    placeholder="••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.confirmNewPassword && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.confirmNewPassword.message}
                                </p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isPending}
                            className="h-12 w-full bg-black text-xs font-bold uppercase tracking-[0.3em] text-white transition hover:bg-gray-900 disabled:opacity-50"
                        >
                            {isPending ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}