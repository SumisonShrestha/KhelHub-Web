import { redirect } from "next/navigation";
import { getUserData, getTokenCookie } from "@/lib/cookies";

// Server-side guard for all protected routes.
// Runs before the page renders garcha
export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = await getTokenCookie();
    if (!token) {
        redirect("/login");
    }
    return <>{children}</>;
}
