"use client";

import Link from "next/link";
import { getFlag } from "@/lib/country-flags";
import { getCountrySlug } from "@/lib/passport-utils";
import { resolveCountryCode } from "@/lib/mock-data";
import { STAMP_TYPE_STYLES } from "@/lib/passport-utils";
import type { PassportStamp } from "@/types/passport";
import { STAMP_TYPE_LABELS } from "@/types/passport";

export default function StampDetailPanel({
  stamp,
  onClose,
}: {
  stamp: PassportStamp;
  onClose: () => void;
}) {
  const styles = STAMP_TYPE_STYLES[stamp.type];
  const flag = getFlag(resolveCountryCode(stamp.country));
  const slug = getCountrySlug(stamp.country);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-hidden>
            {flag}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {stamp.country}
            </h3>
            <span
              className={`mt-1 inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
            >
              {STAMP_TYPE_LABELS[stamp.type]}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Entry
          </p>
          <p className="font-medium text-slate-800">{stamp.entryDate}</p>
        </div>
        {stamp.exitDate && (
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Exit
            </p>
            <p className="font-medium text-slate-800">{stamp.exitDate}</p>
          </div>
        )}
      </div>

      {stamp.cities.length > 0 && (
        <p className="mt-3 text-sm text-slate-600">
          <span className="font-semibold">Places:</span>{" "}
          {stamp.cities.join(", ")}
        </p>
      )}

      {stamp.notes && (
        <blockquote className="mt-4 border-l-2 border-teal-300 pl-4 text-sm italic leading-relaxed text-slate-600">
          {stamp.notes}
        </blockquote>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/country/${slug}`}
          className="rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
        >
          Explore {stamp.country} hub
        </Link>
        <Link
          href={`/map?highlight=${slug}`}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View on world map
        </Link>
      </div>
    </div>
  );
}
