"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { handleCreateTeam } from "@/lib/actions/team-action";
import Link from "next/link";

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Professional"] as const;

export default function CreateTeamPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [preferredVenue, setPreferredVenue] = useState("");
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(1);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSkillLevel = (level: string) => {
    setSkillLevel((prev) => (prev === level ? null : level));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    if (!/^\d{10}$/.test(phone.trim())) {
      setPhoneErr("Phone number must be exactly 10 digits");
      return;
    }
    setPhoneErr("");

    setCreating(true);
    setError(null);

    const result = await handleCreateTeam({
      name: name.trim(),
      description: description.trim() || undefined,
      location: location.trim(),
      level: skillLevel || undefined,
      maxPlayers,
      phone: phone.trim(),
      preferredVenue: preferredVenue || undefined,
    });

    if (result.success) {
      router.push("/users/my-teams");
    } else {
      setError(result.message);
    }

    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-full px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create a New Team</h1>
            <p className="mt-1 text-gray-500">Fill in the details to create your futsal team</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your team name"
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Team Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell potential players about your team"
                rows={3}
                className="mt-1 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where does your team usually play?"
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Venue</label>
              <input
                type="text"
                value={preferredVenue}
                onChange={(e) => setPreferredVenue(e.target.value)}
                placeholder="e.g. Futsal Arena, Sports Complex"
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">Optional: Where does your team usually play?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skill Level</label>
              <p className="mt-0.5 text-xs text-gray-400">Optional</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleSkillLevel(level)}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      skillLevel === level
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-400">Click a selected button to deselect it</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneErr(""); }}
                placeholder="e.g. 9800000000"
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {phoneErr && <p className="mt-1 text-xs text-red-500">{phoneErr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Players Needed</label>
              <select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3">
              <Link
                href="/users/my-teams"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={creating || !name.trim() || !/^\d{10}$/.test(phone.trim())}
                className="flex-1 rounded-xl bg-[#121A2A] px-4 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
