import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDataDir } from "./data-dir";

export interface CountryChatMessage {
  id: string;
  countrySlug: string;
  authorEmail: string;
  authorName: string;
  text: string;
  createdAt: string;
}

const DATA_DIR = getDataDir();
const FILE = path.join(DATA_DIR, "country-chat.json");
const MAX_MESSAGES_PER_COUNTRY = 500;

async function ensureFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf8");
  } catch {
    await writeFile(FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<CountryChatMessage[]> {
  await ensureFile();
  const raw = await readFile(FILE, "utf8");
  try {
    return JSON.parse(raw) as CountryChatMessage[];
  } catch {
    return [];
  }
}

async function writeAll(messages: CountryChatMessage[]) {
  await ensureFile();
  await writeFile(FILE, JSON.stringify(messages, null, 2), "utf8");
}

function normSlug(slug: string) {
  return slug.toLowerCase().trim();
}

function normEmail(email: string) {
  return email.toLowerCase().trim();
}

export async function getCountryChatMessages(
  countrySlug: string,
  since?: string
): Promise<CountryChatMessage[]> {
  const slug = normSlug(countrySlug);
  const all = await readAll();
  let list = all
    .filter((m) => normSlug(m.countrySlug) === slug)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  if (since) {
    list = list.filter((m) => m.createdAt > since);
  }

  return list.slice(-200);
}

export async function postCountryChatMessage(input: {
  countrySlug: string;
  authorEmail: string;
  authorName: string;
  text: string;
}): Promise<CountryChatMessage> {
  const text = input.text.trim().slice(0, 500);
  if (!text) throw new Error("Message text is required");

  const message: CountryChatMessage = {
    id: randomUUID(),
    countrySlug: normSlug(input.countrySlug),
    authorEmail: normEmail(input.authorEmail || "anonymous@foreigners.club"),
    authorName: (input.authorName || "Anonymous").trim().slice(0, 80),
    text,
    createdAt: new Date().toISOString(),
  };

  const all = await readAll();
  all.push(message);

  const byCountry = new Map<string, CountryChatMessage[]>();
  for (const m of all) {
    const key = normSlug(m.countrySlug);
    const bucket = byCountry.get(key) ?? [];
    bucket.push(m);
    byCountry.set(key, bucket);
  }

  const trimmed: CountryChatMessage[] = [];
  for (const [, msgs] of byCountry) {
    const sorted = [...msgs].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    trimmed.push(...sorted.slice(-MAX_MESSAGES_PER_COUNTRY));
  }

  await writeAll(trimmed);
  return message;
}
