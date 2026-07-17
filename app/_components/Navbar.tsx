"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  if (pathname === "/splash") return null;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/venues", label: "Venues" },
    { href: "/teams", label: "Teams" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/booking", label: "Bookings" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/khelhublogo_.png" alt="KhelHub" width={140} height={40} priority className="h-8 w-auto brightness-0 invert" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition hover:text-white ${
                pathname === link.href ? "text-white" : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/my-teams"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            My Teams
          </Link>
          <Link
            href="/venues/create"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            List Your Venue
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <User className="h-4 w-4" />
              {user.firstName || user.username || "Dashboard"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Login
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="p-2 md:hidden">
          {open ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`${pathname === link.href ? "text-white" : "text-white/70"}`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-white/10" />
            <div className="flex gap-2">
              <Link href="/my-teams" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-white/20 px-5 py-2 text-center text-sm font-semibold text-white">
                My Teams
              </Link>
              <Link href="/venues/create" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-white/20 px-5 py-2 text-center text-sm font-semibold text-white">
                List Your Venue
              </Link>
            </div>
            {user ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-full border border-white/20 px-5 py-2 text-center text-sm font-semibold text-white">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-full bg-white px-5 py-2 text-center text-sm font-semibold text-black">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
