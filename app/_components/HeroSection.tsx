import { Search, MapPin, Zap } from "lucide-react";

const pills = [
  { label: "Near Me", icon: Zap },
  { label: "Today", icon: MapPin },
  { label: "Tomorrow", icon: MapPin },
  { label: "Evening", icon: MapPin },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#121A2A] px-4 py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
          Nepal&apos;s #1 Sports Booking Platform
        </div>

        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          Book Your
          <br />
          Perfect Pitch
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          Find and book futsal courts, join teams, and compete — all in one place.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {pills.map((pill) => {
            const Icon = pill.icon;
            return (
              <button
                key={pill.label}
                className="flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/25"
              >
                <Icon className="h-4 w-4" />
                {pill.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-xl">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for venues, cities..."
              className="flex-1 text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button className="rounded-xl bg-[#121A2A] px-6 py-2 text-sm font-semibold text-white transition hover:shadow-lg">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
