"use client";

import { useEffect, useState } from "react";
import { Users, Trophy, Home, LogOut, Plus, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { handleCreateTeam, handleDeleteTeam, handleGetMyTeams } from "@/lib/actions/team-action";
import { getToken } from "@/lib/actions/auth-action";
import { leaveTeam } from "@/lib/api/team";
import { useUser } from "@/context/UserContext";
import type { Team } from "@/lib/api/team";

export default function MyTeamsPage() {
  const { user } = useUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState<Team | null>(null);
  const [performing, setPerforming] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", level: "", sport: "", maxPlayers: 0, phone: "" });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadTeams = async () => {
    const res = await handleGetMyTeams();
    if (res.success) setTeams(res.data as Team[]);
  };

  useEffect(() => {
    (async () => {
      await loadTeams();
      setLoading(false);
    })();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.phone.trim()) return;

    setCreating(true);
    setFormError(null);

    const result = await handleCreateTeam(form);
    if (result.success) {
      setShowCreateModal(false);
      setForm({ name: "", location: "", level: "", sport: "", maxPlayers: 0, phone: "" });
      await loadTeams();
    } else {
      setFormError(result.message);
    }

    setCreating(false);
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
            <h3 className="mt-4 text-lg font-semibold text-gray-800">You&apos;re not part of any teams yet</h3>
            <p className="mt-1 text-sm text-gray-500">Join an existing team or create your own</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/teams"
                className="inline-flex items-center gap-2 rounded-full bg-[#121A2A] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg"
              >
                Browse Teams
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Create Team
              </button>
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
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Team</h2>
              <button onClick={() => setShowCreateModal(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter team name"
                  required
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sport</label>
                <select
                  value={form.sport}
                  onChange={(e) => setForm({ ...form, sport: e.target.value })}
                  required
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select sport</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="City or area"
                  required
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 9841234567"
                  required
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Players Needed (max 10)</label>
                <select
                  value={form.maxPlayers}
                  onChange={(e) => setForm({ ...form, maxPlayers: Number(e.target.value) })}
                  required
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select players needed</option>
                  {[2,3,4,5,6,7,8,9,10].map((n) => (
                    <option key={n} value={n}>{n} players</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  required
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {formError && (
                <p className="text-sm text-red-600">{formError}</p>
              )}

              <button
                type="submit"
                disabled={creating || !form.name.trim() || !form.location.trim() || !form.sport || !form.level || !form.maxPlayers || !form.phone.trim()}
                className="w-full rounded-xl bg-[#121A2A] py-3 font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Team"}
              </button>
            </form>
          </div>
        </div>
      )}

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
                    setTeams((prev) => prev.filter((t) => t._id !== actionTarget._id));
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
