import { redirect } from "next/navigation";
import { getTokenCookie } from "@/lib/cookies";
import { handleWhoami } from "@/lib/actions/auth-action";
import OwnerSidebar from "./_components/OwnerSidebar";

export default async function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = await getTokenCookie();
    if (!token) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <OwnerSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
