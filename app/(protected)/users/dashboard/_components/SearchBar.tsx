"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Clock
} from "lucide-react";

interface Props {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = () => {
    onSearch(query.trim());
  };

  return (
    <div className="mt-12">

      <div className="bg-white rounded-2xl p-3 flex shadow-xl">

        <div className="flex items-center flex-1 px-4">

          <Search
            className="text-gray-500"
            size={22}
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder="Search by venue or location..."
            className="w-full ml-3 outline-none text-gray-700"
          />

        </div>

        <button onClick={handleSearch} className="bg-[#121A2A] px-8 rounded-xl text-white">
          <Search />
        </button>

      </div>

      <div className="flex justify-center gap-4 mt-8 flex-wrap">

        <Chip icon={<MapPin size={16} />} text="Near Me" />
        <Chip icon={<Calendar size={16} />} text="Today" />
        <Chip icon={<Calendar size={16} />} text="Tomorrow" />
        <Chip icon={<Clock size={16} />} text="Evening" />

      </div>

    </div>
  );
}

function Chip({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <button className="bg-white/10 border border-white/10 text-white rounded-full px-5 py-2 flex items-center gap-2 hover:bg-white/20 transition">
      {icon}
      {text}
    </button>
  );
}