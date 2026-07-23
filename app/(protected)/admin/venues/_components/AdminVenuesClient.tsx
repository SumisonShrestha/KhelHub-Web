"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Building2, RefreshCw, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Venue } from "@/lib/api/venue";
import { PaginationMeta } from "@/lib/api/admin";
import {
    handleAdminGetVenues,
    handleAdminDeleteVenue,
} from "@/lib/actions/admin-action";

const DEFAULT_META: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 0 };

export default function AdminVenuesClient() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const fetchVenues = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const result = await handleAdminGetVenues({ page, limit: 10, search: debouncedSearch || undefined });
        if (result.success) {
            setVenues(result.data ?? []);
            setMeta(result.meta ?? DEFAULT_META);
        } else {
            setError(result.message ?? "Failed to fetch venues");
        }
        setIsLoading(false);
    }, [page, debouncedSearch]);

    useEffect(() => { fetchVenues(); }, [fetchVenues]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this venue?")) return;
        const result = await handleAdminDeleteVenue(id);
        if (result.success) {
            if (venues.length === 1 && page > 1) setPage(page - 1);
            else fetchVenues();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600">
                        <Building2 size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Venue Management</h1>
                        <p className="text-sm text-gray-500">Manage all venues — edit and remove listings.</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-white shadow-sm border border-gray-100">
                    <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name, city, or sport…"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <button
                            onClick={fetchVenues}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Loader2 size={32} className="animate-spin mb-3" />
                                <p className="text-sm">Loading venues…</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 text-red-500">
                                <AlertCircle size={32} className="mb-3" />
                                <p className="text-sm font-medium">{error}</p>
                                <button onClick={fetchVenues} className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors">Try again</button>
                            </div>
                        ) : venues.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Building2 size={40} className="mb-3 opacity-30" />
                                <p className="text-sm font-medium text-gray-500">
                                    {debouncedSearch ? `No venues match "${debouncedSearch}"` : "No venues yet"}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">City</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Sport</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Price/hr</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {venues.map(venue => (
                                        <tr key={venue._id} className="group hover:bg-green-50/30 transition-colors">
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {venue.image && (
                                                        <img src={venue.image} alt={venue.name} className="h-10 w-10 rounded-lg object-cover" />
                                                    )}
                                                    <span className="text-sm font-medium text-gray-900">{venue.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-sm text-gray-600">{venue.city}</td>
                                            <td className="px-4 py-3.5 text-sm text-gray-600">{venue.sport}</td>
                                            <td className="px-4 py-3.5 text-sm text-gray-600">Rs.{venue.pricePerHour}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors" title="Edit venue">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(venue._id)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                                                        title="Delete venue"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {!isLoading && !error && meta.totalPages > 1 && (
                        <div className="border-t border-gray-100 p-4 flex items-center justify-center gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-500">Page {meta.page} of {meta.totalPages}</span>
                            <button
                                disabled={page >= meta.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
