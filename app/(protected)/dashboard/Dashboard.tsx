"use client";

import { useState } from "react";
import Hero from "./_components/Hero";
import FeaturedVenues from "./_components/FeaturedVenues";
import SearchResults from "./_components/SearchResults";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#0B1224] via-[#111C36] to-[#1D2547]">
        <Hero onSearch={setSearchQuery} />
      </div>

      {searchQuery ? (
        <SearchResults query={searchQuery} onClear={() => setSearchQuery("")} />
      ) : (
        <FeaturedVenues />
      )}
    </main>
  );
}
