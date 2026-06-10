"use client";

import type { PassportStamp } from "@/types/passport";
import StampCard from "./StampCard";

export default function StampScrollView({
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
      <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
        <p className="text-sm text-slate-400">
          No stamps collected yet — add your first below
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-slate-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-slate-50 to-transparent" />

      <div
        className="flex gap-5 overflow-x-auto px-2 py-4 scrollbar-thin"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {stamps.map((stamp) => (
          <div key={stamp.id} style={{ scrollSnapAlign: "center" }}>
            <StampCard
              stamp={stamp}
              selected={selectedId === stamp.id}
              onClick={() => onSelect(stamp)}
            />
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400">
        Swipe through your travel history →
      </p>
    </div>
  );
}
