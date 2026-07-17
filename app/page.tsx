import { redirect } from "next/navigation";
import { getTokenCookie } from "@/lib/cookies";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const token = await getTokenCookie();
  if (token) {
    redirect("/dashboard");
  }
  redirect("/login");
}
