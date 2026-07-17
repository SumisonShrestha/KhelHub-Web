"use client";

import { Search } from "lucide-react";

interface Props {
  venueCount: number;
  avgRating: string;
  query: string;
  city: string;
  onQueryChange: (v: string) => void;
  onCityChange: (v: string) => void;
}

const CITIES = ["All Cities", "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];

export default function Hero({ venueCount, avgRating, query, city, onQueryChange, onCityChange }: Props) {
  return (
    <section className="relative overflow-hidden bg-[#121A2A] px-4 py-12 text-white md:py-16">
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Book Your Match ⚽
            </h1>
            <p className="mt-2 text-blue-100">Top-rated futsal arenas near you</p>
          </div>

          <div className="mt-4 flex gap-4 md:mt-0">
            <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur">
              <p className="text-xl font-bold">{venueCount}</p>
              <p className="text-xs text-blue-100">Venues</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur">
              <p className="text-xl font-bold">{avgRating}</p>
              <p className="text-xs text-blue-100">Avg</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur">
              <p className="text-xl font-bold">50</p>
              <p className="text-xs text-blue-100">NPR OFF</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-xl">
            <Search className="h-5 w-5 shrink-0 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search venues..."
              className="flex-1 text-gray-900 outline-none placeholder:text-gray-400"
            />
            <select
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
            >
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button className="rounded-xl bg-[#121A2A] px-5 py-2 text-sm font-semibold text-white transition hover:shadow-lg">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
