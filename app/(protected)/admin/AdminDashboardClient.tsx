"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Building2, Trophy, ShieldCheck } from "lucide-react";
import { getVenues } from "@/lib/api/venue";
import axiosInstance from "@/lib/api/axios-instance";

interface Props {
  user: any;
  token: string;
}

export default function AdminDashboardClient({ user, token }: Props) {
  const [stats, setStats] = useState({ users: 0, venues: 0 });

  useEffect(() => {
    (async () => {
      try {
        const venues = await getVenues();
        const userRes = await axiosInstance.get("/api/v1/admin/users?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats({
          users: userRes.data.meta?.total || 0,
          venues: venues.length,
        });
      } catch {}
    })();
  }, [token]);

  const cards = [
    { label: "Users", value: stats.users, icon: Users, href: "/admin/users", color: "bg-blue-500" },
    { label: "Venues", value: stats.venues, icon: Building2, href: "/admin/venues", color: "bg-green-500" },
  ];

  const quickLinks = [
    { label: "Manage Users", href: "/admin/users", icon: Users, desc: "Create, edit, or remove users" },
    { label: "Manage Venues", href: "/admin/venues", icon: Building2, desc: "View and manage all venues" },
    { label: "Manage Teams", href: "/admin/teams", icon: Trophy, desc: "View and manage teams" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.firstName}!</h2>
          <p className="text-gray-500">Here&apos;s an overview of your platform.</p>
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

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.label} href={link.href} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#121A2A] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{link.label}</p>
                    <p className="text-sm text-gray-500">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
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
    </div>
  );
}
