import { getUserData } from "@/lib/cookies";
import { redirect } from "next/navigation";
import AdminUsersClient from "./_components/AdminUsersClient";

export default async function AdminUsersPage() {
    const user = await getUserData();

    if (!user) redirect("/login");
    if (user.role !== "admin") redirect("/dashboard");

    return <AdminUsersClient />;
}