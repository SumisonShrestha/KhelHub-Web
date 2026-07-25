import { redirect } from "next/navigation";
import { getTokenCookie } from "@/lib/cookies";
import { handleWhoami } from "@/lib/actions/auth-action";
import AdminSidebar from "./_components/AdminSidebar";

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
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
