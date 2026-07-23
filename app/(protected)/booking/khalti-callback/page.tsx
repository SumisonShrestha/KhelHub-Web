"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { handleCreateBooking } from "@/lib/actions/booking-action";
import axiosInstance from "@/lib/api/axios-instance";
import { API } from "@/lib/api/endpoints";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const txnStatus = searchParams.get("status");

    if (!pidx || txnStatus !== "Completed") {
      setStatus("failed");
      setMessage(txnStatus === "User canceled" ? "Payment was cancelled." : "Payment was not completed.");
      return;
    }

    const completeBooking = async () => {
      try {
        // Verify payment with Khalti
        const lookupRes = await axiosInstance.post(API.PAYMENTS.KHALTI_LOOKUP, { pidx });
        if (lookupRes.data.data.status !== "Completed") {
          setStatus("failed");
          setMessage("Payment verification failed.");
          return;
        }

        // Get stored booking data
        const stored = sessionStorage.getItem("khalti_booking");
        if (!stored) {
          setStatus("failed");
          setMessage("Booking session expired. Please try again.");
          return;
        }

        const bookingData = JSON.parse(stored);
        const result = await handleCreateBooking({
          ...bookingData,
          paymentMethod: "khalti",
          paymentId: pidx,
        });

        if (result.success) {
          setStatus("success");
          setMessage("Booking confirmed! Your payment was successful.");
          sessionStorage.removeItem("khalti_booking");
        } else {
          setStatus("failed");
          setMessage(result.message || "Payment succeeded but booking failed. Contact support.");
        }
      } catch {
        setStatus("failed");
        setMessage("Something went wrong. Please contact support.");
      }
    };

    completeBooking();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        {status === "verifying" && (
          <>
            <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Verifying Payment</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <Link
              href="/booking"
              className="mt-6 inline-block rounded-lg bg-[#121A2A] px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg"
            >
              View My Bookings
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Payment Failed</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <button
              onClick={() => router.push("/booking")}
              className="mt-6 inline-block rounded-lg bg-[#121A2A] px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function KhaltiCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
