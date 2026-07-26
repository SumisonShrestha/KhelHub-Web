"use client";

import { Zap, TrendingUp, Star, BadgeDollarSign } from "lucide-react";

const filters = [
  { id: "all", label: "All", icon: Zap },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "top", label: "Top Rated", icon: Star },
  { id: "budget", label: "Budget", icon: BadgeDollarSign },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export default function FilterChips({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = active === filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => onChange(filter.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[#121A2A] text-white shadow-lg"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              <Icon size={18} />
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
