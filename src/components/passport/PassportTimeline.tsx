"use client";

import { parseYear } from "@/lib/passport-utils";
import type { PassportStamp } from "@/types/passport";
import { STAMP_TYPE_LABELS } from "@/types/passport";
import { STAMP_TYPE_STYLES } from "@/lib/passport-utils";
import { getFlag } from "@/lib/country-flags";
import { resolveCountryCode } from "@/lib/mock-data";

export default function PassportTimeline({
  stamps,
  selectedId,
  onSelect,
}: {
  stamps: PassportStamp[];
  selectedId?: string | null;
  onSelect: (stamp: PassportStamp) => void;
}) {
  if (stamps.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        Your timeline will appear as you collect stamps
      </p>
    );
  }

  return (
    <div className="relative space-y-0 pl-8">
      <div className="absolute bottom-0 left-3 top-0 w-px bg-slate-200" />

      {stamps.map((stamp) => {
        const year = parseYear(stamp.entryDate) || "—";
        const styles = STAMP_TYPE_STYLES[stamp.type];
        const flag = getFlag(resolveCountryCode(stamp.country));
        const isSelected = selectedId === stamp.id;

        return (
          <button
            key={stamp.id}
            type="button"
            onClick={() => onSelect(stamp)}
            className={`relative w-full pb-8 text-left transition ${
              isSelected ? "opacity-100" : "opacity-90 hover:opacity-100"
            }`}
          >
            <div
              className={`absolute -left-5 top-1.5 h-3 w-3 rounded-full border-2 border-white ${
                isSelected ? "bg-teal-500 ring-2 ring-teal-200" : "bg-slate-300"
              }`}
            />

            <div
              className={`rounded-xl border p-4 transition ${
                isSelected
                  ? "border-teal-200 bg-teal-50/50 shadow-md"
                  : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold tracking-tight text-slate-300">
                    {year}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {STAMP_TYPE_LABELS[stamp.type]}
                  </p>
                </div>
                <span className="text-2xl" role="img" aria-hidden>
                  {flag}
                </span>
              </div>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {stamp.country}
              </p>

              {stamp.cities.length > 0 && (
                <p className="mt-1 text-sm text-slate-500">
                  {stamp.cities.join(", ")}
                </p>
              )}

              <span
                className={`mt-3 inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
              >
                {styles.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
