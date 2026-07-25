"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, X, Eye, Trash2, Loader2, Calendar, MapPin, Clock, DollarSign, User, Building2, AlertCircle } from "lucide-react";
import {
    handleAdminGetBookings,
    handleAdminGetBooking,
    handleAdminDeleteBooking,
} from "@/lib/actions/admin-action";
import Pagination from "../../users/_components/Pagination";
import { PaginationMeta } from "@/lib/api/admin";

interface Booking {
    _id: string;
    userId: { _id: string; firstName?: string; lastName?: string; email?: string } | string;
    venueId: string;
    venueName: string;
    sport: string;
    city: string;
    date: string;
    timeSlot: string;
    duration: number;
    totalPrice: number;
    status: "upcoming" | "cancelled" | "completed";
    createdAt: string;
}

const DEFAULT_META: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 0 };

export default function AdminBookingsClient() {
    const [bookings, setBookings]     = useState<Booking[]>([]);
    const [meta, setMeta]             = useState<PaginationMeta>(DEFAULT_META);
    const [search, setSearch]         = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage]             = useState(1);
    const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);
    const [isLoading, setIsLoading]   = useState(true);
    const [error, setError]           = useState<string | null>(null);
    const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const result = await handleAdminGetBookings({ page, limit: 10, search: debouncedSearch || undefined });
        if (result.success) {
            setBookings(result.data ?? []);
            setMeta(result.meta ?? DEFAULT_META);
        } else {
            setError(result.message ?? "Failed to fetch bookings");
        }
        setIsLoading(false);
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const openDetail = async (booking: Booking) => {
        setLoadingDetail(true);
        setDetailBooking(booking);
        if (typeof booking.userId === "string") {
            const result = await handleAdminGetBooking(booking._id);
            if (result.success && result.data) {
                setDetailBooking(result.data);
            }
        }
        setLoadingDetail(false);
    };

    const handleCancel = async () => {
        if (!cancelTarget) return;
        setIsCancelling(true);
        const result = await handleAdminDeleteBooking(cancelTarget._id);
        if (result.success) {
            showToast("Booking cancelled successfully", true);
            setCancelTarget(null);
            fetchBookings();
        } else {
            showToast(result.message ?? "Failed to cancel booking", false);
            setCancelTarget(null);
        }
        setIsCancelling(false);
    };

    const formatDate = (d: string) => {
        const date = new Date(d);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            upcoming: "bg-blue-100 text-blue-700",
            cancelled: "bg-red-100 text-red-700",
            completed: "bg-green-100 text-green-700",
        };
        return (
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getUserName = (b: Booking): string => {
        if (typeof b.userId === "object" && b.userId?.firstName) {
            return `${b.userId.firstName} ${b.userId.lastName || ""}`.trim();
        }
        return typeof b.userId === "object" ? (b.userId as any).email || "—" : "—";
    };

    return (
        <div className="p-6">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg text-white ${toast.ok ? "bg-green-600" : "bg-red-600"}`}>
                    {toast.msg}
                </div>
            )}

            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
                        <p className="text-sm text-gray-500">View and manage all platform bookings</p>
                    </div>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by venue or sport..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="py-20 text-center text-gray-400">
                            <Calendar className="mx-auto mb-2 h-12 w-12" />
                            <p className="text-sm font-medium">No bookings found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="px-4 py-3 font-medium text-gray-500">User</th>
                                        <th className="px-4 py-3 font-medium text-gray-500">Venue</th>
                                        <th className="px-4 py-3 font-medium text-gray-500">Sport</th>
                                        <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                                        <th className="px-4 py-3 font-medium text-gray-500">Time</th>
                                        <th className="px-4 py-3 font-medium text-gray-500">Amount</th>
                                        <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                                        <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {bookings.map((b) => (
                                        <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-gray-400 shrink-0" />
                                                    <span className="text-gray-900 truncate max-w-[140px]">{getUserName(b)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={14} className="text-gray-400 shrink-0" />
                                                    <span className="text-gray-900 truncate max-w-[160px]">{b.venueName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{b.sport}</td>
                                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatDate(b.date)}</td>
                                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{b.timeSlot}</td>
                                            <td className="px-4 py-3 text-gray-900 font-medium">${b.totalPrice.toFixed(2)}</td>
                                            <td className="px-4 py-3">{statusBadge(b.status)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openDetail(b)}
                                                        className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {b.status === "upcoming" && (
                                                        <button
                                                            onClick={() => setCancelTarget(b)}
                                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            title="Cancel booking"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {meta.totalPages > 1 && !isLoading && (
                    <div className="mt-4">
                        <Pagination meta={meta} onPageChange={setPage} label="bookings" />
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {detailBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Booking Details</h2>
                            <button onClick={() => setDetailBooking(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            {loadingDetail ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <DetailField icon={User} label="User" value={getUserName(detailBooking)} />
                                        <DetailField icon={Building2} label="Venue" value={detailBooking.venueName} />
                                        <DetailField label="Sport" value={detailBooking.sport} />
                                        <DetailField icon={MapPin} label="City" value={detailBooking.city} />
                                        <DetailField icon={Calendar} label="Date" value={formatDate(detailBooking.date)} />
                                        <DetailField icon={Clock} label="Time Slot" value={detailBooking.timeSlot} />
                                        <DetailField label="Duration" value={`${detailBooking.duration} min`} />
                                        <DetailField icon={DollarSign} label="Total Price" value={`$${detailBooking.totalPrice.toFixed(2)}`} />
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">Status:</span>
                                        {statusBadge(detailBooking.status)}
                                    </div>
                                    <p className="text-xs text-gray-400">Booking ID: {detailBooking._id}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
                            <button
                                onClick={() => setDetailBooking(null)}
                                className="rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirm Modal */}
            {cancelTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                                    <AlertCircle size={16} className="text-red-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Cancel Booking</h2>
                            </div>
                            <button onClick={() => setCancelTarget(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-sm text-gray-600">
                                You&apos;re about to cancel <span className="font-semibold text-gray-900">{cancelTarget.venueName}</span> booking on{" "}
                                <span className="font-semibold text-gray-900">{formatDate(cancelTarget.date)}</span> at{" "}
                                <span className="font-semibold text-gray-900">{cancelTarget.timeSlot}</span>. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                            <button
                                onClick={() => setCancelTarget(null)}
                                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isCancelling}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
                            >
                                {isCancelling && <Loader2 size={14} className="animate-spin" />}
                                Cancel Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailField({ icon: Icon, label, value }: { icon?: any; label: string; value: string }) {
    return (
        <div className="rounded-lg bg-gray-50 p-3">
            <p className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                {Icon && <Icon size={12} />}
                {label}
            </p>
            <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
        </div>
    );
}
