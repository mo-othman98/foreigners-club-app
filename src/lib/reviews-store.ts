import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDataDir } from "./data-dir";

export interface StoredCountryReview {
  id: string;
  countrySlug: string;
  authorEmail: string;
  reviewerName: string;
  identityLabel: string;
  citizenships: string[];
  familyBackground?: string;
  heritageCountries: string[];
  yearsLived: string;
  citiesVisited: string[];
  text: string;
  overallScore?: number;
  ratings: {
    hospitality: number;
    abilityToMakeFriends: number;
    communication: number;
    locals: number;
    foreigners: number;
    costOfLiving: number;
    publicTransportation: number;
    workLifeBalance: number;
    activities: number;
    nightlife: number;
    localCrime: number;
    internationalReputation: number;
    architecture: number;
    bureaucracy: number;
    /** @deprecated legacy */
    friendliness?: number;
    cost?: number;
    safety?: number;
    languageAccessibility?: number;
    food?: number;
    fun?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

const DATA_DIR = getDataDir();
const FILE = path.join(DATA_DIR, "country-reviews.json");

async function ensureFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf8");
  } catch {
    await writeFile(FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<StoredCountryReview[]> {
  await ensureFile();
  const raw = await readFile(FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as StoredCountryReview[];
    return parsed.map((r) => ({
      ...r,
      authorEmail: r.authorEmail ?? "",
      citiesVisited: r.citiesVisited ?? [],
      familyBackground: r.familyBackground ?? "",
    }));
  } catch {
    return [];
  }
}

async function writeAll(reviews: StoredCountryReview[]) {
  await ensureFile();
  await writeFile(FILE, JSON.stringify(reviews, null, 2), "utf8");
}

export async function getReviewsForCountry(
  countrySlug: string
): Promise<StoredCountryReview[]> {
  const all = await readAll();
  return all
    .filter((r) => r.countrySlug === countrySlug)
    .sort((a, b) => {
      const aTime = a.updatedAt ?? a.createdAt;
      const bTime = b.updatedAt ?? b.createdAt;
      return bTime.localeCompare(aTime);
    });
}

export function findReviewByAuthor(
  reviews: StoredCountryReview[],
  countrySlug: string,
  authorEmail: string
): StoredCountryReview | undefined {
  const email = authorEmail.toLowerCase().trim();
  return reviews.find(
    (r) =>
      r.countrySlug === countrySlug &&
      r.authorEmail.toLowerCase().trim() === email
  );
}

export async function upsertReview(
  input: Omit<StoredCountryReview, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  }
): Promise<StoredCountryReview> {
  const all = await readAll();
  const email = input.authorEmail.toLowerCase().trim();
  const existingIdx = all.findIndex(
    (r) =>
      r.countrySlug === input.countrySlug &&
      r.authorEmail.toLowerCase().trim() === email
  );

  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const updated: StoredCountryReview = {
      ...all[existingIdx],
      ...input,
      id: all[existingIdx].id,
      createdAt: all[existingIdx].createdAt,
      updatedAt: now,
    };
    all[existingIdx] = updated;
    await writeAll(all);
    return updated;
  }

  const review: StoredCountryReview = {
    ...input,
    id: input.id ?? randomUUID(),
    createdAt: now,
  };
  all.unshift(review);
  await writeAll(all);
  return review;
}

export async function updateReviewById(
  id: string,
  patch: Partial<
    Omit<StoredCountryReview, "id" | "countrySlug" | "createdAt" | "authorEmail">
  >
): Promise<StoredCountryReview | null> {
  const all = await readAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const updated: StoredCountryReview = {
    ...all[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  await writeAll(all);
  return updated;
}
