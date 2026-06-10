"use client";

import type { CountryInsightData } from "@/types";

function RatingBar({ rating }: { rating: number }) {
  const percent = (rating / 5) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-teal-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-slate-800">
        {rating.toFixed(1)}/5
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function CountryPanel({
  insight,
  onClose,
}: {
  insight: CountryInsightData;
  onClose: () => void;
}) {
  return (
    <aside className="flex h-full flex-col bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-teal-600">
            Foreigner Insights
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {insight.countryName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {insight.activeUserCount.toLocaleString()} foreigners here now
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close panel"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <Section title="What foreigners say">
          <div className="space-y-3">
            {insight.foreignerQuotes.map((quote, i) => (
              <blockquote
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700"
              >
                <span className="text-teal-600">&ldquo;</span>
                {quote.replace(/^"|"$/g, "")}
                <span className="text-teal-600">&rdquo;</span>
              </blockquote>
            ))}
          </div>
        </Section>

        <Section title="Cost of living">
          <p className="text-sm leading-relaxed text-slate-700">
            {insight.costOfLiving}
          </p>
        </Section>

        <Section title="Friendliness rating">
          <p className="mb-2 text-sm text-slate-600">
            How welcoming locals feel to foreigners settling in
          </p>
          <RatingBar rating={insight.friendlinessRating} />
        </Section>

        <Section title="Language situation">
          <p className="text-sm leading-relaxed text-slate-700">
            {insight.languageSituation}
          </p>
        </Section>

        <Section title="Cultural tips">
          <ul className="space-y-2">
            {insight.culturalTips.map((tip, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                {tip}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Common mistakes foreigners make">
          <ul className="space-y-2">
            {insight.commonMistakes.map((mistake, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-slate-600"
              >
                <span className="text-amber-500">!</span>
                {mistake}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-xs leading-relaxed text-slate-400">
          This is lived experience data — not a travel guide. Insights reflect
          what it feels like to be a foreigner here.
        </p>
      </div>
    </aside>
  );
}
