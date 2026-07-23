import { getUserData } from "@/lib/cookies";
import { redirect } from "next/navigation";
import AdminVenuesClient from "./_components/AdminVenuesClient";

export default async function AdminVenuesPage() {
    const user = await getUserData();

    if (!user) redirect("/login");
    if (user.role !== "admin") redirect("/dashboard");

    return <AdminVenuesClient />;
}
