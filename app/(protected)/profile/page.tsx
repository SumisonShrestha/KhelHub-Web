"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Edit3, Users, Settings, LogOut, Star } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { handleGetMyBookings } from "@/lib/actions/booking-action";
import { handleLogout } from "@/lib/actions/auth-action";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    handleGetMyBookings().then((res) => {
      if (res.success) setBookings(res.data);
    });
  }, []);

  const doLogout = async () => {
    await handleLogout();
    setUser(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#eef3f8] flex">
      <aside className="w-[320px] p-4 shrink-0">
        <div className="bg-gradient-to-br from-blue-700 to-purple-700 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-sm">Welcome back, {user?.firstName || "User"} 👋</p>
          <div className="flex items-center gap-3 mt-4">
            <img src="/avatar.png" className="w-20 h-20 rounded-full border-4 border-cyan-400" />
            <div>
              <h2 className="font-bold text-lg">{user?.firstName || "User"} ✓</h2>
              <p className="text-sm text-gray-200">{user?.email || "email@example.com"}</p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-5 pt-5 flex justify-around">
            <div className="text-center">
              <h3 className="font-bold text-xl">{bookings.length}</h3>
              <p className="text-xs">BOOKINGS</p>
            </div>
            <div className="text-center border-x border-white/20 px-8">
              <h3 className="font-bold text-xl">{bookings.filter((b) => b.status === "completed").length}</h3>
              <p className="text-xs">COMPLETED</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto fill-yellow-400 text-yellow-400" />
              <p className="text-xs">PRO</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <MenuCard icon={<Edit3 size={18} />} title="Edit Profile" color="bg-blue-500" href="/profile/edit" />
          <MenuCard icon={<CalendarDays size={18} />} title="My Bookings" color="bg-green-500" href="/booking" />
          <MenuCard icon={<Users size={18} />} title="My Teams" color="bg-purple-500" href="/my-teams" />
          <MenuCard icon={<Settings size={18} />} title="Settings" color="bg-orange-500" href="/settings" />
        </div>

        <button onClick={doLogout} className="mt-5 w-full h-12 rounded-xl bg-white border border-red-300 text-red-500 font-semibold flex items-center justify-center gap-3 hover:bg-red-50">
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-sm min-h-[330px] p-8">
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-gray-500">Manage your futsal field bookings</p>
            </div>
            <button onClick={() => window.location.reload()} className="border border-blue-600 px-6 py-2 rounded-lg text-blue-700 font-semibold hover:bg-blue-50">
              Refresh
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-12">
              <p className="text-gray-500 text-lg">No bookings found</p>
              <Link href="/venues" className="mt-5 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 text-white font-semibold shadow-lg hover:opacity-90">
                Find Venues to Book
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {bookings.map((b) => (
                <div key={b._id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                  <div>
                    <p className="font-semibold text-gray-900">{b.venueName}</p>
                    <p className="text-sm text-gray-500">{b.date} • {b.timeSlot}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">Rs {b.totalPrice?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <Link href="/venues" className="mt-16 w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 text-white font-bold flex items-center justify-center hover:opacity-90">
            Book Another Venue
          </Link>
        </div>
      </main>
    </div>
  );
}

function MenuCard({ icon, title, color, href }: { icon: React.ReactNode; title: string; color: string; href?: string }) {
  const content = (
    <>
      <div className={`${color} text-white p-3 rounded-xl`}>{icon}</div>
      <p className="font-semibold text-sm">{title}</p>
    </>
  );
  if (href) return <Link href={href} className="bg-white rounded-xl h-24 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition">{content}</Link>;
  return <div className="bg-white rounded-xl h-24 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition">{content}</div>;
}
