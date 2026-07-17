import Link from "next/link";

const cities = [
  { name: "Kathmandu", count: 5 },
  { name: "Lalitpur", count: 3 },
  { name: "Bhaktapur", count: 1 },
  { name: "Pokhara", count: 2 },
];

export default function PopularCities() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Popular Cities</h2>
          <p className="mt-1 text-gray-500">Discover venues in top locations</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={"/venues?city=" + city.name}
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#121A2A] text-2xl">
                🏟️
              </div>
              <h3 className="mt-4 font-bold text-gray-900 group-hover:text-blue-600">{city.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{city.count} venue{city.count > 1 ? "s" : ""}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-[#121A2A] p-8 text-center text-white shadow-lg md:p-12">
          <h3 className="text-2xl font-bold">List Your Venue</h3>
          <p className="mt-2 text-blue-100">Reach thousands of players and grow your business</p>
          <button className="mt-6 rounded-full bg-white px-8 py-3 font-semibold text-blue-700 transition hover:scale-105 hover:shadow-xl">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
