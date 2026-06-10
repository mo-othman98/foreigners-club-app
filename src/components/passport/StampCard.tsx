"use client";

import { getFlag } from "@/lib/country-flags";
import { getStampDesign } from "@/lib/stamp-designs";
import {
  STAMP_TYPE_STYLES,
  stampRotation,
} from "@/lib/passport-utils";
import { resolveCountryCode } from "@/lib/mock-data";
import type { PassportStamp } from "@/types/passport";
import { STAMP_TYPE_LABELS } from "@/types/passport";

interface StampCardProps {
  stamp: PassportStamp;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export default function StampCard({
  stamp,
  selected,
  compact,
  onClick,
}: StampCardProps) {
  const design = getStampDesign(stamp.country);
  const styles = STAMP_TYPE_STYLES[stamp.type];
  const flag = getFlag(resolveCountryCode(stamp.country));
  const rotation = stampRotation(stamp.id);

  const formatDate = (d: string) =>
    d === "—" ? "—" : d.length === 4 ? d : d.slice(0, 7);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group shrink-0 text-left transition-all ${
        compact ? "w-36" : "w-44 sm:w-48"
      } ${onClick ? "cursor-pointer" : "cursor-default"} ${
        selected ? "scale-105" : "hover:scale-[1.02]"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-lg border-2 border-dashed ${styles.border} ${styles.bg} p-3 shadow-md transition-shadow ${
          selected ? "shadow-xl ring-2 ring-teal-400/50" : "group-hover:shadow-lg"
        }`}
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `repeating-radial-gradient(${design.inkColor} 0 1px, transparent 1px 6px)`,
          }}
        />

        <div className="relative">
          <div className="mb-2 flex items-start justify-between">
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}
            >
              {styles.label}
            </span>
            <span className="text-lg" role="img" aria-hidden>
              {flag}
            </span>
          </div>

          <div
            className="mx-auto my-2 flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl font-bold"
            style={{
              borderColor: design.inkColor,
              color: design.inkColor,
              opacity: 0.85,
            }}
          >
            {design.symbol}
          </div>

          <p
            className="text-center text-xs font-bold uppercase tracking-wide"
            style={{ color: design.inkColor }}
          >
            {stamp.country}
          </p>

          {!compact && (
            <div className="mt-2 space-y-0.5 border-t border-dashed border-current/20 pt-2 text-[10px] text-slate-500">
              <p>
                <span className="font-semibold text-slate-600">In:</span>{" "}
                {formatDate(stamp.entryDate)}
              </p>
              {stamp.exitDate && (
                <p>
                  <span className="font-semibold text-slate-600">Out:</span>{" "}
                  {formatDate(stamp.exitDate)}
                </p>
              )}
              {stamp.cities.length > 0 && (
                <p className="truncate">
                  <span className="font-semibold text-slate-600">City:</span>{" "}
                  {stamp.cities.join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <p className="mt-2 text-center text-[10px] font-medium text-slate-400">
          {STAMP_TYPE_LABELS[stamp.type]}
        </p>
      )}
    </button>
  );
}
