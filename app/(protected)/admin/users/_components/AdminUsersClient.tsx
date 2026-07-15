"use client";
import { useState, useEffect, useCallback, useTransition } from "react";
import { Search, Plus, Pencil, Trash2, Users, RefreshCw, ShieldCheck, UserCircle2, AlertCircle, Loader2, LogOut } from "lucide-react";
import { AdminUser, PaginationMeta } from "@/lib/api/admin";
import {
    handleAdminGetUsers,
    handleAdminCreateUser,
    handleAdminUpdateUser,
    handleAdminDeleteUser,
} from "@/lib/actions/admin-action";
import { handleLogout } from "@/lib/actions/auth-action";
import UserFormModal from "./UserFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Pagination from "./Pagination";
import { useRouter } from "next/navigation";

type ModalState =
    | { type: "none" }
    | { type: "create" }
    | { type: "edit"; user: AdminUser }
    | { type: "delete"; user: AdminUser };

const DEFAULT_META: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 0 };

export default function AdminUsersClient() {
    const [users, setUsers]           = useState<AdminUser[]>([]);
    const [meta, setMeta]             = useState<PaginationMeta>(DEFAULT_META);
    const [search, setSearch]         = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage]             = useState(1);
    const [modal, setModal]           = useState<ModalState>({ type: "none" });
    const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);
    const [isLoading, setIsLoading]   = useState(true);
    const [error, setError]           = useState<string | null>(null);
    const [isSubmitting, startSubmit] = useTransition();
    const [isDeleting, startDelete]   = useTransition();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const result = await handleAdminGetUsers({ page, limit: 10, search: debouncedSearch || undefined });
        if (result.success) {
            setUsers(result.data ?? []);
            setMeta(result.meta ?? DEFAULT_META);
        } else {
            setError(result.message ?? "Failed to fetch users");
        }
        setIsLoading(false);
    }, [page, debouncedSearch]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // ── Logout ───────────────────────────────────────────────────────────────────
    const onLogout = async () => {
        setIsLoggingOut(true);
        await handleLogout();
        router.replace("/login");
    };

    // ── Handlers ────────────────────────────────────────────────────────────────
    const handleCreate = (data: any) => {
        startSubmit(async () => {
            const res = await handleAdminCreateUser(data);
            if (res.success) {
                showToast("User created successfully", true);
                setModal({ type: "none" });
                await fetchUsers();
            } else {
                showToast(res.message ?? "Failed to create user", false);
            }
        });
    };

    const handleUpdate = (data: any) => {
        if (modal.type !== "edit") return;
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        startSubmit(async () => {
            const res = await handleAdminUpdateUser(modal.user._id, payload);
            if (res.success) {
                showToast("User updated successfully", true);
                setModal({ type: "none" });
                await fetchUsers();
            } else {
                showToast(res.message ?? "Failed to update user", false);
            }
        });
    };

    const handleDelete = () => {
        if (modal.type !== "delete") return;
        startDelete(async () => {
            const res = await handleAdminDeleteUser(modal.user._id);
            if (res.success) {
                showToast("User deleted", true);
                setModal({ type: "none" });
                if (users.length === 1 && page > 1) setPage(page - 1);
                else await fetchUsers();
            } else {
                showToast(res.message ?? "Failed to delete user", false);
            }
        });
    };

    // ── UI Helpers ───────────────────────────────────────────────────────────────
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

    const RoleBadge = ({ role }: { role: "admin" | "user" }) =>
        role === "admin" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                <ShieldCheck size={10} /> Admin
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                <UserCircle2 size={10} /> User
            </span>
        );

    const Avatar = ({ user }: { user: AdminUser }) => {
        const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
        const colors = ["bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500"];
        const color  = colors[user._id.charCodeAt(user._id.length - 1) % colors.length];
        return user.profilePicture ? (
            <img src={user.profilePicture} alt={initials} className="h-8 w-8 rounded-full object-cover" />
        ) : (
            <div className={`${color} flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white`}>
                {initials}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
                        toast.ok ? "bg-emerald-600" : "bg-red-600"
                    }`}
                >
                    {toast.ok ? "✓" : "✕"} {toast.msg}
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                                <Users size={18} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        </div>
                        <p className="text-sm text-gray-500 ml-12">
                            Manage all user accounts — create, edit, and remove access.
                        </p>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        {isLoggingOut ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <LogOut size={14} />
                        )}
                        {isLoggingOut ? "Logging out…" : "Logout"}
                    </button>
                </div>

                {/* Card */}
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100">
                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name or email…"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchUsers}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                            </button>
                            <button
                                onClick={() => setModal({ type: "create" })}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={14} /> Add User
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Loader2 size={32} className="animate-spin mb-3" />
                                <p className="text-sm">Loading users…</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 text-red-500">
                                <AlertCircle size={32} className="mb-3" />
                                <p className="text-sm font-medium">{error}</p>
                                <button
                                    onClick={fetchUsers}
                                    className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Users size={40} className="mb-3 opacity-30" />
                                <p className="text-sm font-medium text-gray-500">
                                    {debouncedSearch ? `No users match "${debouncedSearch}"` : "No users yet"}
                                </p>
                                {!debouncedSearch && (
                                    <button
                                        onClick={() => setModal({ type: "create" })}
                                        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Create your first user
                                    </button>
                                )}
                            </div>
                        ) : (
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Created</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map(user => (
                                        <tr key={user._id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar user={user} />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-400">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-4 py-3.5">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-4 py-3.5 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setModal({ type: "edit", user })}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                        title="Edit user"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setModal({ type: "delete", user })}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                                                        title="Delete user"
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

                    {/* Pagination */}
                    {!isLoading && !error && meta.totalPages > 1 && (
                        <div className="border-t border-gray-100 p-4">
                            <Pagination meta={meta} onPageChange={setPage} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {modal.type === "create" && (
                <UserFormModal
                    mode="create"
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreate}
                    onClose={() => setModal({ type: "none" })}
                />
            )}
            {modal.type === "edit" && (
                <UserFormModal
                    mode="edit"
                    user={modal.user}
                    isSubmitting={isSubmitting}
                    onSubmit={handleUpdate}
                    onClose={() => setModal({ type: "none" })}
                />
            )}
            {modal.type === "delete" && (
                <DeleteConfirmModal
                    user={modal.user}
                    isDeleting={isDeleting}
                    onConfirm={handleDelete}
                    onClose={() => setModal({ type: "none" })}
                />
            )}
        </div>
    );
}