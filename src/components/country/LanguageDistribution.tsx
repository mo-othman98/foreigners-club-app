import type { LanguageDistribution as LangDist } from "@/types/country";

export default function LanguageDistributionSection({
  countryName,
  distribution,
  recommended,
}: {
  countryName: string;
  distribution: LangDist[];
  recommended?: string[];
}) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">
        Language Distribution
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        In {countryName}, how likely is a foreigner to communicate using each
        language — not census data, but practical daily ability.
      </p>

      <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        {distribution.map((lang) => (
          <div key={lang.language}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-slate-800">
                {lang.language}
              </span>
              <span className="text-xs text-slate-400">{lang.note}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-500 transition-all"
                style={{ width: `${lang.communicability}%` }}
              />
            </div>
          </div>
        ))}

        {recommended && recommended.length > 0 && (
          <div className="mt-4 rounded-xl bg-teal-50/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
              Learn in this order
            </p>
            <p className="mt-1 text-sm font-medium text-teal-900">
              {recommended.join(" → ")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
