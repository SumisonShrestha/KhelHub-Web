"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { getVenues, type Venue } from "@/lib/api/venue";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800";

export default function FeaturedVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    getVenues().then(setVenues).catch(() => {});
  }, []);

  const featured = venues.filter((v) => v.featured).slice(0, 3);
  const display = featured.length > 0 ? featured : venues.slice(0, 3);

  if (display.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Featured Venues</h2>
          <p className="mt-2 text-gray-500">Top sporthub near you</p>
        </div>
        <Link href="/venues" className="font-semibold text-blue-600 transition hover:text-blue-700">
          View All →
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {display.map((venue) => (
          <div key={venue._id} className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-xl">
            <img
              src={venue.image || FALLBACK_IMAGE}
              alt={venue.name}
              className="h-56 w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
            />
            <div className="p-5">
              <div className="flex items-center gap-1 text-sm text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-gray-900">{venue.rating}</span>
                <span className="text-gray-400">({venue.reviews})</span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-gray-900">{venue.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" /> {venue.location}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">Rs {venue.pricePerHour}/hr</span>
                <Link
                  href={`/booking?venueId=${venue._id}`}
                  className="rounded-lg bg-[#121A2A] px-4 py-2 text-sm font-semibold text-white shadow transition hover:shadow-lg"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
