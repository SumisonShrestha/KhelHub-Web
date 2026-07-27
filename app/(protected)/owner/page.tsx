"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, Edit, Trash2, Loader2, AlertCircle, Calendar, MapPin, Trophy, ShieldCheck, User, TrendingUp } from "lucide-react";
import DeleteVenueModal from "./_components/DeleteVenueModal";
import axiosInstance from "@/lib/api/axios-instance";
import { API } from "@/lib/api/endpoints";
import { getToken } from "@/lib/actions/auth-action";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Venue {
  _id: string;
  name: string;
  category: string;
  sport: string;
  city: string;
  location: string;
  image: string;
  pricePerHour: number;
  status?: string;
  createdAt: string;
}

interface OwnerBooking {
  _id: string;
  venueName: string;
  sport: string;
  city: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: string;
  fullName: string;
  phone: string;
  createdAt: string;
}

export default function OwnerDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "dashboard";
  const [tab, setTab] = useState<string>(tabFromUrl);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ venues: 0, bookings: 0 });
  const [trend, setTrend] = useState<{ date: string; venues: number; bookings: number }[]>([]);
  const [user, setUser] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<Venue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUser = async () => {
    try {
      const token = await getToken();
      if (!token) { router.replace("/login"); return; }
      const res = await axiosInstance.get("/api/v1/auth/whoami", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data?.data || res.data?.user || res.data);
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const [vRes, bRes] = await Promise.all([
        axiosInstance.get(API.VENUES.MY_VENUES, { headers: { Authorization: `Bearer ${token}` } }),
        axiosInstance.get(API.BOOKINGS.OWNER, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const venuesList: any[] = vRes.data.data ?? [];
      const bookingsList: any[] = bRes.data.data ?? [];
      setStats({
        venues: venuesList.length,
        bookings: bookingsList.length,
      });

      const allDates = new Set<string>();
      const countMap: Record<string, { venues: number; bookings: number }> = {};

      venuesList.forEach((v: any) => {
        const d = (v.createdAt || "").split("T")[0];
        if (!d) return;
        allDates.add(d);
        if (!countMap[d]) countMap[d] = { venues: 0, bookings: 0 };
        countMap[d].venues++;
      });
      bookingsList.forEach((b: any) => {
        const d = (b.date || b.createdAt || "").split("T")[0];
        if (!d) return;
        allDates.add(d);
        if (!countMap[d]) countMap[d] = { venues: 0, bookings: 0 };
        countMap[d].bookings++;
      });

      const sorted = Array.from(allDates).sort();
      let cumVenues = 0, cumBookings = 0;
      setTrend(sorted.map((date) => {
        cumVenues += countMap[date]?.venues || 0;
        cumBookings += countMap[date]?.bookings || 0;
        return { date, venues: cumVenues, bookings: cumBookings };
      }));
    } catch {}
  };

  const fetchVenues = async () => {
    try {
      const token = await getToken();
      if (!token) { router.replace("/login"); return; }
      const res = await axiosInstance.get(API.VENUES.MY_VENUES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVenues(res.data.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await axiosInstance.get(API.BOOKINGS.OWNER, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  useEffect(() => {
    fetchUser();
    fetchStats();
    if (tab === "venues") { setLoading(true); setError(null); fetchVenues(); }
    else if (tab === "bookings") { setLoading(true); setError(null); fetchBookings(); }
    else setLoading(false);
  }, [tab]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const token = await getToken();
      if (!token) return;
      await axiosInstance.delete(API.VENUES.BY_ID(deleteTarget._id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVenues((prev) => prev.filter((v) => v._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to delete venue");
    } finally {
      setIsDeleting(false);
    }
  };

  const cards = [
    { label: "My Venues", value: stats.venues, icon: Building2, href: "/owner?tab=venues", color: "bg-green-500" },
    { label: "Bookings", value: stats.bookings, icon: Calendar, href: "/owner?tab=bookings", color: "bg-purple-500" },
  ];

  const renderDashboard = () => (
    <>
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
          <h3 className="text-lg font-bold text-gray-900">Your Growth</h3>
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
              <Line type="monotone" dataKey="venues" stroke="#10b981" strokeWidth={2} name="Venues" dot={false} />
              <Line type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2} name="Bookings" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-10 text-center text-sm text-gray-400">No data available yet</p>
        )}
      </div>
    </>
  );

  const emptyState = () => {
    if (tab === "venues") {
      return (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Building2 className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-800">No Venues Listed</h3>
          <p className="mt-1 text-sm text-gray-500">You haven&apos;t listed any venues yet.</p>
          <Link
            href="/users/venues/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#121A2A] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg"
          >
            List a Venue
          </Link>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <Calendar className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-semibold text-gray-800">No Bookings Yet</h3>
        <p className="mt-1 text-sm text-gray-500">When users book your venues, their bookings will appear here.</p>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {tab === "venues" ? "My Venues" : tab === "bookings" ? "Booking Requests" : "Owner Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {tab === "venues" ? "Manage and edit your listed venues" : tab === "bookings" ? "View booking requests for your venues" : "Manage your venues and bookings"}
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : tab === "dashboard" ? (
        renderDashboard()
      ) : tab === "venues" ? (
        venues.length === 0 ? emptyState() : (
          <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">{venues.length} venue{venues.length > 1 ? "s" : ""} listed</p>
            <Link href="/users/venues/create" className="inline-flex items-center gap-1.5 rounded-xl bg-[#121A2A] px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:shadow-lg">Add Venue</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <div key={venue._id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  {venue.image ? (
                    <img src={venue.image} alt={venue.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <Building2 size={48} />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8">
                    <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
                      {venue.sport}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{venue.name}</h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-1.5"><MapPin size={15} className="text-gray-400" />{venue.city}</p>
                    <p className="flex items-center gap-1.5"><Calendar size={15} className="text-gray-400" />Listed {new Date(venue.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">Rs {venue.pricePerHour.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">/hour</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/users/venues/create?edit=${venue._id}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><Edit size={15} />Edit</Link>
                    <button onClick={() => setDeleteTarget(venue)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"><Trash2 size={15} />Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )
      ) : (
        bookings.length === 0 ? emptyState() : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 font-semibold text-gray-700">Venue</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Time</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Duration</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Booked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{b.venueName}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-600">{b.timeSlot}</td>
                      <td className="px-4 py-3 text-gray-600">{b.duration} hr{b.duration > 1 ? "s" : ""}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">Rs {b.totalPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{b.phone}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {deleteTarget && (
        <DeleteVenueModal
          venueName={deleteTarget.name}
          venueCity={deleteTarget.city}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onClose={() => { if (!isDeleting) setDeleteTarget(null); }}
        />
      )}
    </div>
  );
}
