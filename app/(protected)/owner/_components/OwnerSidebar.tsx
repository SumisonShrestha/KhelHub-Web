"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, Calendar, LogOut } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-action";
import { useState } from "react";

const links = [
  { href: "/owner", label: "Dashboard", icon: LayoutDashboard },
  { href: "/owner?tab=venues", label: "My Venues", icon: Building2 },
  { href: "/owner?tab=bookings", label: "Booking Requests", icon: Calendar },
];

function getActiveHref(pathname: string, searchParams: URLSearchParams): string {
  const tab = searchParams.get("tab");
  if (tab === "venues") return "/owner?tab=venues";
  if (tab === "bookings") return "/owner?tab=bookings";
  return "/owner";
}

export default function OwnerSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const activeHref = getActiveHref(pathname, searchParams);

  if (pathname.includes("/owner/venues/create")) return null;

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-[#121A2A] text-white">
      <div className="border-b border-white/10 p-6">
        <Image src="/khelhublogo_.png" alt="KhelHub" width={140} height={60} priority className="mb-2" />
        <h1 className="text-lg font-bold tracking-wide">Owner Panel</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeHref === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={async () => {
            setLoggingOut(true);
            await handleLogout();
            router.replace("/login");
          }}
          disabled={loggingOut}
          className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
