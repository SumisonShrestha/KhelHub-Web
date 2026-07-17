"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, UserCircle, Calendar, LogOut, ChevronDown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { handleLogout } from "@/lib/actions/auth-action";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doLogout = async () => {
    await handleLogout();
    setUser(null);
    setDropOpen(false);
    router.push("/");
  };

  if (pathname === "/") return null;

  const navLinks = [
    { href: "/dashboard", label: "Home" },
    { href: "/venues", label: "Venues" },
    { href: "/teams", label: "Teams" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/booking", label: "Bookings" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/khelhublogo_.png" alt="KhelHub" width={220} height={60} priority className="h-12 w-auto brightness-0 invert" />
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
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                {user.firstName || user.username || "Dashboard"}
                <ChevronDown className={`h-3.5 w-3.5 transition ${dropOpen ? "rotate-180" : ""}`} />
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-black py-2 shadow-2xl">
                  <Link href="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link href="/booking" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
                    <Calendar className="h-4 w-4" />
                    Bookings
                  </Link>
                  <hr className="my-1 border-white/10" />
                  <button onClick={doLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
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
              <div className="flex flex-col gap-2">
                <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white">
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>
                <Link href="/booking" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white">
                  <Calendar className="h-4 w-4" />
                  Bookings
                </Link>
                <button onClick={() => { setOpen(false); doLogout(); }} className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/70">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
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
