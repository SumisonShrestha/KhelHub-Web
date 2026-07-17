import Image from "next/image";
import Link from "next/link";

export default function SplashPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Image src="/logo.png" alt="KhelHub" width={500} height={80} priority className="mb-2" />
      <p className="text-2xl font-bold text-gray-900 mb-4 text-center">Book Your Game, Own the Moment.</p>
      <Image src="/gifyf.gif" alt="Loading animation" width={260} height={120} className="mb-10" />
      <Link
        href="/login"
        style={{ fontFamily: "'Arial Black', sans-serif" }}
        className="mt-8 bg-[#e8ff00] border-2 border-black px-16 py-5 text-black font-black text-lg tracking-widest uppercase rounded-full hover:opacity-90 transition-opacity"
      >
        Get Started
      </Link>
    </main>
  );
}
