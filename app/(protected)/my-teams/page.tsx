"use client";

import { useEffect, useState } from "react";
import { Users, Home, LogOut, Trash2, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleDeleteTeam, handleGetMyTeams, handleGetReceivedRequests, handleApproveRequest, handleDenyRequest } from "@/lib/actions/team-action";
import { getToken } from "@/lib/actions/auth-action";
import { leaveTeam } from "@/lib/api/team";
import { useUser } from "@/context/UserContext";
import type { Team } from "@/lib/api/team";

interface JoinRequest {
  _id: string;
  teamId: string;
  teamName: string;
  senderId: string;
  senderName: string;
  message?: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
}

export default function MyTeamsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState<Team | null>(null);
  const [performing, setPerforming] = useState(false);
  const [activeTab, setActiveTab] = useState("teams");
  const [approving, setApproving] = useState<Set<string>>(new Set());

  const loadTeams = async () => {
    const res = await handleGetMyTeams();
    if (res.success) setTeams(res.data as Team[]);
  };

  const loadRequests = async () => {
    const res = await handleGetReceivedRequests();
    if (res.success) setRequests(res.data as JoinRequest[]);
  };

  useEffect(() => {
    (async () => {
      if (activeTab === "teams") await loadTeams();
      else await loadRequests();
      setLoading(false);
    })();
  }, [activeTab]);

  const handleApprove = async (requestId: string) => {
    setApproving((prev) => new Set(prev).add(requestId));
    await handleApproveRequest(requestId);
    setRequests((prev) => prev.filter((r) => r._id !== requestId));
    setApproving((prev) => { const next = new Set(prev); next.delete(requestId); return next; });
  };

  const handleDeny = async (requestId: string) => {
    setApproving((prev) => new Set(prev).add(requestId));
    await handleDenyRequest(requestId);
    setRequests((prev) => prev.filter((r) => r._id !== requestId));
    setApproving((prev) => { const next = new Set(prev); next.delete(requestId); return next; });
  };

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

      <div className="mx-auto max-w-full px-4 py-8 md:px-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("teams")}
            className={`flex-1 rounded-xl border px-6 py-3 text-sm font-semibold transition ${
              activeTab === "teams"
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            My Teams
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 rounded-xl border px-6 py-3 text-sm font-semibold transition ${
              activeTab === "requests"
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            Join Requests
          </button>
        </div>

        <div className="mt-8">
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
          ) : activeTab === "teams" ? (
            teams.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-20 text-center shadow-md">
                <div className="rounded-full bg-gray-100 p-5">
                  <Users className="h-14 w-14 text-gray-400" />
                </div>
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  You&apos;re not part of any teams yet
                </h2>
                <p className="mt-3 text-gray-500">
                  Join an existing team or create your own.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/teams"
                    className="rounded-lg border-2 border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    Browse Teams
                  </Link>
                  <Link
                    href="/teams/create"
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-3 font-semibold text-white shadow transition hover:opacity-90"
                  >
                    Create Team
                  </Link>
                </div>
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
                      onClick={() => router.push(`/teams/${team._id}`)}
                      className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all hover:border-blue-300 hover:shadow-lg"
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
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
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
                        {team.createdBy === (user as any)?._id ? (
                          <button
                            onClick={() => { setActionTarget(team); }}
                            className="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={() => { setActionTarget(team); }}
                            className="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Leave
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            requests.length === 0 ? (
              <div className="flex items-center justify-center rounded-2xl bg-white py-20 shadow-md">
                <div className="text-center">
                  <Users className="mx-auto h-14 w-14 text-gray-300" />
                  <h2 className="mt-5 text-2xl font-bold text-gray-900">No Join Requests</h2>
                  <p className="mt-2 text-gray-500">You don&apos;t have any pending team requests.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req._id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                        {req.senderName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{req.senderName}</h3>
                        <p className="text-sm text-gray-500">wants to join <strong>{req.teamName}</strong></p>
                        {req.message && <p className="mt-1 text-xs text-gray-400">"{req.message}"</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(req._id)}
                        disabled={approving.has(req._id)}
                        className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeny(req._id)}
                        disabled={approving.has(req._id)}
                        className="flex items-center gap-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {actionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">
              {actionTarget.createdBy === (user as any)?._id ? "Cancel Team?" : "Leave Team?"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {actionTarget.createdBy === (user as any)?._id
                ? <>Are you sure you want to cancel <strong>{actionTarget.name}</strong>? This cannot be undone.</>
                : <>Are you sure you want to leave <strong>{actionTarget.name}</strong>?</>
              }
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setActionTarget(null)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={async () => {
                  setPerforming(true);
                  try {
                    const token = await getToken();
                    if (!token) return;
                    const isLeader = actionTarget.createdBy === (user as any)?._id;
                    if (isLeader) {
                      await handleDeleteTeam(actionTarget._id);
                    } else {
                      await leaveTeam(token, actionTarget._id);
                    }
                    await loadTeams();
                  } catch {}
                  setPerforming(false);
                  setActionTarget(null);
                }}
                disabled={performing}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {performing ? "Processing..." : actionTarget.createdBy === (user as any)?._id ? "Yes, Cancel" : "Yes, Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
