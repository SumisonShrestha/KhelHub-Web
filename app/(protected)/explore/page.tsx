import { getUserData } from "@/lib/cookies";
import { redirect } from "next/navigation";
import AppShell from "../_components/AppShell";
import ExploreClient from "./_components/ExploreClient";
import { venues } from "@/lib/mock/venues";

export default async function ExplorePage() {
    const user = await getUserData();
    if (!user) redirect("/login");

    return (
        <AppShell
            user={user}
            title="Explore"
            subtitle="Find and book the perfect venue for your next game"
        >
            <ExploreClient venues={venues} />
        </AppShell>
    );
}
