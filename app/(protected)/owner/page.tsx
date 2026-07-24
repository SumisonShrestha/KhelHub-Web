"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Building2, Edit, Trash2, Loader2, AlertCircle, Calendar, MapPin, LogOut } from "lucide-react";
import axiosInstance from "@/lib/api/axios-instance";
import { API } from "@/lib/api/endpoints";
import { handleLogout, getToken } from "@/lib/actions/auth-action";

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

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchVenues = async () => {
    try {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
        return;
      }
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

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const token = await getToken();
      if (!token) return;
      await axiosInstance.delete(API.VENUES.BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVenues((prev) => prev.filter((v) => v._id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to delete venue");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#121A2A] px-4 py-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">Owner Dashboard</h1>
            <p className="mt-1 text-sm text-blue-100">Manage your venues</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/venues/create"
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#121A2A] transition hover:bg-blue-50"
            >
              <Plus size={16} />
              List New Venue
            </Link>
            <button
              onClick={async () => {
                setLoggingOut(true);
                await handleLogout();
                router.replace("/login");
              }}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-lg border border-red-400/40 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <LogOut size={14} />
              {loggingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
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
        ) : venues.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">No Venues Listed</h3>
            <p className="mt-1 text-sm text-gray-500">You haven&apos;t listed any venues yet.</p>
            <Link
              href="/venues/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#121A2A] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg"
            >
              <Plus size={16} />
              List Your First Venue
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <div key={venue._id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  {venue.image ? (
                    <img src={venue.image} alt={venue.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <Building2 size={40} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{venue.name}</h3>
                    <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {venue.sport}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p className="flex items-center gap-1">
                      <MapPin size={14} />
                      {venue.city}
                    </p>
                    <p className="flex items-center gap-1">
                      <Calendar size={14} />
                      Listed {new Date(venue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-2 text-lg font-bold text-gray-900">Rs {venue.pricePerHour.toLocaleString()}/hr</p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/venues/${venue._id}`}
                      className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                      View
                    </Link>
                    <Link
                      href={`/venues/create?edit=${venue._id}`}
                      className="flex items-center justify-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      <Edit size={14} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(venue._id, venue.name)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
