"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { RegisterFormData, registerSchema } from "../_components/schema";
import { KhelHubLogo } from "../_components/type/AuthComponents";
import Link from "next/link";

export default function RegisterFormZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    alert("Registered: " + data.fullname + ", " + data.email);
  };

  return (
    <main className="flex min-h-screen">
      {/* ── Left Image Panel ── */}
      <div className="hidden lg:flex w-160 bg-white flex-col justify-center items-center relative overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src="/signup.jpeg"
            alt="Athletic Player"
            fill
            className="object-fill"
            priority
          />
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        {/* Logo */}
                <div className="mb-12 text-center">
                  <Image
                    src="/logo.png"
                    alt="KhelHub Logo"
                    width={200}
                    height={100}
                    priority
                    className="mx-auto object-contain"
                  />
                </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-wider mb-2">REGISTER</h1>
          <p className="text-gray-600 text-sm">Join us and start playing</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-5">
          {/* Full Name */}
          <div className="flex flex-col">
            <label htmlFor="fullname" className="text-sm font-semibold text-gray-900 mb-3">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              autoComplete="name"
              placeholder=""
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.fullname ? "border-red-500" : "border-gray-300"
              }`}
              {...register("fullname", { required: "Full name is required" })}
            />
            {errors.fullname && (
              <span className="text-red-500 text-xs mt-1" role="alert">
                {errors.fullname.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-semibold text-gray-900 mb-3">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder=""
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1" role="alert">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-semibold text-gray-900 mb-3">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder=""
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1" role="alert">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-900 mb-3">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder=""
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              {...register("confirmPassword", { required: "Confirm password is required" })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1" role="alert">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="w-full bg-black text-white font-bold py-3 rounded-lg mt-8 hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" aria-hidden="true" />
                <span>Creating account…</span>
              </>
            ) : (
              <span>REGISTER</span>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-10 text-center">
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
