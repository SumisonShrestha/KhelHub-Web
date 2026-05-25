"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { RegisterFormData, registerSchema } from "../../_components/schema";
import { KhelHubLogo } from "../../_components/type/AuthComponents";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterFormZod() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      {/* ── Left Image Panel (MATCHED TO LOGIN STYLE) ── */}
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

      
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">

        
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
          <h1 className="text-4xl font-bold text-gray-900 tracking-wider mb-2">
            SIGN UP
          </h1>
          <p className="text-gray-600 text-sm">
            Join us and start playing
          </p>
        </div>

        
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-6"
        >

          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-3">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter full name"
              className={`px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.fullname ? "border-red-500" : "border-gray-300"
              }`}
              {...register("fullname", { required: "Full name is required" })}
            />

            {errors.fullname && (
              <span className="text-red-500 text-xs mt-1">
                {errors.fullname.message}
              </span>
            )}
          </div>

          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-3">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              className={`px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", { required: "Email is required" })}
            />

            {errors.email && (
              <span className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-3">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className={`w-full px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password", { required: "Password is required" })}
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

          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-3">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className={`w-full px-4 py-3 border rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                })}
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

          
          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account…" : "REGISTER"}
          </button>
        </form>

        
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