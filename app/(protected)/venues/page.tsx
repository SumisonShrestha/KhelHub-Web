"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hero from "./components/Hero";
import FilterChips from "./components/FilterChips";
import FilterBar from "./components/FilterBar";
import VenueGrid from "./components/VenueGrid";
import { getVenues, type Venue } from "@/lib/api/venue";
import { useSelectedVenue } from "@/context/SelectedVenueContext";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedVenue, selectVenue } = useSelectedVenue();
  const gridRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All Cities");
  const [sport, setSport] = useState("All Sports");
  const [sort, setSort] = useState("rating");
  const [chip, setChip] = useState("all");

  const loadVenues = useCallback(async () => {
    try {
      setLoading(true);
      const sortParam = chip === "budget" ? "price-low" : chip === "top" ? "rating" : sort;
      const data = await getVenues({
        search: query || undefined,
        city: city === "All Cities" ? undefined : city,
        sport: sport === "All Sports" ? undefined : sport,
        sort: sortParam as "rating" | "price-low" | "price-high",
      });
      setVenues(data);
    } catch {
      setVenues([]);
    } finally {
      setLoading(false);
    }
  }, [query, city, sport, sort, chip]);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  useEffect(() => {
    const timer = setTimeout(() => loadVenues(), 400);
    return () => clearTimeout(timer);
  }, [query, city, sport, sort, chip]);

  const avgRating = useMemo(() => {
    if (venues.length === 0) return "0.0";
    const sum = venues.reduce((acc, v) => acc + v.rating, 0);
    return (sum / venues.length).toFixed(1);
  }, [venues]);

  const handleSelect = useCallback(
    (venue: Venue) => {
      selectVenue(selectedVenue?._id === venue._id ? null : venue);
    },
    [selectedVenue, selectVenue]
  );

  const handleChipChange = (id: string) => {
    setChip(id);
    if (id === "trending") setSort("rating");
  };

  const handleReset = () => {
    setQuery("");
    setCity("All Cities");
    setSport("All Sports");
    setSort("rating");
    setChip("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        venueCount={venues.length}
        avgRating={avgRating}
        query={query}
        city={city}
        onQueryChange={setQuery}
        onCityChange={setCity}
      />

      <div ref={gridRef} className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
        <FilterChips active={chip} onChange={handleChipChange} />

        <FilterBar
          sport={sport}
          city={city}
          sort={sort}
          onSportChange={setSport}
          onCityChange={setCity}
          onSortChange={setSort}
          onReset={handleReset}
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="h-52 w-full bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                  <div className="h-2 w-full rounded-full bg-gray-200" />
                  <div className="flex gap-2">
                    <div className="h-5 w-14 rounded bg-gray-200" />
                    <div className="h-5 w-14 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <VenueGrid
            venues={venues}
            onSelect={handleSelect}
            selectedId={selectedVenue?._id || null}
          />
        )}
      </div>
    </div>
  );
}
