"use client";

import Hero from "./_components/Hero";
import FeaturedVenues from "./_components/FeaturedVenues";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#0B1224] via-[#111C36] to-[#1D2547]">
        <Hero />
      </div>

      <FeaturedVenues />
    </main>
  );
}