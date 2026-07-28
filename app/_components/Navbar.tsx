"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, UserCircle, Calendar, LogOut, ChevronDown, Building2, Bell, CheckCheck, Trash2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { handleLogout } from "@/lib/actions/auth-action";
import { handleGetNotifications, handleGetUnreadCount, handleMarkAsRead, handleMarkAllAsRead, handleDeleteNotification } from "@/lib/actions/notification-action";

interface Notification {
  _id: string;
  type: string;
  message: string;
  teamId?: string;
  teamName?: string;
  read: boolean;
  createdAt: string;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const [notifRes, countRes] = await Promise.all([
      handleGetNotifications(),
      handleGetUnreadCount(),
    ]);
    if (notifRes.success) setNotifications(notifRes.data);
    if (countRes.success) setUnreadCount(countRes.count);
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const refresh = async () => {
      if (document.visibilityState === "visible" && user) {
        const countRes = await handleGetUnreadCount();
        if (countRes.success) setUnreadCount(countRes.count);
      }
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, [user]);

  const doLogout = async () => {
    await handleLogout();
    setUser(null);
    setDropOpen(false);
    router.push("/login");
  };

  const openNotif = async () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) {
      const [notifRes, countRes] = await Promise.all([
        handleGetNotifications(),
        handleGetUnreadCount(),
      ]);
      if (notifRes.success) setNotifications(notifRes.data);
      if (countRes.success) setUnreadCount(countRes.count);
    }
  };

  const markRead = async (id: string) => {
    await handleMarkAsRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await handleMarkAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotif = async (id: string, wasUnread: boolean) => {
    await handleDeleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  if (pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password" || pathname.startsWith("/admin") || pathname.startsWith("/owner") || pathname.startsWith("/users/venues/create")) return null;

  const navLinks = [
    { href: "/users/dashboard", label: "Home" },
    { href: "/users/venues", label: "Venues" },
    { href: "/users/teams", label: "Teams" },
    { href: "/users/booking", label: "Bookings" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/users/dashboard" className="flex items-center gap-2">
          <Image src="/khelhublogo_.png" alt="KhelHub" width={280} height={76} priority className="h-14 w-auto brightness-0 invert" />
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
            href="/users/my-teams"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            My Teams
          </Link>
          {user ? (
            <>
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
                    <Link href="/users/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link href="/users/booking" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
                      <Calendar className="h-4 w-4" />
                      Bookings
                    </Link>
                    {user?.role === "owner" && (
                      <Link href="/owner" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
                        <Building2 className="h-4 w-4" />
                        Owner Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-white/10" />
                    <button onClick={doLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <div className="relative" ref={notifRef}>
                <button onClick={openNotif} className="relative rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 bg-black py-2 shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-2">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <CheckCheck className="h-3.5 w-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>
                    <hr className="border-white/10" />
                    {notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-white/40">No notifications yet</p>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n._id}
                            className={`group flex items-start gap-3 px-4 py-3 transition hover:bg-white/5 ${!n.read ? "bg-white/5" : ""}`}
                            onClick={() => !n.read && markRead(n._id)}
                          >
                            <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-blue-500"}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${n.read ? "text-white/50" : "text-white"}`}>
                                {n.message}
                              </p>
                              <p className="mt-0.5 text-xs text-white/30">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); clearNotif(n._id, !n.read); }}
                              className="shrink-0 rounded p-1 text-white/30 opacity-0 transition hover:bg-white/10 hover:text-red-400 group-hover:opacity-100"
                              title="Clear"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
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
                <Link href="/users/my-teams" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-white/20 px-5 py-2 text-center text-sm font-semibold text-white">
                My Teams
              </Link>
            </div>
            {user ? (
              <div className="flex flex-col gap-2">
                <Link href="/users/profile" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white">
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>
                <Link href="/users/booking" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white">
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
