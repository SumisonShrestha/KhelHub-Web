"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Venue } from "@/lib/api/venue";

interface SelectedVenueContextValue {
  selectedVenue: Venue | null;
  selectVenue: (venue: Venue | null) => void;
}

const SelectedVenueContext = createContext<SelectedVenueContextValue | undefined>(undefined);

export function SelectedVenueProvider({ children }: { children: ReactNode }) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  return (
    <SelectedVenueContext.Provider value={{ selectedVenue, selectVenue: setSelectedVenue }}>
      {children}
    </SelectedVenueContext.Provider>
  );
}

export function useSelectedVenue() {
  const ctx = useContext(SelectedVenueContext);
  if (!ctx) {
    throw new Error("useSelectedVenue must be used within a <SelectedVenueProvider>");
  }
  return ctx;
}
