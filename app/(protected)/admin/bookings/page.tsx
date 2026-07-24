import { redirect } from "next/navigation";
import { getTokenCookie, getUserData } from "@/lib/cookies";
import AdminBookingsClient from "./_components/AdminBookingsClient";

export default async function AdminBookingsPage() {
  const token = await getTokenCookie();
  const user = await getUserData();

  if (!token || !user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return <AdminBookingsClient />;
}
