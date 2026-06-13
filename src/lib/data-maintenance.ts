import { readFile, writeFile } from "fs/promises";
import path from "path";
import { clearAllCountryChatMessages } from "./country-chat-store";
import { getDataDir } from "./data-dir";
import { dedupeMemberProfilesByNameKeepingEmail } from "./profiles-store";

const FLAG = path.join(getDataDir(), ".maintenance-2026-06-13.json");

let running: Promise<void> | null = null;

async function runOnce() {
  try {
    await readFile(FLAG, "utf8");
    return;
  } catch {
    // not run yet
  }

  await dedupeMemberProfilesByNameKeepingEmail("Moody", "mo-othman98@hotmail.com");
  const chatRemoved = await clearAllCountryChatMessages();

  await writeFile(
    FLAG,
    JSON.stringify(
      {
        ranAt: new Date().toISOString(),
        dedupedName: "Moody",
        keepEmail: "mo-othman98@hotmail.com",
        chatRemoved,
      },
      null,
      2
    ),
    "utf8"
  );
}

/** Idempotent production cleanup — runs once per deployed data volume. */
export function ensureDataMaintenance() {
  if (!running) {
    running = runOnce().catch(() => {
      running = null;
    });
  }
  return running;
}
