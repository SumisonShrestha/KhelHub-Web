"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/lib/api/admin";

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
    const { page, totalPages, total, limit } = meta;
    const start = (page - 1) * limit + 1;
    const end   = Math.min(page * limit, total);

    // Build visible page numbers with ellipsis
    const getPages = (): (number | "...")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | "...")[] = [1];
        if (page > 3) pages.push("...");
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    const btnBase =
        "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors";
    const btnActive = `${btnBase} bg-blue-600 text-white`;
    const btnDefault = `${btnBase} text-gray-600 hover:bg-gray-100`;
    const btnDisabled = `${btnBase} text-gray-300 cursor-not-allowed`;

    return (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-gray-500">
                Showing <span className="font-medium text-gray-700">{total === 0 ? 0 : start}–{end}</span>{" "}
                of <span className="font-medium text-gray-700">{total}</span> users
            </p>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className={page <= 1 ? btnDisabled : btnDefault}
                    aria-label="Previous page"
                >
                    <ChevronLeft size={14} />
                </button>

                {getPages().map((p, idx) =>
                    p === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-sm text-gray-400">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={p === page ? btnActive : btnDefault}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className={page >= totalPages ? btnDisabled : btnDefault}
                    aria-label="Next page"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
