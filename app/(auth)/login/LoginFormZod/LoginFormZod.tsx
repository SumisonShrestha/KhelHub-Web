"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { LoginFormData, loginSchema } from "../../_components/schema";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleLoginUser } from "@/lib/actions/auth-action";

export default function LoginFormZod() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    const result = await handleLoginUser(data);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setApiError(result.message);
    }
  };

  return (
    <main className="flex min-h-screen">
      <div className="hidden lg:flex w-160 bg-white flex-col justify-center items-center relative overflow-hidden border-r border-gray-200 shadow-xl">
        <div className="relative w-full h-full">
          <Image
            src="/loginx.jpeg"
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

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-wider mb-2">
            LOGIN
          </h1>
          <p className="text-gray-600 text-sm">Enter your email and password</p>
        </div>

        {apiError && (
          <div className="w-full max-w-sm mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
            {apiError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-6"
        >
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-900 mb-3"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
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

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-900 mb-3"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
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

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-lg mt-8 hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Signing in…</span>
              </>
            ) : (
              <span>LOGIN</span>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gray-900 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
