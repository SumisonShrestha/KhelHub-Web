"use client";

import { useSelectedVenue } from "@/context/SelectedVenueContext";
import VenueTopBar from "@/app/(protected)/venues/components/VenueTopBar";

export default function GlobalVenueBar() {
  const { selectedVenue, selectVenue } = useSelectedVenue();

  if (!selectedVenue) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 md:px-6">
      <VenueTopBar venue={selectedVenue} onClose={() => selectVenue(null)} />
    </div>
  );
}
