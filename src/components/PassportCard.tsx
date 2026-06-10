import type { PassportData } from "@/types";
import { POPULAR_COUNTRIES } from "@/lib/mock-data";

function flagForCountry(name: string): string {
  const match = POPULAR_COUNTRIES.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  return match?.flag ?? "🌍";
}

function TagList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400 italic">{empty}</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-white/90"
        >
          {flagForCountry(item)} {item}
        </span>
      ))}
    </div>
  );
}

export default function PassportCard({ data }: { data: PassportData }) {
  const hasData = Boolean(data.name && data.nationality);

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 16px)",
        }}
      />

      <div className="relative p-6 text-white">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-300/80">
              Digital Passport
            </p>
            <p className="mt-1 text-xs text-white/50">Foreigners Club · ID Document</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Status
            </p>
            <p className="text-xs font-medium text-emerald-300">
              {hasData ? "Active" : "Draft"}
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-16 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-4xl">
            {hasData ? flagForCountry(data.nationality) : "📘"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Full Name
            </p>
            <p className="truncate text-xl font-semibold tracking-tight">
              {data.name || "Your Name"}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {data.nationality
                ? `${flagForCountry(data.nationality)} ${data.nationality}`
                : "Nationality"}
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Currently In
            </p>
            <p className="mt-1 text-sm font-medium">
              {data.currentCity && data.currentCountry
                ? `${data.currentCity}, ${data.currentCountry}`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Languages
            </p>
            <p className="mt-1 text-sm font-medium">
              {data.languages.length > 0
                ? data.languages.join(", ")
                : "—"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-[10px] uppercase tracking-widest text-white/40">
              Countries Lived
            </p>
            <TagList items={data.countriesLived} empty="None added yet" />
          </div>
          <div>
            <p className="mb-1.5 text-[10px] uppercase tracking-widest text-white/40">
              Countries Visited
            </p>
            <TagList items={data.countriesVisited} empty="None added yet" />
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="font-mono text-[9px] leading-relaxed tracking-wider text-white/25">
            FC&lt;{data.name ? data.name.toUpperCase().replace(/\s/g, "&lt;") : "NAME"}
            &lt;&lt;&lt;&lt;&lt;&lt;&lt;{data.nationality.slice(0, 3).toUpperCase() || "XXX"}
            &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </p>
        </div>
      </div>
    </div>
  );
}
