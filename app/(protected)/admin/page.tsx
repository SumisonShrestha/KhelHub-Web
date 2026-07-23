import { redirect } from "next/navigation";
import { getTokenCookie, getUserData } from "@/lib/cookies";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const token = await getTokenCookie();
  const user = await getUserData();

  if (!token || !user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return <AdminDashboardClient user={user} token={token} />;
}
