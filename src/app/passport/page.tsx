"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PassportJournal from "@/components/passport/PassportJournal";
import {
  loadJournalFromStorage,
  saveJournalToStorage,
} from "@/lib/passport-storage";
import type { PassportJournal as Journal } from "@/types/passport";
import { EMPTY_JOURNAL } from "@/types/passport";

export default function PassportPage() {
  const [journal, setJournal] = useState<Journal>(EMPTY_JOURNAL);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setJournal(loadJournalFromStorage());
    setMounted(true);
  }, []);

  function handleSave(data: Journal) {
    setJournal(data);
    saveJournalToStorage(data);
  }

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-[#f5f0e8] via-slate-50 to-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-700/80">
            Travel Journal
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Your Passport
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">
            A living record of everywhere you&apos;ve been, lived, and belong.
            Scroll through stamps collected across your life.
          </p>
        </div>

        <PassportJournal journal={journal} onSave={handleSave} />

        <div className="mt-12 text-center">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 transition hover:text-teal-800"
          >
            Explore the world map
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
