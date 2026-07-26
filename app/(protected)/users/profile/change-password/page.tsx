"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="min-h-screen bg-[#eef3f8] flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <p className="mt-1 text-sm text-gray-500">Update your account password</p>

        {message && (
          <div className={`mt-6 rounded-xl p-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="mt-8 space-y-5">
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

        <div className="mt-8 flex items-center gap-3">
          <button onClick={() => router.back()} className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 rounded-xl bg-[#121A2A] py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50">
            {saving ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
