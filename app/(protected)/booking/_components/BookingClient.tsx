"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, X, CheckCircle2 } from "lucide-react";
import type { Venue } from "@/lib/mock/venues";
import {
    addBooking,
    cancelBooking,
    getBookings,
    isSlotTaken,
    type Booking,
} from "@/lib/mock/bookings";

const TIME_SLOTS = [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "8:00 AM - 9:00 AM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
];

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

export default function BookingClient({
    venue,
    venues,
}: {
    venue?: Venue;
    venues: Venue[];
}) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [date, setDate] = useState(todayISO());
    const [slot, setSlot] = useState<string | null>(null);
    const [duration, setDuration] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        setBookings(getBookings());
    }, []);

    const total = venue ? venue.pricePerHour * duration : 0;

    const handleConfirm = () => {
        if (!venue || !slot) return;
        setIsBooking(true);

        const booking: Booking = {
            id: `bk_${Date.now()}`,
            venueId: venue.id,
            venueName: venue.name,
            sport: venue.sport,
            city: venue.city,
            date,
            timeSlot: slot,
            duration,
            totalPrice: total,
            status: "upcoming",
            createdAt: new Date().toISOString(),
        };

        const updated = addBooking(booking);
        setBookings(updated);
        setSuccess(`Booked ${venue.name} on ${date} at ${slot}`);
        setSlot(null);
        setIsBooking(false);
    };

    const handleCancel = (id: string) => {
        setBookings(cancelBooking(id));
    };

    const upcoming = useMemo(
        () => bookings.filter((b: Booking) => b.status === "upcoming"),
        [bookings]
    );
    const past = useMemo(
        () => bookings.filter((b: Booking) => b.status !== "upcoming"),
        [bookings]
    );

    return (
        <div className="space-y-8">

            {success && (
                <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-5 py-4">
                    <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">{success}</span>
                    </div>
                    <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* BOOKING FLOW */}
            {venue ? (
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* VENUE SUMMARY */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-1 h-fit">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl">
                            {venue.emoji}
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-gray-900">
                            {venue.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {venue.location}
                        </p>
                        <span className="mt-3 inline-block w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            {venue.sport}
                        </span>
                        <p className="mt-3 text-sm text-gray-600">
                            {venue.description}
                        </p>
                        <div className="mt-4 border-t pt-4">
                            <span className="text-xl font-bold text-gray-900">
                                Rs {venue.pricePerHour.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">/hr</span>
                        </div>
                        <Link
                            href="/explore"
                            className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            ← Choose a different venue
                        </Link>
                    </div>

                    {/* SLOT PICKER */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">

                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Calendar className="h-4 w-4" /> Select Date
                        </label>
                        <input
                            type="date"
                            min={todayISO()}
                            value={date}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setDate(e.target.value);
                                setSlot(null);
                            }}
                            className="h-11 w-full max-w-xs rounded-lg border border-gray-200 px-3 text-black outline-none focus:border-blue-500 sm:w-auto"
                        />

                        <label className="mb-2 mt-6 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Clock className="h-4 w-4" /> Select Time Slot
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {TIME_SLOTS.map((t) => {
                                const taken = isSlotTaken(venue.id, date, t);
                                const isSelected = slot === t;
                                return (
                                    <button
                                        key={t}
                                        disabled={taken}
                                        onClick={() => setSlot(t)}
                                        className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                                            taken
                                                ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 line-through"
                                                : isSelected
                                                ? "border-blue-600 bg-blue-600 text-white"
                                                : "border-gray-200 text-gray-700 hover:border-blue-400"
                                        }`}
                                    >
                                        {t}
                                    </button>
                                );
                            })}
                        </div>

                        <label className="mb-2 mt-6 block text-sm font-semibold text-gray-700">
                            Duration
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3].map((h) => (
                                <button
                                    key={h}
                                    onClick={() => setDuration(h)}
                                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                        duration === h
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "border-gray-200 text-gray-700 hover:border-blue-400"
                                    }`}
                                >
                                    {h} hr{h > 1 ? "s" : ""}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t pt-6">
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Rs {total.toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={handleConfirm}
                                disabled={!slot || isBooking}
                                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isBooking ? "Confirming..." : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900">
                        No venue selected
                    </h3>
                    <p className="mt-2 text-gray-500">
                        Browse venues in Explore and pick a time slot to make a booking.
                    </p>
                    <Link
                        href="/explore"
                        className="mt-5 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Explore Venues
                    </Link>
                </div>
            )}

            {/* MY BOOKINGS */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>

                {upcoming.length === 0 && past.length === 0 ? (
                    <p className="mt-3 text-gray-500">
                        You haven&apos;t made any bookings yet.
                    </p>
                ) : (
                    <div className="mt-4 space-y-3">
                        {[...upcoming, ...past].map((b) => (
                            <div
                                key={b.id}
                                className="flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-900">
                                            {b.venueName}
                                        </h4>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                b.status === "upcoming"
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {b.status}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {b.sport} · {b.city}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {b.date} · {b.timeSlot} · {b.duration}hr
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-gray-900">
                                        Rs {b.totalPrice.toLocaleString()}
                                    </span>
                                    {b.status === "upcoming" && (
                                        <button
                                            onClick={() => handleCancel(b.id)}
                                            className="text-sm font-semibold text-red-500 hover:text-red-600"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
