import { getUserData } from "@/lib/cookies";
import { redirect } from "next/navigation";
import AppShell from "../_components/AppShell";
import BookingClient from "./_components/BookingClient";
import { getVenueById, venues } from "@/lib/mock/venues";

export default async function BookingPage({
    searchParams,
}: {
    searchParams: Promise<{ venueId?: string }>;
}) {
    const user = await getUserData();
    if (!user) redirect("/login");

    const { venueId } = await searchParams;
    const selectedVenue = venueId ? getVenueById(venueId) : undefined;

    return (
        <AppShell
            user={user}
            title="Booking"
            subtitle={
                selectedVenue
                    ? `Reserve a slot at ${selectedVenue.name}`
                    : "Manage your venue reservations"
            }
        >
            <BookingClient venue={selectedVenue} venues={venues} />
        </AppShell>
    );
}
