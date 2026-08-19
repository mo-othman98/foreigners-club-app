import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDataDir } from "./data-dir";

export type ReportReason =
  | "spam"
  | "harassment"
  | "hate_speech"
  | "inappropriate_content"
  | "fake_profile"
  | "other";

export interface ModerationReport {
  id: string;
  reporterEmail: string;
  reportedEmail: string;
  reportedName: string;
  reason: ReportReason;
  details?: string;
  context: "profile" | "chat" | "message";
  contentId?: string;
  contentText?: string;
  resolved: boolean;
  createdAt: string;
}

export interface BlockEntry {
  blockerEmail: string;
  blockedEmail: string;
  createdAt: string;
}

const DATA_DIR = getDataDir();
const REPORTS_FILE = path.join(DATA_DIR, "moderation-reports.json");
const BLOCKS_FILE = path.join(DATA_DIR, "moderation-blocks.json");

async function ensureFile(file: string) {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(file, "utf8");
  } catch {
    await writeFile(file, "[]", "utf8");
  }
}

async function readReports(): Promise<ModerationReport[]> {
  await ensureFile(REPORTS_FILE);
  try {
    return JSON.parse(await readFile(REPORTS_FILE, "utf8")) as ModerationReport[];
  } catch {
    return [];
  }
}

async function readBlocks(): Promise<BlockEntry[]> {
  await ensureFile(BLOCKS_FILE);
  try {
    return JSON.parse(await readFile(BLOCKS_FILE, "utf8")) as BlockEntry[];
  } catch {
    return [];
  }
}

function norm(email: string) {
  return email.toLowerCase().trim();
}

export async function createReport(input: {
  reporterEmail: string;
  reportedEmail: string;
  reportedName: string;
  reason: ReportReason;
  details?: string;
  context: "profile" | "chat" | "message";
  contentId?: string;
  contentText?: string;
}): Promise<ModerationReport> {
  const reports = await readReports();

  const report: ModerationReport = {
    id: randomUUID(),
    reporterEmail: norm(input.reporterEmail),
    reportedEmail: norm(input.reportedEmail),
    reportedName: input.reportedName,
    reason: input.reason,
    details: input.details?.trim().slice(0, 500),
    context: input.context,
    contentId: input.contentId,
    contentText: input.contentText?.trim().slice(0, 500),
    resolved: false,
    createdAt: new Date().toISOString(),
  };

  reports.push(report);
  await writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf8");
  return report;
}

export async function listReports(onlyUnresolved = false): Promise<ModerationReport[]> {
  const reports = await readReports();
  return onlyUnresolved ? reports.filter((r) => !r.resolved) : reports;
}

export async function resolveReport(id: string): Promise<boolean> {
  const reports = await readReports();
  const idx = reports.findIndex((r) => r.id === id);
  if (idx < 0) return false;
  reports[idx].resolved = true;
  await writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf8");
  return true;
}

export async function blockUser(input: {
  blockerEmail: string;
  blockedEmail: string;
}): Promise<void> {
  const blocks = await readBlocks();
  const blocker = norm(input.blockerEmail);
  const blocked = norm(input.blockedEmail);

  const already = blocks.some(
    (b) => norm(b.blockerEmail) === blocker && norm(b.blockedEmail) === blocked
  );
  if (already) return;

  blocks.push({ blockerEmail: blocker, blockedEmail: blocked, createdAt: new Date().toISOString() });
  await writeFile(BLOCKS_FILE, JSON.stringify(blocks, null, 2), "utf8");
}

export async function unblockUser(input: {
  blockerEmail: string;
  blockedEmail: string;
}): Promise<void> {
  const blocks = await readBlocks();
  const blocker = norm(input.blockerEmail);
  const blocked = norm(input.blockedEmail);
  const next = blocks.filter(
    (b) => !(norm(b.blockerEmail) === blocker && norm(b.blockedEmail) === blocked)
  );
  await writeFile(BLOCKS_FILE, JSON.stringify(next, null, 2), "utf8");
}

export async function getBlockedEmailsForUser(blockerEmail: string): Promise<string[]> {
  const blocks = await readBlocks();
  const blocker = norm(blockerEmail);
  return blocks.filter((b) => norm(b.blockerEmail) === blocker).map((b) => b.blockedEmail);
}

export async function deleteUserModerationData(email: string): Promise<void> {
  const e = norm(email);
  const reports = await readReports();
  await writeFile(
    REPORTS_FILE,
    JSON.stringify(reports.filter((r) => r.reporterEmail !== e && r.reportedEmail !== e), null, 2),
    "utf8"
  );
  const blocks = await readBlocks();
  await writeFile(
    BLOCKS_FILE,
    JSON.stringify(blocks.filter((b) => norm(b.blockerEmail) !== e && norm(b.blockedEmail) !== e), null, 2),
    "utf8"
  );
}
