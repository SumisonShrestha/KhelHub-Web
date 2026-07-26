"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { handleChangePassword } from "@/lib/actions/auth-action";
import { changePasswordSchema, type ChangePasswordFormData } from "@/app/(auth)/_components/schema";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const update = (field: keyof ChangePasswordFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggle = (field: keyof typeof show) => () =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async () => {
    setMessage(null);
    const parsed = changePasswordSchema.safeParse(form);
    if (!parsed.success) {
      const err = parsed.error.issues[0];
      setMessage({ type: "error", text: err.message });
      return;
    }
    setSaving(true);
    const res = await handleChangePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
    setSaving(false);
    if (res.success) {
      setMessage({ type: "success", text: res.message || "Password changed successfully" });
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } else {
      setMessage({ type: "error", text: res.message || "Failed to change password" });
    }
  };

  return (
    <main className="flex min-h-screen">
      <div className="hidden lg:flex w-160 bg-white flex-col justify-center items-center relative overflow-hidden border-r border-gray-200 shadow-xl">
        <div className="relative w-full h-full">
          <Image
            src="/passchange.png"
            alt=""
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
          <h1 className="text-4xl font-bold text-gray-900 tracking-wider mb-2">CHANGE PASSWORD</h1>
          <p className="text-gray-600 text-sm">Update your account password</p>
        </div>

        {message && (
          <div className={`w-full max-w-sm mb-4 px-4 py-3 rounded-xl text-sm ${message.type === "success" ? "bg-green-50 border border-green-300 text-green-700" : "bg-red-50 border border-red-300 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="w-full max-w-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative mt-1.5">
              <input
                type={show.current ? "text" : "password"}
                value={form.currentPassword}
                onChange={update("currentPassword")}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={toggle("current")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative mt-1.5">
              <input
                type={show.new ? "text" : "password"}
                value={form.newPassword}
                onChange={update("newPassword")}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={toggle("new")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {show.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative mt-1.5">
              <input
                type={show.confirm ? "text" : "password"}
                value={form.confirmNewPassword}
                onChange={update("confirmNewPassword")}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={toggle("confirm")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-sm gap-3">
          <button onClick={() => router.back()} className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 rounded-xl bg-[#121A2A] py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50">
            {saving ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </main>
  );
}