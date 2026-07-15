import { getUserData } from "@/lib/cookies";
import { redirect } from "next/navigation";
import DashboardClient from "./_components/DashboardClient";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
    const user = await getUserData();

    if (!user) redirect("/login");
    if (user.role === "admin") redirect("/admin/users");

    const name =
        user?.firstName ||
        user?.username ||
        user?.email ||
        "Player";

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* SIDEBAR */}
            <aside className="w-64 bg-[#071B2F] text-white flex flex-col">

                <div className="border-b border-white/10 p-6">
                    <Image
                        src="/khelhublogo_.png"
                        alt="KhelHub"
                        width={320}
                        height={140}
                        priority
                    />
                </div>

                <nav className="flex-1 py-6">
                    <ul className="space-y-2 px-4">

                        <li>
                            <Link
                                href="/dashboard"
                                className="block rounded-lg bg-blue-600 px-4 py-3 font-medium"
                            >
                                Dashboard
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/booking"
                                className="block rounded-lg px-4 py-3 transition hover:bg-white/10"
                            >
                                Booking
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/explore"
                                className="block rounded-lg px-4 py-3 transition hover:bg-white/10"
                            >
                                Explore
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/profile"
                                className="block rounded-lg px-4 py-3 transition hover:bg-white/10"
                            >
                                Profile
                            </Link>
                        </li>

                    </ul>
                </nav>

                <div className="border-t border-white/10 p-4">
                    <p className="text-xs text-gray-400">
                        KhelHub Dashboard
                    </p>
                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8">

                {/* HEADER */}
                <div className="mb-8 flex items-center justify-between">

                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Welcome back, {name}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white px-5 py-3 shadow-sm border">
                        <p className="font-semibold text-gray-800">
                            {user?.email}
                        </p>
                    </div>

                </div>

                {/* USER CARD */}
                <div className="rounded-2xl border bg-white p-8 shadow-sm">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">
                                Welcome Back
                            </p>

                            <h2 className="mt-3 text-4xl font-bold text-gray-900">
                                {name}
                            </h2>

                            <p className="mt-2 text-gray-600">
                                @{user?.username}
                            </p>

                            <p className="text-gray-600">
                                {user?.email}
                            </p>
                        </div>

                        <div>
                            <Image
                                src="/logo.png"
                                alt="KhelHub"
                                width={220}
                                height={100}
                            />
                        </div>

                    </div>

                </div>

                {/* ACTION CARDS */}
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    <Link
                        href="/settings/password"
                        className="rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <h3 className="text-xl font-bold">
                            Update Password
                        </h3>

                        <p className="mt-2 text-gray-600">
                            Change your password and improve account security.
                        </p>

                        <div className="mt-5 font-semibold text-blue-600">
                            Update →
                        </div>
                    </Link>

                </div>

                {/* CLIENT COMPONENT */}
                <div className="mt-10">
                    <DashboardClient />
                </div>

            </main>

        </div>
    );
}