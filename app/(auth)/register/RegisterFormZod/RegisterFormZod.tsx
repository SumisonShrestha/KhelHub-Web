"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { RegisterFormData, registerSchema } from "../../_components/schema";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterFormZod() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    setSuccessMessage(null);
    try {
      await api.post("/api/v1/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      setSuccessMessage("Account created! Redirecting to login…");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setApiError(message);
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* ── Left Image Panel ── */}
      <div className="hidden lg:flex w-160 bg-white flex-col justify-center items-center relative overflow-hidden border-r border-gray-200 shadow-xl">
        <div className="relative w-full h-full">
          <Image
            src="/signup.jpeg"
            alt="Athletic Player"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="KhelHub Logo"
            width={200}
            height={100}
            priority
            className="mx-auto object-contain"
          />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-wider mb-2">
            SIGN UP
          </h1>
          <p className="text-gray-600 text-sm">Join us and start playing</p>
        </div>

        {/* API Error / Success Banner */}
        {apiError && (
          <div className="w-full max-w-sm mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="w-full max-w-sm mb-4 px-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          {/* First Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              className={`px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              {...register("firstName")}
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </span>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              className={`px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              {...register("lastName")}
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              className={`px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              {...register("username")}
            />
            {errors.username && (
              <span className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className={`px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className={`w-full px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className={`w-full px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Creating account…</span>
              </>
            ) : (
              <span>REGISTER</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-gray-900 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
