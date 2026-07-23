import { getUserData } from "@/lib/cookies";
import { redirect } from "next/navigation";
import AdminTeamsClient from "./_components/AdminTeamsClient";

export default async function AdminTeamsPage() {
    const user = await getUserData();

    if (!user) redirect("/login");
    if (user.role !== "admin") redirect("/dashboard");

    return <AdminTeamsClient />;
}
