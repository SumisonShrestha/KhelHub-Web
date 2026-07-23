"use client";

import { MapPin, Star, X, Calendar, Clock, Building2 } from "lucide-react";
import Link from "next/link";
import type { Venue } from "@/lib/api/venue";

interface Props {
  venue: Venue;
  onClose: () => void;
  onRateClick?: (venue: Venue) => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800";

export default function VenueTopBar({ venue, onClose, onRateClick }: Props) {
  const listedDate = venue.createdAt
    ? new Date(venue.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#121A2A] text-white shadow-lg">
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row">
        <div className="h-48 w-full shrink-0 overflow-hidden rounded-2xl shadow-lg md:h-56 md:w-72">
          <img
            src={venue.image || FALLBACK_IMAGE}
            alt={venue.name}
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">{venue.name}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-blue-100">
                  <MapPin className="h-4 w-4" /> {venue.location}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-white/20 p-2 transition hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                {venue.rating} ({venue.reviews} reviews)
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm">{venue.category || venue.sport}</span>
              <span className="text-2xl font-bold">Rs {venue.pricePerHour.toLocaleString()}<span className="text-sm font-normal text-blue-100">/hr</span></span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-blue-100">{venue.description}</p>

            {venue.amenities.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {venue.amenities.map((item) => (
                  <span key={item} className="rounded-md bg-white/15 px-2 py-1 text-xs backdrop-blur">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href={`/booking?venueId=${venue._id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105 hover:shadow-lg"
            >
              <Calendar className="h-4 w-4" />
              Book This Venue
            </Link>
            {onRateClick && (
              <button
                onClick={() => onRateClick(venue)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <Star className="h-4 w-4" />
                Rate This Venue
              </button>
            )}
            <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs text-blue-100">
              <Building2 className="h-3.5 w-3.5" /> {venue.city}
            </span>
            {listedDate && (
              <span className="flex items-center gap-1 text-xs text-blue-200/70">
                <Clock className="h-3 w-3" /> Listed {listedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
