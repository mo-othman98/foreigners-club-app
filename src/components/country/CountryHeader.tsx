import Link from "next/link";
import type { CountryPageData } from "@/types/country";
import { scoreColor } from "@/lib/country-score";

export default function CountryHeader({ country }: { country: CountryPageData }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative">
        <Link
          href="/explore"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
        >
          <span aria-hidden>←</span> All countries
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-5">
            <span className="text-6xl sm:text-7xl" role="img" aria-label={`${country.countryName} flag`}>
              {country.flag}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300/80">
                Foreigner Knowledge Hub
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {country.countryName}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Stat
              label="Foreigner Rating"
              value={
                <span className={scoreColor(country.foreignerScore)}>
                  {(country.foreignerScore / 10).toFixed(1)} / 10
                </span>
              }
            />
            <Stat
              label="Reviews"
              value={country.reviewCount.toLocaleString()}
            />
            <Stat
              label="Members Here"
              value={country.membersCurrentlyHere.toLocaleString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-semibold">{value}</p>
    </div>
  );
}
