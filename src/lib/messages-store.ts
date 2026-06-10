import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDataDir } from "./data-dir";

export interface StoredMessage {
  id: string;
  fromEmail: string;
  toEmail: string;
  text: string;
  createdAt: string;
  readAt?: string;
}

const DATA_DIR = getDataDir();
const FILE = path.join(DATA_DIR, "messages.json");

async function ensureFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf8");
  } catch {
    await writeFile(FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<StoredMessage[]> {
  await ensureFile();
  const raw = await readFile(FILE, "utf8");
  try {
    return JSON.parse(raw) as StoredMessage[];
  } catch {
    return [];
  }
}

async function writeAll(messages: StoredMessage[]) {
  await ensureFile();
  await writeFile(FILE, JSON.stringify(messages, null, 2), "utf8");
}

function norm(email: string) {
  return email.toLowerCase().trim();
}

function threadParticipants(a: string, b: string): [string, string] {
  const pair = [norm(a), norm(b)].sort();
  return [pair[0], pair[1]];
}

export function conversationId(a: string, b: string): string {
  const [x, y] = threadParticipants(a, b);
  return `${x}|${y}`;
}

export async function getThreadMessages(
  viewerEmail: string,
  withEmail: string
): Promise<StoredMessage[]> {
  const viewer = norm(viewerEmail);
  const other = norm(withEmail);
  const all = await readAll();
  return all
    .filter(
      (m) =>
        (norm(m.fromEmail) === viewer && norm(m.toEmail) === other) ||
        (norm(m.fromEmail) === other && norm(m.toEmail) === viewer)
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function sendMessage(input: {
  fromEmail: string;
  toEmail: string;
  text: string;
}): Promise<StoredMessage> {
  const text = input.text.trim();
  if (!text) throw new Error("Message text is required");

  const message: StoredMessage = {
    id: randomUUID(),
    fromEmail: norm(input.fromEmail),
    toEmail: norm(input.toEmail),
    text,
    createdAt: new Date().toISOString(),
  };

  const all = await readAll();
  all.push(message);
  await writeAll(all);
  return message;
}

export async function markThreadRead(
  viewerEmail: string,
  withEmail: string
): Promise<void> {
  const viewer = norm(viewerEmail);
  const other = norm(withEmail);
  const now = new Date().toISOString();
  const all = await readAll();
  let changed = false;

  for (const m of all) {
    if (
      norm(m.fromEmail) === other &&
      norm(m.toEmail) === viewer &&
      !m.readAt
    ) {
      m.readAt = now;
      changed = true;
    }
  }

  if (changed) await writeAll(all);
}

export interface ConversationSummary {
  withEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export async function listConversations(
  viewerEmail: string
): Promise<ConversationSummary[]> {
  const viewer = norm(viewerEmail);
  const all = await readAll();
  const relevant = all.filter(
    (m) => norm(m.fromEmail) === viewer || norm(m.toEmail) === viewer
  );

  const byOther = new Map<string, StoredMessage[]>();
  for (const m of relevant) {
    const other =
      norm(m.fromEmail) === viewer ? norm(m.toEmail) : norm(m.fromEmail);
    const list = byOther.get(other) ?? [];
    list.push(m);
    byOther.set(other, list);
  }

  const summaries: ConversationSummary[] = [];
  for (const [other, msgs] of byOther) {
    const sorted = [...msgs].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    const latest = sorted[0];
    summaries.push({
      withEmail: other,
      lastMessage: latest.text,
      lastMessageAt: latest.createdAt,
      unreadCount: msgs.filter(
        (m) => norm(m.fromEmail) === other && norm(m.toEmail) === viewer && !m.readAt
      ).length,
    });
  }

  return summaries.sort((a, b) =>
    b.lastMessageAt.localeCompare(a.lastMessageAt)
  );
}
