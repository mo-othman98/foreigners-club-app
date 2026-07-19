import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDataDir } from "./data-dir";

export type ScoreOverrideRatings = {
  hospitality?: number;
  abilityToMakeFriends?: number;
  communication?: number;
  locals?: number;
  foreigners?: number;
  costOfLiving?: number;
  publicTransportation?: number;
  workLifeBalance?: number;
  activities?: number;
  nightlife?: number;
  localCrime?: number;
  internationalReputation?: number;
  architecture?: number;
  /** Burden: higher = worse */
  bureaucracy?: number;
};

export interface CountryScoreOverride {
  slug: string;
  monthlyCostUsd?: number;
  ratings: ScoreOverrideRatings;
  updatedAt: string;
  updatedBy: string;
}

const DATA_DIR = getDataDir();
const FILE = path.join(DATA_DIR, "country-score-overrides.json");

async function ensureFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf8");
  } catch {
    await writeFile(FILE, "{}", "utf8");
  }
}

async function readAll(): Promise<Record<string, CountryScoreOverride>> {
  await ensureFile();
  const raw = await readFile(FILE, "utf8");
  try {
    return JSON.parse(raw) as Record<string, CountryScoreOverride>;
  } catch {
    return {};
  }
}

async function writeAll(data: Record<string, CountryScoreOverride>) {
  await ensureFile();
  await writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

function clampScore(n: unknown): number | undefined {
  if (typeof n !== "number" || Number.isNaN(n)) return undefined;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export async function getAllScoreOverrides(): Promise<
  Record<string, CountryScoreOverride>
> {
  return readAll();
}

export async function getScoreOverride(
  slug: string
): Promise<CountryScoreOverride | null> {
  const all = await readAll();
  return all[slug] ?? null;
}

export async function upsertScoreOverride(input: {
  slug: string;
  monthlyCostUsd?: number;
  ratings: ScoreOverrideRatings;
  updatedBy: string;
}): Promise<CountryScoreOverride> {
  const all = await readAll();
  const existing = all[input.slug];
  const ratings: ScoreOverrideRatings = { ...(existing?.ratings ?? {}) };

  for (const [key, value] of Object.entries(input.ratings)) {
    const clamped = clampScore(value);
    if (clamped !== undefined) {
      (ratings as Record<string, number>)[key] = clamped;
    }
  }

  const monthly =
    typeof input.monthlyCostUsd === "number" && !Number.isNaN(input.monthlyCostUsd)
      ? Math.max(0, Math.round(input.monthlyCostUsd))
      : existing?.monthlyCostUsd;

  const saved: CountryScoreOverride = {
    slug: input.slug,
    monthlyCostUsd: monthly,
    ratings,
    updatedAt: new Date().toISOString(),
    updatedBy: input.updatedBy,
  };
  all[input.slug] = saved;
  await writeAll(all);
  return saved;
}
