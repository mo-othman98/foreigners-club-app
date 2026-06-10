"use client";

import { useState } from "react";
import { getStampDesign } from "@/lib/stamp-designs";
import { getFlag } from "@/lib/country-flags";
import { resolveCountryCode } from "@/lib/mock-data";
import { STAMP_TYPE_STYLES } from "@/lib/passport-utils";
import type { PassportStamp } from "@/types/passport";
import { STAMP_TYPE_LABELS } from "@/types/passport";

export default function PassportBookView({
  stamps,
  holderName,
  onSelect,
}: {
  stamps: PassportStamp[];
  holderName: string;
  onSelect: (stamp: PassportStamp) => void;
}) {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);

  if (stamps.length === 0) {
    return (
      <div className="flex aspect-[3/4] max-h-[480px] items-center justify-center rounded-r-2xl border border-slate-200 bg-[#f5f0e6] shadow-inner">
        <p className="px-8 text-center text-sm text-slate-500">
          Empty pages waiting for your first stamp
        </p>
      </div>
    );
  }

  const stamp = stamps[page];
  const design = getStampDesign(stamp.country);
  const styles = STAMP_TYPE_STYLES[stamp.type];
  const flag = getFlag(resolveCountryCode(stamp.country));

  function goTo(next: number) {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => {
      setPage(next);
      setFlipping(false);
    }, 200);
  }

  return (
    <div className="mx-auto max-w-md">
      <div
        className={`relative aspect-[3/4] max-h-[520px] overflow-hidden rounded-r-2xl border-l-8 border-slate-800 bg-[#f5f0e6] shadow-2xl transition-opacity duration-200 ${
          flipping ? "opacity-60" : "opacity-100"
        }`}
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,0.03) 0%, transparent 8%)",
        }}
      >
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #8b7355 0 1px, transparent 1px 24px)",
          }}
        />

        <div className="relative flex h-full flex-col p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between border-b border-amber-900/10 pb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-900/50">
              Foreigners Club · Page {page + 1} of {stamps.length}
            </p>
            <p className="text-[10px] text-amber-900/40">{holderName || "—"}</p>
          </div>

          <button
            type="button"
            onClick={() => onSelect(stamp)}
            className="flex flex-1 flex-col items-center justify-center text-center transition hover:opacity-90"
          >
            <div
              className={`mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed text-5xl ${styles.border} ${styles.bg}`}
              style={{ color: design.inkColor }}
            >
              {design.symbol}
            </div>

            <span className="text-4xl" role="img" aria-hidden>
              {flag}
            </span>
            <h3
              className="mt-3 text-2xl font-bold uppercase tracking-wide"
              style={{ color: design.inkColor }}
            >
              {stamp.country}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-600">
              {STAMP_TYPE_LABELS[stamp.type]}
            </p>

            <div className="mt-6 w-full max-w-xs space-y-1 text-sm text-slate-600">
              <p>
                <span className="font-semibold">Entry:</span> {stamp.entryDate}
              </p>
              {stamp.exitDate && (
                <p>
                  <span className="font-semibold">Exit:</span> {stamp.exitDate}
                </p>
              )}
              {stamp.cities.length > 0 && (
                <p>
                  <span className="font-semibold">Places:</span>{" "}
                  {stamp.cities.join(", ")}
                </p>
              )}
            </div>

            {stamp.notes && (
              <p className="mt-4 max-w-xs text-sm italic leading-relaxed text-slate-500">
                &ldquo;{stamp.notes}&rdquo;
              </p>
            )}

            <p className="mt-6 text-[10px] text-slate-400">
              Photos — coming soon
            </p>
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, page - 1))}
          disabled={page === 0}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-30"
        >
          ← Previous
        </button>
        <span className="text-xs text-slate-400">
          Flip through your booklet
        </span>
        <button
          type="button"
          onClick={() => goTo(Math.min(stamps.length - 1, page + 1))}
          disabled={page === stamps.length - 1}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
