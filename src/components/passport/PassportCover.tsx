import { getFlag } from "@/lib/country-flags";
import { resolveCountryCode } from "@/lib/mock-data";
import type { PassportJournal } from "@/types/passport";

export default function PassportCover({
  journal,
  stampCount,
}: {
  journal: PassportJournal;
  stampCount: number;
}) {
  const hasName = Boolean(journal.name);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/20 bg-gradient-to-br from-slate-900 via-[#1a2744] to-slate-900 px-6 py-5 text-white shadow-xl">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 3px)",
        }}
      />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-11 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 text-2xl">
            {journal.nationality
              ? getFlag(resolveCountryCode(journal.nationality))
              : "📕"}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400/80">
              Travel Journal
            </p>
            <p className="text-lg font-semibold tracking-tight">
              {hasName ? journal.name : "Your Passport"}
            </p>
            <p className="text-xs text-white/50">
              {stampCount} passport stamp{stampCount !== 1 ? "s" : ""} collected
            </p>
          </div>
        </div>

        {journal.currentCountry && (
          <div className="hidden text-right sm:block">
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Currently
            </p>
            <p className="text-sm font-medium">
              {journal.currentCity
                ? `${journal.currentCity}, `
                : ""}
              {journal.currentCountry}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
