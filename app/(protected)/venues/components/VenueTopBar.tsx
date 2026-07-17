"use client";

import { MapPin, Star, X, Calendar } from "lucide-react";
import Link from "next/link";
import type { Venue } from "@/lib/api/venue";

interface Props {
  venue: Venue;
  onClose: () => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800";

export default function VenueTopBar({ venue, onClose }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#121A2A] text-white shadow-lg">
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl shadow-lg md:h-32 md:w-32">
          <img
            src={venue.image || FALLBACK_IMAGE}
            alt={venue.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        </div>

        <div className="flex-1">
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
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm">{venue.sport}</span>
            <span className="text-2xl font-bold">Rs {venue.pricePerHour.toLocaleString()}<span className="text-sm font-normal text-blue-100">/hr</span></span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-blue-100">{venue.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {venue.amenities.map((item) => (
              <span key={item} className="rounded-md bg-white/15 px-2 py-1 text-xs backdrop-blur">
                {item}
              </span>
            ))}
          </div>

          <Link
            href={`/booking?venueId=${venue._id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105 hover:shadow-lg"
          >
            <Calendar className="h-4 w-4" />
            Book This Venue
          </Link>
        </div>
      </div>
    </div>
  );
}
