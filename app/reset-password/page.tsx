"use client";

import { useState, Suspense } from "react";
import { resetPassword } from "@/lib/api/auth";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      setMessage(res.message || "Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-sm text-gray-600 hover:underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <>
      {message && (
        <div className="w-full max-w-sm mb-4 px-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="w-full max-w-sm mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-semibold text-gray-900 mb-3">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="px-4 py-3 border border-gray-300 rounded-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "RESET PASSWORD"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
          Back to Login
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen">
      <div className="hidden lg:flex w-160 bg-white flex-col justify-center items-center relative overflow-hidden border-r border-gray-200 shadow-xl">
        <div className="relative w-full h-full">
          <Image
            src="/okpassword.png"
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
          <h1 className="text-4xl font-bold text-gray-900 tracking-wider mb-2">RESET PASSWORD</h1>
          <p className="text-gray-600 text-sm">Enter your new password</p>
        </div>

        <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}