"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Camera } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { getToken } from "@/lib/actions/auth-action";
import { updateProfile } from "@/lib/api/auth";

export default function EditProfilePage() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState(user?.firstName || "");
  const [avatar, setAvatar] = useState<string | null>(user?.profilePicture || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return;
      const fd = new FormData();
      fd.append("firstName", fullName.trim());
      fd.append("lastName", "");
      fd.append("username", user?.username || "");
      fd.append("email", user?.email || "");
      if (avatarFile) fd.append("profilePicture", avatarFile);
      const result = await updateProfile(token, fd);
      if (result.success) {
        setUser({ ...user!, firstName: fullName.trim(), profilePicture: result.data?.profilePicture || avatar });
        router.push("/profile");
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f8] flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Update your profile information</p>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-gray-100">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-bold text-gray-500">
                  {(user?.firstName || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700">
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <p className="mt-3 text-xs text-gray-400">Click on the avatar to upload a profile photo</p>
        </div>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button onClick={() => router.back()} className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !fullName.trim()} className="flex-1 rounded-xl bg-[#121A2A] py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
