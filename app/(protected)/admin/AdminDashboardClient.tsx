"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Building2, Calendar, Trophy, TrendingUp } from "lucide-react";
import { getVenues } from "@/lib/api/venue";
import axiosInstance from "@/lib/api/axios-instance";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  user: any;
  token: string;
}

export default function AdminDashboardClient({ user, token }: Props) {
  const [stats, setStats] = useState({ users: 0, venues: 0, teams: 0, bookings: 0 });
  const [trend, setTrend] = useState<{ date: string; users: number; venues: number; teams: number; bookings: number }[]>([]);

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

        const LIMIT = 10000;

        const [allUsers, allVenues, allTeams, allBookings] = await Promise.all([
          axiosInstance.get(`/api/v1/admin/users?limit=${LIMIT}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get(`/api/v1/admin/venues?limit=${LIMIT}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get(`/api/v1/admin/teams?limit=${LIMIT}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get(`/api/v1/admin/bookings?limit=${LIMIT}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const allDates = new Set<string>();
        const countMap: Record<string, { users: number; venues: number; teams: number; bookings: number }> = {};

        const addDate = (arr: any[], field: string, key: "users" | "venues" | "teams" | "bookings") => {
          (arr || []).forEach((item: any) => {
            const raw = item[field] || item.createdAt || "";
            const d = raw.split("T")[0];
            if (!d) return;
            allDates.add(d);
            if (!countMap[d]) countMap[d] = { users: 0, venues: 0, teams: 0, bookings: 0 };
            countMap[d][key] = (countMap[d][key] || 0) + 1;
          });
        };

        addDate(allUsers.data?.data, "createdAt", "users");
        addDate(allVenues.data?.data, "createdAt", "venues");
        addDate(allTeams.data?.data, "createdAt", "teams");
        addDate(allBookings.data?.data, "date", "bookings");

        const sorted = Array.from(allDates).sort();
        let cumUsers = 0, cumVenues = 0, cumTeams = 0, cumBookings = 0;
        const chartData = sorted.map((date) => {
          cumUsers += countMap[date]?.users || 0;
          cumVenues += countMap[date]?.venues || 0;
          cumTeams += countMap[date]?.teams || 0;
          cumBookings += countMap[date]?.bookings || 0;
          return { date, users: cumUsers, venues: cumVenues, teams: cumTeams, bookings: cumBookings };
        });
        setTrend(chartData);
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
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Platform Growth</h3>
        </div>
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Users" dot={false} />
              <Line type="monotone" dataKey="venues" stroke="#10b981" strokeWidth={2} name="Venues" dot={false} />
              <Line type="monotone" dataKey="teams" stroke="#f59e0b" strokeWidth={2} name="Teams" dot={false} />
              <Line type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2} name="Bookings" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-10 text-center text-sm text-gray-400">No data available yet</p>
        )}
      </div>
    </div>
  );
}
