"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  computeEndorsements,
  computeTravelStats,
  sortStampsChronologically,
} from "@/lib/passport-utils";
import type { PassportJournal as Journal, PassportView } from "@/types/passport";
import type { PassportStamp } from "@/types/passport";
import PassportCover from "./PassportCover";
import StampScrollView from "./StampScrollView";
import PassportTimeline from "./PassportTimeline";
import PassportBookView from "./PassportBookView";
import TravelStats from "./TravelStats";
import PassportEndorsements from "./PassportEndorsements";
import StampDetailPanel from "./StampDetailPanel";
import JournalEditor from "./JournalEditor";

const PersonalPassportMap = dynamic(
  () => import("./PersonalPassportMap"),
  { ssr: false, loading: () => <div className="h-56 animate-pulse rounded-2xl bg-slate-100" /> }
);

const VIEW_TABS: { id: PassportView; label: string }[] = [
  { id: "scroll", label: "Stamp Scroll" },
  { id: "timeline", label: "Timeline" },
  { id: "book", label: "Booklet" },
];

interface PassportJournalProps {
  journal: Journal;
  onSave: (journal: Journal) => void;
}

export default function PassportJournal({
  journal,
  onSave,
}: PassportJournalProps) {
  const [view, setView] = useState<PassportView>("scroll");
  const [selectedStamp, setSelectedStamp] = useState<PassportStamp | null>(
    null
  );

  const sortedStamps = useMemo(
    () => sortStampsChronologically(journal.stamps),
    [journal.stamps]
  );

  const stats = useMemo(() => computeTravelStats(journal), [journal]);
  const endorsements = useMemo(
    () => computeEndorsements(journal, stats),
    [journal, stats]
  );

  function handleSelect(stamp: PassportStamp) {
    setSelectedStamp((prev) => (prev?.id === stamp.id ? null : stamp));
  }

  return (
    <div className="space-y-8">
      <PassportCover journal={journal} stampCount={stats.totalStamps} />

      <div className="flex flex-wrap gap-2">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              view === tab.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-[#faf8f4] to-white p-5 shadow-sm sm:p-6">
        {view === "scroll" && (
          <StampScrollView
            stamps={sortedStamps}
            selectedId={selectedStamp?.id}
            onSelect={handleSelect}
          />
        )}
        {view === "timeline" && (
          <PassportTimeline
            stamps={sortedStamps}
            selectedId={selectedStamp?.id}
            onSelect={handleSelect}
          />
        )}
        {view === "book" && (
          <PassportBookView
            stamps={sortedStamps}
            holderName={journal.name}
            onSelect={handleSelect}
          />
        )}
      </div>

      {selectedStamp && (
        <StampDetailPanel
          stamp={selectedStamp}
          onClose={() => setSelectedStamp(null)}
        />
      )}

      <PersonalPassportMap
        stamps={journal.stamps}
        highlightedCountry={selectedStamp?.country ?? null}
      />

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
          Travel Statistics
        </h3>
        <TravelStats stats={stats} />
      </div>

      <PassportEndorsements endorsements={endorsements} />

      <JournalEditor journal={journal} onSave={onSave} />
    </div>
  );
}
