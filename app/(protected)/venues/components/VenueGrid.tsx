import type { Venue } from "@/lib/api/venue";
import VenueCard from "./VenueCard";

interface Props {
  venues: Venue[];
  onSelect: (venue: Venue) => void;
  selectedId: string | null;
  onRateClick?: (venue: Venue) => void;
}

export default function VenueGrid({ venues, onSelect, selectedId, onRateClick }: Props) {
  if (venues.length === 0) {
    return (
      <div className="rounded-3xl border bg-white py-20 text-center shadow-sm">
        <div className="text-6xl">🏟️</div>
        <h3 className="mt-5 text-2xl font-bold text-gray-800">No Venues Found</h3>
        <p className="mt-2 text-gray-500">Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {venues.map((venue) => (
        <VenueCard
          key={venue._id}
          venue={venue}
          onSelect={onSelect}
          isSelected={venue._id === selectedId}
          onRateClick={onRateClick}
        />
      ))}
    </div>
  );
}
