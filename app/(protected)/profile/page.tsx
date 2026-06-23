"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
    updateProfileSchema,
    UpdateProfileFormData,
} from "@/app/(auth)/_components/schema";
import { handleUpdateProfile, getToken } from "@/lib/actions/auth-action";
import { useUser } from "@/context/UserContext";

export default function ProfilePage() {
    const { user, isLoading, refreshUser } = useUser();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
    });

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
            });
        }
    }, [user, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onSubmit = (data: UpdateProfileFormData) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            try {
                // Step 1: upload image directly from client if one was selected
                if (selectedFile) {
                    const token = await getToken();
                    if (!token) throw new Error("Not authenticated");

                    const fd = new FormData();
                    fd.append("firstName", data.firstName);
                    fd.append("lastName", data.lastName);
                    fd.append("username", data.username);
                    fd.append("email", data.email);
                    fd.append("profilePicture", selectedFile);

                    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
                    await axios.put(`${backendUrl}/api/v1/auth/update`, fd, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    setSuccess("Profile updated successfully!");
                    setSelectedFile(null);
                    refreshUser();
                    return;
                }

                // Step 2: no image — use server action for plain fields
                const result = await handleUpdateProfile({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    username: data.username,
                    email: data.email,
                });

                if (result.success) {
                    setSuccess("Profile updated successfully!");
                    refreshUser();
                } else {
                    setError(result.message || "Update failed");
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || err?.message || "Update failed");
            }
        });
    };

    const inputClass =
        "h-12 w-full border border-gray-200 bg-white px-4 text-black placeholder:text-gray-400 outline-none transition focus:border-black";

    const labelClass =
        "mb-2 block text-xs font-bold uppercase tracking-[0.3em] text-gray-500";

    const avatarSrc = previewUrl ?? user?.profilePicture ?? null;

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-white px-6 py-16 text-black">
            <div className="mx-auto max-w-3xl">

                {/* HEADER */}
                <div className="mb-10">
                    <Link
                        href="/dashboard"
                        className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-black"
                    >
                        ← Back to Dashboard
                    </Link>

                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight">
                        Edit Profile
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Manage your account information
                    </p>
                </div>

                {/* CARD */}
                <div className="border border-gray-200 bg-white p-8 shadow-sm rounded">

                    {/* AVATAR */}
                    <div className="mb-10 flex items-center gap-5">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative h-20 w-20 cursor-pointer overflow-hidden border border-gray-200"
                        >
                            {avatarSrc ? (
                                <Image
                                    src={avatarSrc}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    unoptimized={avatarSrc.startsWith("blob:")}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-bold">
                                    {user?.firstName?.[0]}
                                    {user?.lastName?.[0]}
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-black"
                            >
                                Change Photo
                            </button>

                            {selectedFile && (
                                <p className="mt-1 text-xs text-gray-500">
                                    {selectedFile.name}
                                </p>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* ALERTS */}
                    {error && (
                        <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>First Name</label>
                                <input
                                    {...register("firstName")}
                                    className={inputClass}
                                    placeholder="Enter first name"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Last Name</label>
                                <input
                                    {...register("lastName")}
                                    className={inputClass}
                                    placeholder="Enter last name"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Username</label>
                            <input
                                {...register("username")}
                                className={inputClass}
                                placeholder="Enter username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                {...register("email")}
                                className={inputClass}
                                placeholder="Enter email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || isPending}
                            className="h-12 w-full bg-black text-xs font-bold uppercase tracking-[0.3em] text-white transition hover:bg-gray-900 disabled:opacity-50"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
