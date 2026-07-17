"use client";

import { useCallback, useEffect, useState } from "react";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/api/leaderboard";
import { Trophy, Target, Medal, ChevronRight } from "lucide-react";

export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard();
      setRankings(data);
    } catch {
      setRankings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-[#121A2A] px-4 py-12 text-white md:py-16">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-bold md:text-4xl">Nepal Rankings</h1>
          <p className="mt-2 text-blue-100">National futsal team standings</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <span className="text-sm text-gray-600">
            Mar 6 &mdash; Mar 15, 2026
          </span>
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Live
          </span>
        </div>

        {loading ? (
          <div className="animate-pulse rounded-2xl border bg-white p-6 shadow-sm">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 border-b border-gray-100 py-4 last:border-0">
                <div className="h-4 w-8 rounded bg-gray-200" />
                <div className="h-4 flex-1 rounded bg-gray-200" />
                <div className="h-4 w-8 rounded bg-gray-200" />
                <div className="h-4 w-8 rounded bg-gray-200" />
                <div className="h-4 w-8 rounded bg-gray-200" />
                <div className="h-4 w-8 rounded bg-gray-200" />
                <div className="h-4 w-8 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : rankings.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Team</th>
                  <th className="px-5 py-4 text-center">P</th>
                  <th className="px-5 py-4 text-center">W</th>
                  <th className="px-5 py-4 text-center">D</th>
                  <th className="px-5 py-4 text-center">L</th>
                  <th className="px-5 py-4 text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((r, idx) => (
                  <tr
                    key={r._id}
                    className="border-b border-gray-50 transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {idx <= 2 ? (
                        <span className="flex items-center gap-1">
                          <Medal
                            className={`h-4 w-4 ${
                              idx === 0
                                ? "text-yellow-500"
                                : idx === 1
                                  ? "text-gray-400"
                                  : "text-amber-600"
                            }`}
                          />
                          {idx + 1}
                        </span>
                      ) : (
                        idx + 1
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {r.teamName}
                    </td>
                    <td className="px-5 py-4 text-center text-gray-700">
                      {r.played}
                    </td>
                    <td className="px-5 py-4 text-center text-gray-700">
                      {r.won}
                    </td>
                    <td className="px-5 py-4 text-center text-gray-700">
                      {r.drawn}
                    </td>
                    <td className="px-5 py-4 text-center text-gray-700">
                      {r.lost}
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-gray-900">
                      {r.pts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border bg-white py-20 text-center shadow-sm">
            <Trophy className="mx-auto h-14 w-14 text-gray-200" />
            <h3 className="mt-5 text-xl font-bold text-gray-800">
              No teams ranked yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Matches need to be played and verified to populate the leaderboard.
            </p>
          </div>
        )}

        <section className="mt-10">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            How to Climb the Ranks
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Challenge Teams",
                desc: "Challenge other teams and compete in matches",
              },
              {
                icon: Trophy,
                title: "Win Matches",
                desc: "Earn points for every win and draw",
              },
              {
                icon: ChevronRight,
                title: "Earn Rewards",
                desc: "Climb the leaderboard and unlock rewards",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#121A2A] text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-100 px-5 py-4 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">P</span> Played{" "}
          <span className="ml-3 font-semibold text-gray-900">W</span> Won{" "}
          <span className="ml-3 font-semibold text-gray-900">D</span> Drawn{" "}
          <span className="ml-3 font-semibold text-gray-900">L</span> Lost{" "}
          <span className="ml-3 font-semibold text-gray-900">Pts</span> Points
        </div>
      </div>
    </div>
  );
}
