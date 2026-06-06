
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const stored = authStorage.getUser();
    if (!stored) {
      router.push("/login");
    } else {
      setUser(stored);
    }
  }, [router]);

  const handleLogout = () => {
    authStorage.logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* ── Top Nav ── */}
      <nav className="border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-black tracking-widest text-black">KHELHUB</span>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500">
            Welcome, <span className="font-bold text-black">{user.firstName} {user.lastName}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* ── Header ── */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tight text-black mb-2">Dashboard</h1>
          <p className="text-gray-500 text-sm">Here's what's happening with your account.</p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Matches Played", value: "24" },
            { label: "Wins", value: "18" },
            { label: "Win Rate", value: "75%" },
            { label: "Ranking", value: "#42" },
          ].map((stat) => (
            <div key={stat.label} className="border border-gray-200 rounded-xl p-6">
              <p className="text-3xl font-black text-black mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Recent Activity ── */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-black tracking-wide">Recent Matches</h2>
          </div>
          {[
            { opponent: "Team Alpha", result: "WIN", score: "3 - 1", date: "Jun 5, 2026" },
            { opponent: "Team Beta",  result: "WIN", score: "2 - 0", date: "Jun 3, 2026" },
            { opponent: "Team Gamma", result: "LOSS", score: "1 - 2", date: "Jun 1, 2026" },
            { opponent: "Team Delta", result: "WIN", score: "4 - 2", date: "May 29, 2026" },
          ].map((match, i) => (
            <div
              key={i}
              className="px-6 py-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold text-black text-sm">{match.opponent}</p>
                <p className="text-xs text-gray-400">{match.date}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm font-mono text-gray-700">{match.score}</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    match.result === "WIN"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {match.result}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Profile Card ── */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-black tracking-wide mb-4">My Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "First Name", value: user.firstName },
              { label: "Last Name",  value: user.lastName },
              { label: "Username",   value: user.username },
              { label: "Email",      value: user.email },
              { label: "Role",       value: user.role ?? "user" },
            ].map((field) => (
              <div key={field.label}>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{field.label}</p>
                <p className="text-sm font-semibold text-black">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
