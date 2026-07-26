"use client";

import { Search, MapPin, X } from "lucide-react";

const CITIES = ["All Cities", "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];

interface Props {
  query: string;
  city: string;
  onQueryChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

export default function SearchSection({ query, city, onQueryChange, onCityChange }: Props) {
  return (
    <section className="relative -mt-10 z-20">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-xl border border-gray-100">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search venues, cities..."
              className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-10 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {query && (
              <button onClick={() => onQueryChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="relative md:w-48">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <button className="rounded-2xl bg-[#121A2A] px-8 py-4 font-semibold text-white transition hover:scale-105 hover:shadow-lg">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
