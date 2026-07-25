"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Building2, Calendar, ShieldCheck, Trophy } from "lucide-react";
import { getVenues } from "@/lib/api/venue";
import axiosInstance from "@/lib/api/axios-instance";

interface Props {
  user: any;
  token: string;
}

export default function AdminDashboardClient({ user, token }: Props) {
  const [stats, setStats] = useState({ users: 0, venues: 0, teams: 0, bookings: 0 });

  useEffect(() => {
    (async () => {
      try {
        const venues = await getVenues();
        const userRes = await axiosInstance.get("/api/v1/admin/users?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingRes = await axiosInstance.get("/api/v1/admin/bookings?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teamRes = await axiosInstance.get("/api/v1/admin/teams?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats({
          users: userRes.data.meta?.total || 0,
          venues: venues.length,
          teams: teamRes.data.meta?.total || 0,
          bookings: bookingRes.data.meta?.total || 0,
        });
      } catch {}
    })();
  }, [token]);

  const cards = [
    { label: "Users", value: stats.users, icon: Users, href: "/admin/users", color: "bg-blue-500" },
    { label: "Venues", value: stats.venues, icon: Building2, href: "/admin/venues", color: "bg-green-500" },
    { label: "Teams", value: stats.teams, icon: Trophy, href: "/admin/teams", color: "bg-orange-500" },
    { label: "Bookings", value: stats.bookings, icon: Calendar, href: "/admin/bookings", color: "bg-purple-500" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your platform</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.label} href={card.href} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className={`inline-flex rounded-xl p-3 ${card.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">Admin Info</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Role</p>
              <p className="flex items-center gap-1 font-medium text-gray-900">
                <ShieldCheck className="h-4 w-4 text-blue-600" /> Admin
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Username</p>
              <p className="font-medium text-gray-900">{user.username}</p>
        </div>
      </div>
    </div>
    </div>
  );
}
