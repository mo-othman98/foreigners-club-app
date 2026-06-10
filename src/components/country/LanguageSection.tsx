import type { LanguagePhrase } from "@/types/country";

export default function LanguageSection({
  phrases,
}: {
  phrases: LanguagePhrase[];
}) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">
        Language Essentials
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        Phrases foreigners learn first — with pronunciation
      </p>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-4 py-3 font-semibold text-slate-600">English</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Local</th>
              <th className="hidden px-4 py-3 font-semibold text-slate-600 sm:table-cell">
                Pronunciation
              </th>
            </tr>
          </thead>
          <tbody>
            {phrases.map((phrase) => (
              <tr
                key={phrase.english}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="px-4 py-3.5 text-slate-600">{phrase.english}</td>
                <td className="px-4 py-3.5 font-medium text-slate-900">
                  {phrase.local}
                </td>
                <td className="hidden px-4 py-3.5 font-mono text-xs text-teal-700 sm:table-cell">
                  {phrase.pronunciation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
