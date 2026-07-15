import { redirect } from "next/navigation";
import { getTokenCookie } from "@/lib/cookies";
import { handleWhoami } from "@/lib/actions/auth-action";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = await getTokenCookie();
    if (!token) {
        redirect("/login");
    }

    const result = await handleWhoami();
    if (!result.success || !result.data) {
        redirect("/login");
    }

    if (result.data.role !== "admin") {
        redirect("/dashboard"); // non-admins get bounced to their dashboard
    }

    return <>{children}</>;
}