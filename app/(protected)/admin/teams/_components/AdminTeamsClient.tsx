"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Trophy, RefreshCw, Trash2, Loader2, AlertCircle, Users } from "lucide-react";
import { Team } from "@/lib/api/team";
import { PaginationMeta } from "@/lib/api/admin";
import {
    handleAdminGetTeams,
    handleAdminDeleteTeam,
} from "@/lib/actions/admin-action";

const DEFAULT_META: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 0 };

export default function AdminTeamsClient() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const fetchTeams = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const result = await handleAdminGetTeams({ page, limit: 10, search: debouncedSearch || undefined });
        if (result.success) {
            setTeams(result.data ?? []);
            setMeta(result.meta ?? DEFAULT_META);
        } else {
            setError(result.message ?? "Failed to fetch teams");
        }
        setIsLoading(false);
    }, [page, debouncedSearch]);

    useEffect(() => { fetchTeams(); }, [fetchTeams]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this team?")) return;
        const result = await handleAdminDeleteTeam(id);
        if (result.success) {
            if (teams.length === 1 && page > 1) setPage(page - 1);
            else fetchTeams();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600">
                        <Trophy size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                        <p className="text-sm text-gray-500">Manage all teams — view and remove listings.</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-white shadow-sm border border-gray-100">
                    <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name, sport, or location…"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <button
                            onClick={fetchTeams}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Loader2 size={32} className="animate-spin mb-3" />
                                <p className="text-sm">Loading teams…</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 text-red-500">
                                <AlertCircle size={32} className="mb-3" />
                                <p className="text-sm font-medium">{error}</p>
                                <button onClick={fetchTeams} className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors">Try again</button>
                            </div>
                        ) : teams.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Trophy size={40} className="mb-3 opacity-30" />
                                <p className="text-sm font-medium text-gray-500">
                                    {debouncedSearch ? `No teams match "${debouncedSearch}"` : "No teams yet"}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Team</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Sport</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Members</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {teams.map(team => (
                                        <tr key={team._id} className="group hover:bg-orange-50/30 transition-colors">
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {team.avatar ? (
                                                        <img src={team.avatar} alt={team.name} className="h-10 w-10 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                                            <Trophy size={16} />
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-medium text-gray-900">{team.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-sm text-gray-600">{team.sport}</td>
                                            <td className="px-4 py-3.5 text-sm text-gray-600">{team.location}</td>
                                            <td className="px-4 py-3.5">
                                                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                                    <Users size={14} /> {team.members}/{team.maxPlayers}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDelete(team._id)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                                                        title="Delete team"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {!isLoading && !error && meta.totalPages > 1 && (
                        <div className="border-t border-gray-100 p-4 flex items-center justify-center gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-500">Page {meta.page} of {meta.totalPages}</span>
                            <button
                                disabled={page >= meta.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
