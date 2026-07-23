"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Star, X, Loader2, AlertCircle } from "lucide-react";
import { getVenues, type Venue } from "@/lib/api/venue";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800";

interface Props {
  query: string;
  onClear: () => void;
}

export default function SearchResults({ query, onClear }: Props) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    getVenues({ search: query })
      .then(setVenues)
      .catch(() => setError("Failed to search venues"))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Results for "{query}"
          </h2>
          <p className="mt-2 text-gray-500">
            {loading ? "Searching..." : `${venues.length} venue${venues.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/venues?search=${encodeURIComponent(query)}`} className="font-semibold text-blue-600 transition hover:text-blue-700">
            View All →
          </Link>
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={14} /> Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p className="text-sm">Searching venues…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-red-500">
          <AlertCircle size={32} className="mb-3" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : venues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg font-medium text-gray-500">No venues found for "{query}"</p>
          <p className="mt-1 text-sm">Try searching for a different venue or location.</p>
          <button onClick={onClear} className="mt-4 rounded-lg bg-[#121A2A] px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg">
            Browse All Venues
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
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
                  <MapPin className="h-4 w-4" /> {venue.city}{venue.location ? ` - ${venue.location}` : ""}
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
      )}
    </section>
  );
}
