import { redirect } from "next/navigation";
import { getTokenCookie } from "@/lib/cookies";
import GlobalVenueBar from "./_components/GlobalVenueBar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getTokenCookie();
  if (!token) {
    redirect("/login");
  }

  return (
    <>
      <GlobalVenueBar />
      {children}
    </>
  );
}
