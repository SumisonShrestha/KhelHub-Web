"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Star, Trophy } from "lucide-react";
import { getVenues, type Venue } from "@/lib/api/venue";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800";

export default function FeaturedVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    getVenues({ sort: "rating" })
      .then((data) => {
        if (data.length > 0) {
          setVenues(data.slice(0, 3));
        } else {
          getVenues().then((all) => setVenues(all.slice(0, 3))).catch(() => {});
        }
      })
      .catch(() => {
        getVenues().then((all) => setVenues(all.slice(0, 3))).catch(() => {});
      });
  }, []);

  if (venues.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Venues</h2>
            <p className="mt-1 text-gray-500">Top rated futsal fields this month</p>
          </div>
          <Link href="/venues" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View All →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {venues.map((venue, idx) => (
            <Link
              key={venue._id}
              href="/venues"
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-bold shadow-md backdrop-blur">
                <Trophy className={`h-4 w-4 ${idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : "text-amber-600"}`} />
                <span>#{idx + 1}</span>
              </div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={venue.image || FALLBACK_IMAGE}
                  alt={venue.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                />
                <div className="absolute right-3 top-3 rounded-full bg-[#121A2A] px-3 py-1 text-sm font-semibold text-white">
                  Rs. {venue.pricePerHour}/hr
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{venue.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" /> {venue.location}
                </p>
                <div className="mt-3 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{venue.rating}</span>
                  <span className="text-sm text-gray-500">({venue.reviews} Reviews)</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-gray-200">
                  <div className="h-1.5 rounded-full bg-[#121A2A]" style={{ width: `${Math.min(venue.rating * 20, 100)}%` }} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{venue.sport}</span>
                  <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Book Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
