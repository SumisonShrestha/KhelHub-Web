"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/lib/actions/auth-action";
import { useUser } from "@/context/UserContext";

export default function DashboardClient() {
    const [isPending, startTransition] = useTransition();
    const { setUser } = useUser();
    const router = useRouter();

    const onLogout = () => {
        startTransition(async () => {
            await handleLogout();
            setUser(null);
            router.push("/login");
        });
    };

    return (
        <div className="mt-10">
            <button
                onClick={onLogout}
                disabled={isPending}
                className="flex h-10 items-center border border-hairline px-6 text-xs font-bold uppercase tracking-[1.5px] text-body transition-colors hover:border-on-dark hover:text-on-dark disabled:opacity-50"
            >
                {isPending ? "Signing out…" : "Sign out"}
            </button>
        </div>
    );
}
