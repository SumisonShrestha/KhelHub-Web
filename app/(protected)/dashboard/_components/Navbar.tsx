"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Users,
  Download
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6 text-white">
      <div className="flex items-center gap-10">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-black flex items-center justify-center font-bold">
            ⚽
          </div>

          <h1 className="text-2xl font-bold">
            YAKPLAYO
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-gray-300">

          <Link
            href="/dashboard"
            className="text-blue-400 border-b-2 border-blue-500 pb-1"
          >
            Home
          </Link>

          <Link href="/venues">
            Venues
          </Link>

          <Link href="/teams">
            Teams
          </Link>

        </div>
      </div>

      <div className="flex items-center gap-4">

        <button className="border border-gray-600 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-white/10">
          <Download size={16} />
          Install App
        </button>

        <button
          onClick={() => router.push("/login")}
          className="bg-[#121A2A] px-5 py-2 rounded-xl flex items-center gap-2"
        >
          <User size={18} />
          Login / Sign Up
        </button>

        <button
          className="bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold flex items-center gap-2"
        >
          <Building2 size={18} />
          List Your Venue
        </button>

        <button
          className="bg-white px-5 py-2 rounded-xl text-gray-700 font-semibold flex items-center gap-2"
        >
          <Users size={18} />
          My Teams
        </button>

      </div>
    </nav>
  );
}