"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, X, Trash2 } from "lucide-react";
import { getTeams, type Team } from "@/lib/api/team";
import { handleJoinTeam, handleGetMyTeams, handleDeleteTeam, handleGetSentRequests, handleLeaveTeam, handleCancelJoinRequest } from "@/lib/actions/team-action";
import { SkeletonCard } from "@/app/_components/Skeleton";
import { useUser } from "@/context/UserContext";

export default function TeamsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [joining, setJoining] = useState<Set<string>>(new Set());
  const [joinedTeams, setJoinedTeams] = useState<Set<string>>(new Set());
  const [requestedTeams, setRequestedTeams] = useState<Map<string, string>>(new Map());
  const [cancellingReq, setCancellingReq] = useState<Set<string>>(new Set());
  const [joinTarget, setJoinTarget] = useState<Team | null>(null);
  const [joinName, setJoinName] = useState("");
  const [joinPhone, setJoinPhone] = useState("");
  const [joinPhoneErr, setJoinPhoneErr] = useState("");
  const [cancelling, setCancelling] = useState<Set<string>>(new Set());
  const [leaving, setLeaving] = useState<Set<string>>(new Set());

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      setTeams(data);
      try {
        const myTeamsRes = await handleGetMyTeams();
        if (myTeamsRes.success) {
          setJoinedTeams(new Set(myTeamsRes.data.map((t: any) => t._id)));
        }
        const sentRes = await handleGetSentRequests();
        if (sentRes.success) {
          const pending = sentRes.data.filter((r: any) => r.status === "pending");
          setRequestedTeams(new Map(pending.map((r: any) => [r.teamId, r._id])));
        }
      } catch {
        // not authenticated, that's ok
      }
    } catch {
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  useEffect(() => {
    const refresh = async () => {
      if (document.visibilityState === "visible") {
        const sentRes = await handleGetSentRequests();
        if (sentRes.success) {
          const pending = sentRes.data.filter((r: any) => r.status === "pending");
          setRequestedTeams(new Map(pending.map((r: any) => [r.teamId, r._id])));
        }
      }
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);

  const openJoinModal = (team: Team) => {
    setJoinTarget(team);
    setJoinName("");
    setJoinPhone("");
    setJoinPhoneErr("");
  };

  const handleLeaveTeamAction = async (teamId: string) => {
    setLeaving((prev) => new Set(prev).add(teamId));
    const res = await handleLeaveTeam(teamId);
    if (res.success) {
      setJoinedTeams((prev) => { const next = new Set(prev); next.delete(teamId); return next; });
      setRequestedTeams((prev) => { const next = new Map(prev); next.delete(teamId); return next; });
    }
    setLeaving((prev) => { const next = new Set(prev); next.delete(teamId); return next; });
  };

  const handleCancelRequestAction = async (requestId: string, teamId: string) => {
    if (!confirm("Are you sure you want to cancel this join request?")) return;
    setCancellingReq((prev) => new Set(prev).add(requestId));
    await handleCancelJoinRequest(requestId);
    setRequestedTeams((prev) => { const next = new Map(prev); next.delete(teamId); return next; });
    setCancellingReq((prev) => { const next = new Set(prev); next.delete(requestId); return next; });
  };

  const handleCancelTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to cancel this team?")) return;
    setCancelling((prev) => new Set(prev).add(teamId));
    await handleDeleteTeam(teamId);
    setCancelling((prev) => { const next = new Set(prev); next.delete(teamId); return next; });
    loadTeams();
  };

  const handleJoinSubmit = async () => {
    if (!joinTarget) return;
    if (!/^\d{10}$/.test(joinPhone)) {
      setJoinPhoneErr("Phone number must be exactly 10 digits");
      return;
    }
    setJoinPhoneErr("");
    setJoining((prev) => new Set(prev).add(joinTarget._id));
    const result = await handleJoinTeam(joinTarget._id, joinName, joinPhone);
    if (result.success) {
      const sentRes = await handleGetSentRequests();
      if (sentRes.success) {
        const pending = sentRes.data.filter((r: any) => r.status === "pending");
        setRequestedTeams(new Map(pending.map((r: any) => [r.teamId, r._id])));
      }
    }
    setJoining((prev) => { const next = new Set(prev); next.delete(joinTarget._id); return next; });
    setJoinTarget(null);
  };

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-[#121A2A] px-4 py-12 text-white md:py-16">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold md:text-4xl">Teams</h1>
              <p className="mt-1 text-blue-100">Find or create your perfect squad</p>
            </div>

          </div>

          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams..."
                className="flex-1 text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button className="rounded-xl bg-[#121A2A] px-5 py-2 text-sm font-semibold text-white transition hover:shadow-lg">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {joinTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Join {joinTarget.name}</h2>
              <button onClick={() => setJoinTarget(null)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Send a request to join this team. The team owner will review your request.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Name *</label>
                <input
                  type="text"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={joinPhone}
                  onChange={(e) => { setJoinPhone(e.target.value); setJoinPhoneErr(""); }}
                  placeholder="e.g. 9800000000"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {joinPhoneErr && <p className="mt-1 text-xs text-red-500">{joinPhoneErr}</p>}
              </div>
              <button
                onClick={handleJoinSubmit}
                disabled={!joinName.trim() || !/^\d{10}$/.test(joinPhone) || joining.has(joinTarget._id)}
                className="w-full rounded-xl bg-[#121A2A] py-3 font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50"
              >
                {joining.has(joinTarget._id) ? "Sending Request..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-full px-4 py-8 md:px-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border bg-white py-20 text-center shadow-sm">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">No Teams Found</h3>
            <p className="mt-1 text-sm text-gray-500">Try a different search or create a new team.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((team) => {
              const initials = team.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={team._id}
                  onClick={() => router.push(`/teams/${team._id}`)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all hover:border-blue-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#121A2A] text-sm font-bold text-white">
                      {initials}
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {team.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {team.sport}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {isNaN(team.maxPlayers - team.members) ? 0 : team.maxPlayers - team.members} remaining
                    </span>
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
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {team.createdBy === (user as any)?._id ? (
                          <button
                            onClick={() => handleCancelTeam(team._id)}
                            disabled={cancelling.has(team._id)}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {cancelling.has(team._id) ? "Cancelling..." : "Cancel"}
                          </button>
                        ) : joinedTeams.has(team._id) ? (
                          <button
                            onClick={() => handleLeaveTeamAction(team._id)}
                            disabled={leaving.has(team._id)}
                            className="flex items-center gap-1 rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
                          >
                            {leaving.has(team._id) ? "Leaving..." : "Leave"}
                          </button>
                        ) : requestedTeams.has(team._id) ? (
                          <button
                            onClick={() => handleCancelRequestAction(requestedTeams.get(team._id)!, team._id)}
                            disabled={cancellingReq.has(requestedTeams.get(team._id)!)}
                            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                          >
                            {cancellingReq.has(requestedTeams.get(team._id)!) ? "Cancelling..." : "Cancel Request"}
                          </button>
                        ) : (
                          <button
                            onClick={() => openJoinModal(team)}
                            disabled={joining.has(team._id)}
                            className="rounded-lg bg-[#121A2A] px-5 py-2 text-sm font-medium text-white shadow transition hover:scale-105"
                          >
                            {joining.has(team._id) ? "Joining..." : "Join Team"}
                          </button>
                        )}
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
