import { migrateToJournal } from "@/lib/passport-utils";
import type { PassportJournal } from "@/types/passport";
import { EMPTY_JOURNAL } from "@/types/passport";

const STORAGE_KEY = "foreigners-club-passport";

export function loadJournalFromStorage(): PassportJournal {
  if (typeof window === "undefined") return EMPTY_JOURNAL;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_JOURNAL;
    return migrateToJournal(JSON.parse(raw));
  } catch {
    return EMPTY_JOURNAL;
  }
}

export function saveJournalToStorage(data: PassportJournal): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
