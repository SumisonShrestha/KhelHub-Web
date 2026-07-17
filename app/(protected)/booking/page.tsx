"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Star, ArrowLeft, Check, Calendar, MapPinned, X, Wallet, Banknote, Smartphone } from "lucide-react";
import { getVenueById, type Venue } from "@/lib/api/venue";
import { handleCreateBooking, handleGetMyBookings, handleCancelBooking } from "@/lib/actions/booking-action";

const TIME_SLOTS = [
  "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00",
  "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00",
  "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
  "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00",
];

const DURATIONS = [1, 2, 3];

export default function BookingPage() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get("venueId");
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loadingVenue, setLoadingVenue] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const loadBookings = useCallback(async () => {
    setLoadingBookings(true);
    const result = await handleGetMyBookings();
    if (result.success) setBookings(result.data);
    setLoadingBookings(false);
  }, []);

  useEffect(() => {
    if (venueId) {
      setLoadingVenue(true);
      getVenueById(venueId)
        .then((v) => setVenue(v))
        .catch(() => setVenue(null))
        .finally(() => setLoadingVenue(false));
    } else {
      loadBookings();
    }
  }, [venueId, loadBookings]);

  const router = useRouter();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [duration, setDuration] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "fonepay" | null>(null);
  const DISCOUNT = 50;

  const openConfirmModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue || !date || !timeSlot) return;
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (!venue || !fullName.trim() || !phone.trim() || !paymentMethod || !date || !timeSlot) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await handleCreateBooking({
        venueId: venue._id,
        venueName: venue.name,
        sport: venue.sport,
        city: venue.city,
        date,
        timeSlot,
        duration,
        totalPrice: venue.pricePerHour * duration,
      });
      if (!result.success) throw new Error(result.message);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    setCancelling(id);
    await handleCancelBooking(id);
    loadBookings();
    setCancelling(null);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "upcoming": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (!venueId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative overflow-hidden bg-[#121A2A] px-4 py-10 text-white">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <h1 className="text-3xl font-bold md:text-4xl">My Bookings</h1>
            <p className="mt-2 text-blue-100">All your venue bookings in one place</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
          {loadingBookings ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex animate-pulse items-center rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="h-14 w-14 rounded-xl bg-gray-200" />
                  <div className="ml-4 flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-gray-200" />
                    <div className="h-3 w-24 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b._id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#121A2A] text-white">
                      <MapPinned className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{b.venueName}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {b.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {b.timeSlot}
                        </span>
                        <span className="font-medium text-gray-700">Rs {b.totalPrice?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                    {b.status === "upcoming" && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        disabled={cancelling === b._id}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {cancelling === b._id ? "..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {!loadingBookings && bookings.length === 0 && (
                <div className="rounded-2xl border bg-white py-16 text-center shadow-sm">
                  <CalendarDays className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-800">No Bookings Yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Book a venue to see it here.</p>
                  <Link
                    href="/venues"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#121A2A] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg"
                  >
                    Browse Venues
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          {loadingVenue ? (
            <>
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">Loading Venue...</h2>
            </>
          ) : (
            <>
              <CalendarDays className="mx-auto h-12 w-12 text-gray-300" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">No Venue Selected</h2>
              <p className="mt-2 text-gray-500">Select a venue first to make a booking.</p>
              <Link
                href="/venues"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#121A2A] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4" />
                Browse Venues
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Check className="h-7 w-7 text-green-600" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
          <p className="mt-2 text-gray-500">
            {venue.name} — {date} at {timeSlot} ({duration} hr{duration > 1 ? "s" : ""})
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900">
            Rs {(venue.pricePerHour * duration).toLocaleString()}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/venues"
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Book Again
            </Link>
            <Link
              href="/booking"
              className="rounded-xl bg-[#121A2A] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const formatDate = (d: string) => {
    const dt = new Date(d + "T12:00:00");
    return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + "th";
  };

  const totalPrice = venue ? venue.pricePerHour * duration : 0;
  const discountTotal = Math.max(totalPrice - DISCOUNT, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <Link
          href="/venues"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Venues
        </Link>

        <div className="overflow-hidden rounded-3xl bg-[#121A2A] text-white shadow-lg">
          <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-lg md:h-24 md:w-24">
              <img
                src={venue.image}
                alt={venue.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold md:text-3xl">{venue.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-blue-100">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {venue.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                  {venue.rating}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-0.5">{venue.sport}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">Rs {venue.pricePerHour.toLocaleString()}</p>
              <p className="text-sm text-blue-100">per hour</p>
            </div>
          </div>
        </div>

        <form onSubmit={openConfirmModal} className="mt-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Date & Time
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    required
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                          timeSlot === slot
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Duration
                </h2>

                <div className="flex gap-3">
                  {DURATIONS.map((hr) => (
                    <button
                      key={hr}
                      type="button"
                      onClick={() => setDuration(hr)}
                      className={`flex-1 rounded-xl border py-3 text-center font-medium transition ${
                        duration === hr
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      {hr} hr{hr > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Booking Summary</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price per hour</span>
                    <span className="font-medium">Rs {venue.pricePerHour.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium">{duration} hr{duration > 1 ? "s" : ""}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>Rs {(venue.pricePerHour * duration).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !date || !timeSlot}
                  className="mt-6 w-full rounded-xl bg-[#121A2A] py-3 font-semibold text-white shadow transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>

                {error && (
                  <p className="mt-3 text-sm text-red-600">{error}</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Confirm Booking</h2>
              <button onClick={() => { setShowConfirmModal(false); setError(null); }} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <MapPinned className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Venue</p>
                  <p className="font-semibold text-gray-900">{venue.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-semibold text-gray-900">{timeSlot}</p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-semibold text-gray-900">Rs {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount (incl. Rs{DISCOUNT} off)</span>
                    <span className="font-semibold text-red-500">-Rs {DISCOUNT}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-700">Rs {discountTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtpInput(true)}
                      disabled={phone.length < 10}
                      className="shrink-0 rounded-xl bg-[#121A2A] px-4 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50"
                    >
                      Send OTP
                    </button>
                  </div>
                  {showOtpInput && (
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      maxLength={6}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Payment Method</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                      paymentMethod === "cash" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      paymentMethod === "cash" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      <Banknote className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Cash After Game</p>
                      <p className="text-xs text-gray-500">Pay in cash after your game</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("fonepay")}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left opacity-50 transition ${
                      paymentMethod === "fonepay" ? "border-blue-600 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      paymentMethod === "fonepay" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">FonePay Online</p>
                      <p className="text-xs text-gray-500">Pay using FonePay wallet</p>
                    </div>
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">Soon</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => { setShowConfirmModal(false); setError(null); }}
                className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting || !fullName.trim() || !phone.trim() || !paymentMethod}
                className="flex-1 rounded-xl bg-[#121A2A] py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? "Booking..." : `Confirm • Rs ${discountTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
