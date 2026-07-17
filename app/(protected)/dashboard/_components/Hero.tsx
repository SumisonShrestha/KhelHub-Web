"use client";

import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-8 pb-20 text-center">

      <div className="inline-flex items-center bg-white/10 px-5 py-2 rounded-full text-gray-200 mb-8">
        🇳🇵 Nepal's #1 Sports Booking Platform
      </div>

      <h1 className="text-7xl font-bold text-white leading-tight">

        Book Your

        <br />

        <span className="text-blue-500">
          Perfect Pitch
        </span>

      </h1>

      <p className="text-gray-300 text-xl mt-6">
        Find and book futsal courts, join teams, and compete — all in one place.
      </p>

      <SearchBar />

    </section>
  );
}