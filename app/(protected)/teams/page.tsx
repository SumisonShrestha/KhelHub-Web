"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Users, Trophy, X } from "lucide-react";
import { getTeams, type Team } from "@/lib/api/team";
import { handleCreateTeam, handleJoinTeam } from "@/lib/actions/team-action";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", level: "Beginner" });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [joining, setJoining] = useState<Set<string>>(new Set());
  const [joinedTeams, setJoinedTeams] = useState<Set<string>>(new Set());
  const [joinTarget, setJoinTarget] = useState<Team | null>(null);
  const [joinName, setJoinName] = useState("");
  const [joinMsg, setJoinMsg] = useState("");

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      setTeams(data);
    } catch {
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setCreating(true);
    setFormError(null);

    const result = await handleCreateTeam(form);
    if (result.success) {
      setShowModal(false);
      setForm({ name: "", location: "", level: "Beginner" });
      loadTeams();
    } else {
      setFormError(result.message);
    }

    setCreating(false);
  };

  const openJoinModal = (team: Team) => {
    setJoinTarget(team);
    setJoinName("");
    setJoinMsg("");
  };

  const handleJoinSubmit = async () => {
    if (!joinTarget) return;
    setJoining((prev) => new Set(prev).add(joinTarget._id));
    const result = await handleJoinTeam(joinTarget._id);
    if (result.success) {
      setJoinedTeams((prev) => new Set(prev).add(joinTarget._id));
    }
    setJoining((prev) => { const next = new Set(prev); next.delete(joinTarget._id); return next; });
    setJoinTarget(null);
  };

  const filtered = teams.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && !joinedTeams.has(t._id);
  });

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
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Create Team
            </button>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Team</h2>
              <button onClick={() => setShowModal(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
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
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="City or area"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
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
                disabled={creating || !form.name.trim()}
                className="w-full rounded-xl bg-[#121A2A] py-3 font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Team"}
              </button>
            </form>
          </div>
        </div>
      )}

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
                <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                <textarea
                  value={joinMsg}
                  onChange={(e) => setJoinMsg(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="mt-1 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleJoinSubmit}
                disabled={!joinName.trim() || joining.has(joinTarget._id)}
                className="w-full rounded-xl bg-[#121A2A] py-3 font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50"
              >
                {joining.has(joinTarget._id) ? "Sending Request..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Users size={16} />
            All Teams
          </button>
          <button
            onClick={() => setActiveTab("opponents")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
              activeTab === "opponents"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Trophy size={16} />
            Find Opponents
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
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
                  className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all hover:border-blue-200 hover:shadow-md"
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
                    {activeTab === "opponents" ? (
                      <button className="rounded-lg border border-blue-600 bg-white px-5 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50">
                        Challenge
                      </button>
                    ) : (
                      <button
                        onClick={() => openJoinModal(team)}
                        disabled={joining.has(team._id)}
                        className={`rounded-lg px-5 py-2 text-sm font-medium shadow transition ${
                          joinedTeams.has(team._id)
                            ? "border border-green-500 bg-white text-green-600"
                            : "bg-[#121A2A] text-white hover:scale-105"
                        }`}
                      >
                        {joining.has(team._id) ? "Joining..." : joinedTeams.has(team._id) ? "View" : "Join Team"}
                      </button>
                    )}
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
