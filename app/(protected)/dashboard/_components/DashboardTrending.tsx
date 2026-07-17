"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Star, Flame } from "lucide-react";
import { getVenues, type Venue } from "@/lib/api/venue";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800";

export default function DashboardTrending() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVenues({ sort: "rating" })
      .then((data) => setVenues(data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Sport Hubs</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="h-40 w-full bg-gray-200" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="flex gap-2">
                  <div className="h-5 w-14 rounded bg-gray-200" />
                  <div className="h-5 w-14 rounded bg-gray-200" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="h-7 w-16 rounded bg-gray-200" />
                  <div className="h-9 w-20 rounded-lg bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (venues.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Sport Hubs</h2>
        </div>
        <Link href="/venues" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          View All →
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {venues.map((venue) => (
          <div
            key={venue._id}
            className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={venue.image || FALLBACK_IMAGE}
                alt={venue.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {venue.rating}
              </div>
              <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-blue-700 backdrop-blur-sm">
                {venue.sport}
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900">{venue.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                {venue.location}
              </p>
              <p className="mt-2 line-clamp-2 text-xs text-gray-600">{venue.description}</p>

              <div className="mt-2 flex flex-wrap gap-1">
                {venue.amenities.slice(0, 3).map((item) => (
                  <span key={item} className="rounded-md border bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-600">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <div>
                  <span className="text-lg font-bold text-blue-600">Rs {venue.pricePerHour}</span>
                  <span className="text-[10px] text-gray-500">/hr</span>
                </div>
                <Link
                  href={"/venues?venueId=" + venue._id}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
