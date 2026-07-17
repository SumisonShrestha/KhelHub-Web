"use client";

import Link from "next/link";
import { MapPin, Star, CheckCircle } from "lucide-react";
import type { Venue } from "@/lib/api/venue";

interface Props {
  venue: Venue;
  onSelect: (venue: Venue) => void;
  isSelected: boolean;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800";

export default function VenueCard({ venue, onSelect, isSelected }: Props) {
  const availability = Math.min(Math.round((venue.rating / 5) * 90 + 10), 100);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(venue)}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(venue); }}
      className={`group w-full cursor-pointer overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      }`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={venue.image || FALLBACK_IMAGE}
          alt={venue.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        <div className="absolute right-3 top-3 rounded-full bg-[#121A2A] px-3 py-1.5 text-sm font-bold text-white shadow-lg">
          Rs. {venue.pricePerHour}/hr
        </div>
        {isSelected && (
          <div className="absolute left-3 top-3 rounded-full bg-blue-600 p-1.5 text-white shadow-lg">
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{venue.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5" /> {venue.location}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{venue.rating}</span>
          <span className="text-gray-500">({venue.reviews})</span>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Availability</span>
            <span className="font-semibold text-blue-600">{availability}% left</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-[#121A2A]"
              style={{ width: `${availability}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {venue.sport}
          </span>
          {isSelected ? (
            <span className="text-sm font-semibold text-blue-600">Selected</span>
          ) : (
            <Link
              href={`/booking?venueId=${venue._id}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-xl bg-[#121A2A] px-4 py-2 text-sm font-semibold text-white shadow transition hover:shadow-lg"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
