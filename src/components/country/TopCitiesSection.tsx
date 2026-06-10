export default function TopCitiesSection({ cities }: { cities: string[] }) {
  if (cities.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900">
        Top Cities for Foreigners
      </h2>
      <div className="flex flex-wrap gap-2">
        {cities.map((city) => (
          <span
            key={city}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
          >
            {city}
          </span>
        ))}
      </div>
    </section>
  );
}
