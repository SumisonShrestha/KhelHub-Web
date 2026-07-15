"use client";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { AdminUser } from "@/lib/api/admin";

interface DeleteConfirmModalProps {
    user: AdminUser;
    isDeleting: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export default function DeleteConfirmModal({
    user, isDeleting, onConfirm, onClose,
}: DeleteConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle size={16} className="text-red-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Delete User</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="text-sm text-gray-600">
                        You&apos;re about to permanently delete{" "}
                        <span className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                        </span>{" "}
                        ({user.email}). This action cannot be undone.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
                    >
                        {isDeleting && <Loader2 size={14} className="animate-spin" />}
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    );
}
