"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Users, Trophy, MapPin } from "lucide-react";
import { getTeamById, type Team } from "@/lib/api/team";

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getTeamById(id)
      .then(setTeam)
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
          Loading team...
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
        <Users className="h-12 w-12 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-700">Team not found</h2>
        <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline">Go back</button>
      </div>
    );
  }

  const initials = team.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const levelColors: Record<string, string> = {
    Advanced: "bg-red-100 text-red-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Beginner: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 shadow-sm">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border bg-white p-8 shadow-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#121A2A] text-2xl font-bold text-white">
            {initials}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{team.name}</h1>
          <p className="mt-1 text-gray-500">{team.sport}</p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <span className={levelColors[team.level] || "bg-gray-100 text-gray-700"}>
              {team.level}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
            <div>
              <p className="text-2xl font-bold text-gray-900">{team.members}</p>
              <p className="text-sm text-gray-500">Joined</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{team.maxPlayers}</p>
              <p className="text-sm text-gray-500">Max Players</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{isNaN(team.maxPlayers - team.members) ? 0 : team.maxPlayers - team.members}</p>
              <p className="text-sm text-gray-500">Remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
