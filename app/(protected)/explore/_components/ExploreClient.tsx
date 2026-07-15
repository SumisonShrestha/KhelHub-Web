"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Star } from "lucide-react";
import { SPORTS, type Venue } from "@/lib/mock/venues";

const CITIES = ["All Cities", "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];

export default function ExploreClient({ venues }: { venues: Venue[] }) {
    const [query, setQuery] = useState("");
    const [sport, setSport] = useState<string>("All Sports");
    const [city, setCity] = useState<string>("All Cities");
    const [sort, setSort] = useState<"rating" | "price-low" | "price-high">("rating");

    const filtered = useMemo(() => {
        let list = venues.filter((v) => {
            const matchesQuery =
                query.trim() === "" ||
                v.name.toLowerCase().includes(query.toLowerCase()) ||
                v.location.toLowerCase().includes(query.toLowerCase());
            const matchesSport = sport === "All Sports" || v.sport === sport;
            const matchesCity = city === "All Cities" || v.city === city;
            return matchesQuery && matchesSport && matchesCity;
        });

        list = [...list].sort((a, b) => {
            if (sort === "price-low") return a.pricePerHour - b.pricePerHour;
            if (sort === "price-high") return b.pricePerHour - a.pricePerHour;
            return b.rating - a.rating;
        });

        return list;
    }, [venues, query, sport, city, sort]);

    return (
        <div>
            {/* SEARCH + FILTERS */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">

                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search venues or locations..."
                            className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-black outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-12 rounded-lg border border-gray-200 bg-white px-4 text-black outline-none transition focus:border-blue-500"
                    >
                        {CITIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as typeof sort)}
                        className="h-12 rounded-lg border border-gray-200 bg-white px-4 text-black outline-none transition focus:border-blue-500"
                    >
                        <option value="rating">Top Rated</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>

                {/* SPORT CHIPS */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {["All Sports", ...SPORTS].map((s) => (
                        <button
                            key={s}
                            onClick={() => setSport(s)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                sport === s
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* RESULTS COUNT */}
            <p className="mt-6 text-sm text-gray-500">
                {filtered.length} venue{filtered.length !== 1 ? "s" : ""} found
            </p>

            {/* VENUE GRID */}
            <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((venue) => (
                    <div
                        key={venue.id}
                        className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl">
                                {venue.emoji}
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {venue.rating}
                                <span className="font-normal text-gray-400">
                                    ({venue.reviews})
                                </span>
                            </div>
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-gray-900">
                            {venue.name}
                        </h3>

                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {venue.location}
                        </p>

                        <span className="mt-3 inline-block w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            {venue.sport}
                        </span>

                        <p className="mt-3 text-sm text-gray-600 flex-1">
                            {venue.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {venue.amenities.map((a) => (
                                <span
                                    key={a}
                                    className="rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-500 border"
                                >
                                    {a}
                                </span>
                            ))}
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t pt-4">
                            <div>
                                <span className="text-xl font-bold text-gray-900">
                                    Rs {venue.pricePerHour.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500">/hr</span>
                            </div>

                            <Link
                                href={`/booking?venueId=${venue.id}`}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full rounded-2xl border bg-white p-10 text-center text-gray-500">
                        No venues match your filters. Try adjusting your search.
                    </div>
                )}
            </div>
        </div>
    );
}
