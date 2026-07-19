import {
  SCORE_LABELS,
  categoryScoreTextClass,
  dimensionBarColor,
  dimensionBarValue,
  scoreColor,
  scoreRingColor,
} from "@/lib/country-score";
import type { ScoreDimensions } from "@/types/country";

export default function ForeignerScoreCard({
  score,
  dimensions,
  languageLabel,
}: {
  score: number;
  dimensions: ScoreDimensions;
  languageLabel?: string;
}) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <svg width="128" height="128" className="-rotate-90">
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="10"
            />
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              className={scoreRingColor(score)}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor(score)}`}>
              {score}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Score
            </span>
          </div>
        </div>

        <div className="w-full flex-1">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Foreigner Score
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            How foreigners rate living here — IMDb meets Nomad List
          </p>

          <div className="mt-5 space-y-3">
            {(Object.keys(dimensions) as Array<keyof ScoreDimensions>).map(
              (key) => {
                const raw = dimensions[key];
                const display = dimensionBarValue(key, raw);
                const isBureaucracy = key === "bureaucracyDifficulty";

                return (
                  <div key={key}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium text-slate-600">
                        {SCORE_LABELS[key]}
                      </span>
                      <span
                        className={
                          key === "languageAccessibility" && languageLabel
                            ? "text-slate-400"
                            : categoryScoreTextClass(display)
                        }
                      >
                        {key === "languageAccessibility" && languageLabel
                          ? languageLabel
                          : isBureaucracy
                            ? `${raw}/100 difficulty`
                            : `${display}/100`}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${dimensionBarColor(display)}`}
                        style={{ width: `${display}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
