"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Users, Phone } from "lucide-react";
import { Skeleton } from "@/app/_components/Skeleton";
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
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
          <Skeleton className="mb-6 h-4 w-16" />
          <Skeleton className="h-32 w-full" />
          <div className="mt-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black gap-4">
        <Users className="h-12 w-12 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-400">Team not found</h2>
        <button onClick={() => router.back()} className="text-sm text-blue-400 hover:underline">Go back</button>
      </div>
    );
  }

  const initials = team.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-[#111] px-4 py-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </div>

      <div className="mx-auto max-w-full px-4 py-8">
        <div className="rounded-2xl border border-gray-800 bg-[#111] p-8 text-center shadow-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#121A2A] text-2xl font-bold text-white">
            {initials}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">{team.name}</h1>
          <p className="mt-1 text-gray-400">{team.sport}</p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              team.level === "Advanced" ? "bg-red-900/30 text-red-400"
              : team.level === "Intermediate" ? "bg-yellow-900/30 text-yellow-400"
              : team.level === "Professional" ? "bg-purple-900/30 text-purple-400"
              : "bg-green-900/30 text-green-400"
            }`}>
              {team.level}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-800 pt-6">
            <div>
              <p className="text-2xl font-bold text-white">{team.members}</p>
              <p className="text-sm text-gray-500">Joined</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{team.maxPlayers}</p>
              <p className="text-sm text-gray-500">Max Players</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{isNaN(team.maxPlayers - team.members) ? 0 : team.maxPlayers - team.members}</p>
              <p className="text-sm text-gray-500">Remaining</p>
            </div>
          </div>

          {team.phone && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
              <Phone className="h-4 w-4" />
              {team.phone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
