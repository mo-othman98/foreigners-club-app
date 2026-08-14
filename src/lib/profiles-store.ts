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

export async function deleteMemberProfilesByEmail(email: string): Promise<number> {
  const target = email.toLowerCase().trim();
  if (!target) return 0;
  const all = await readAll();
  const next = all.filter((p) => p.email.toLowerCase().trim() !== target);
  const removed = all.length - next.length;
  if (removed > 0) await writeAll(next);
  return removed;
}

export async function deleteMemberProfilesByIds(ids: string[]): Promise<number> {
  const drop = new Set(ids.map((id) => id.trim()).filter(Boolean));
  if (drop.size === 0) return 0;
  const all = await readAll();
  const next = all.filter((p) => !drop.has(p.id));
  const removed = all.length - next.length;
  if (removed > 0) await writeAll(next);
  return removed;
}

/** Keep one profile for an email; remove other profiles with the same display name. */
export async function dedupeMemberProfilesByNameKeepingEmail(
  name: string,
  keepEmail: string
): Promise<{ removed: number; keptId?: string }> {
  const targetName = name.trim().toLowerCase();
  const keep = keepEmail.toLowerCase().trim();
  const all = await readAll();
  const matches = all.filter((p) => p.name.trim().toLowerCase() === targetName);
  const keepProfile =
    matches.find((p) => p.email.toLowerCase().trim() === keep) ??
    matches.sort((a, b) => {
      const aTime = a.updatedAt ?? a.createdAt;
      const bTime = b.updatedAt ?? b.createdAt;
      return bTime.localeCompare(aTime);
    })[0];

  if (!keepProfile) return { removed: 0 };

  const removeIds = matches
    .filter((p) => p.id !== keepProfile.id)
    .map((p) => p.id);
  const removed = await deleteMemberProfilesByIds(removeIds);
  return { removed, keptId: keepProfile.id };
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
