"use client";

import { useEffect, useState } from "react";
import { Users, Trophy, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { handleGetMyTeams } from "@/lib/actions/team-action";
import { getToken } from "@/lib/actions/auth-action";
import { leaveTeam } from "@/lib/api/team";
import type { Team } from "@/lib/api/team";

export default function MyTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveTarget, setLeaveTarget] = useState<Team | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await handleGetMyTeams();
      if (res.success) setTeams(res.data as Team[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-[#121A2A] px-4 py-12 text-white md:py-16">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold md:text-4xl">My Teams</h1>
              <p className="mt-1 text-blue-100">Teams you have joined</p>
            </div>
            <Link
              href="/teams"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:shadow-xl"
            >
              <Users className="h-4 w-4" />
              Browse All Teams
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex animate-pulse items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-3 w-20 rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-8 w-14 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="rounded-2xl border bg-white py-20 text-center shadow-sm">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">No Teams Yet</h3>
            <p className="mt-1 text-sm text-gray-500">You haven&apos;t joined any teams yet.</p>
            <Link
              href="/teams"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#121A2A] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg"
            >
              Find a Team
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => {
              const initials = team.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={team._id}
                  className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#121A2A] text-sm font-bold text-white">
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{team.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                        <Home className="h-3.5 w-3.5" />
                        {team.location || "No location"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        team.level === "Advanced"
                          ? "bg-red-100 text-red-700"
                          : team.level === "Intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {team.level}
                    </span>
                    <button
                      onClick={() => setLeaveTarget(team)}
                      className="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Leave
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {leaveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Leave Team?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to leave <strong>{leaveTarget.name}</strong>?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setLeaveTarget(null)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setLeaving(true);
                  try {
                    const token = await getToken();
                    if (token) {
                      await leaveTeam(token, leaveTarget._id);
                      setTeams((prev) => prev.filter((t) => t._id !== leaveTarget._id));
                    }
                  } catch {}
                  setLeaving(false);
                  setLeaveTarget(null);
                }}
                disabled={leaving}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {leaving ? "Leaving..." : "Yes, Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
