import Link from "next/link";

const footerLinks = [
  { label: "About", href: "#" },
  { label: "Help", href: "#" },
  { label: "FAQs", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Venues", href: "/venues" },
  { label: "Teams", href: "/teams" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
        <div className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-gray-900">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-sm text-gray-400">&copy; 2026 KhelHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
