"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, MapPin, Star, BadgeDollarSign, Trophy } from "lucide-react";

const SPORTS = ["All Sports", "Football", "Futsal", "Basketball", "Cricket", "Badminton", "Tennis", "Volleyball"];
const CITIES = ["All Cities", "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];

interface Props {
  sport: string;
  city: string;
  sort: string;
  onSportChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export default function FilterBar({ sport, city, sort, onSportChange, onCityChange, onSortChange, onReset }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2">
            <Filter className="text-blue-600" size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">Filter Venues</h3>
            <p className="text-sm text-gray-500">Narrow down your search</p>
          </div>
        </div>
        {open ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-6 py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin size={16} /> Location
              </label>
              <select
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-blue-500 focus:outline-none"
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Trophy size={16} /> Sport
              </label>
              <select
                value={sport}
                onChange={(e) => onSportChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-blue-500 focus:outline-none"
              >
                {SPORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Star size={16} /> Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-blue-500 focus:outline-none"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Lowest Price</option>
                <option value="price-high">Highest Price</option>
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BadgeDollarSign size={16} /> Price
              </label>
              <select className="w-full rounded-xl border border-gray-200 p-3 focus:border-blue-500 focus:outline-none">
                <option>Any Price</option>
                <option>Under Rs.1000</option>
                <option>Rs.1000 - Rs.2000</option>
                <option>Above Rs.2000</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              onClick={onReset}
              className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
