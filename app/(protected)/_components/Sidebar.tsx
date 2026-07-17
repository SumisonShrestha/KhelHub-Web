import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/venues", label: "Venues" },
  { href: "/profile", label: "Profile" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-[#071B2F] text-white flex flex-col">
      <div className="border-b border-white/10 p-6">
        <Image src="/khelhublogo_.png" alt="KhelHub" width={320} height={140} priority />
      </div>
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-lg px-4 py-3 font-medium transition hover:bg-white/10"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-gray-400">KhelHub</p>
      </div>
    </aside>
  );
}
