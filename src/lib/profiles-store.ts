import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDataDir } from "./data-dir";

export interface StoredMemberProfile {
  id: string;
  email: string;
  name: string;
  journal: Record<string, unknown>;
  profilePhotoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

const DATA_DIR = getDataDir();
const FILE = path.join(DATA_DIR, "member-profiles.json");

async function ensureFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf8");
  } catch {
    await writeFile(FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<StoredMemberProfile[]> {
  await ensureFile();
  const raw = await readFile(FILE, "utf8");
  try {
    return JSON.parse(raw) as StoredMemberProfile[];
  } catch {
    return [];
  }
}

async function writeAll(profiles: StoredMemberProfile[]) {
  await ensureFile();
  await writeFile(FILE, JSON.stringify(profiles, null, 2), "utf8");
}

export async function listMemberProfiles(): Promise<StoredMemberProfile[]> {
  const all = await readAll();
  return all
    .filter((p) => {
      const journal = p.journal as { onboardingComplete?: boolean };
      return journal?.onboardingComplete !== false && p.email && p.name;
    })
    .sort((a, b) => {
      const aTime = a.updatedAt ?? a.createdAt;
      const bTime = b.updatedAt ?? b.createdAt;
      return bTime.localeCompare(aTime);
    });
}

export async function upsertMemberProfile(input: {
  email: string;
  name: string;
  journal: Record<string, unknown>;
  profilePhotoUrl?: string;
}): Promise<StoredMemberProfile> {
  const all = await readAll();
  const email = input.email.toLowerCase().trim();
  const now = new Date().toISOString();
  const existingIdx = all.findIndex(
    (p) => p.email.toLowerCase().trim() === email
  );

  if (existingIdx >= 0) {
    const updated: StoredMemberProfile = {
      ...all[existingIdx],
      name: input.name.trim(),
      journal: input.journal,
      profilePhotoUrl:
        input.profilePhotoUrl ?? all[existingIdx].profilePhotoUrl,
      updatedAt: now,
    };
    all[existingIdx] = updated;
    await writeAll(all);
    return updated;
  }

  const profile: StoredMemberProfile = {
    id: randomUUID(),
    email,
    name: input.name.trim(),
    journal: input.journal,
    profilePhotoUrl: input.profilePhotoUrl,
    createdAt: now,
  };
  all.unshift(profile);
  await writeAll(all);
  return profile;
}
