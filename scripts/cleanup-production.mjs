#!/usr/bin/env node
/**
 * Run maintenance against the deployed API.
 *
 *   ADMIN_SECRET=... node scripts/cleanup-production.mjs
 *
 * Optional env:
 *   API_URL — defaults to https://foreigners-club-api.onrender.com
 */

const API_URL =
  process.env.API_URL?.replace(/\/$/, "") ??
  "https://foreigners-club-api.onrender.com";
const ADMIN_SECRET = process.env.ADMIN_SECRET?.trim();

if (!ADMIN_SECRET) {
  console.error("Set ADMIN_SECRET to the value configured on Render.");
  process.exit(1);
}

async function cleanup(action, payload = {}) {
  const res = await fetch(`${API_URL}/api/admin/cleanup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Secret": ADMIN_SECRET,
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }
  return data;
}

async function main() {
  const dedupe = await cleanup("dedupe-profiles", {
    name: "Moody",
    keepEmail: "mo-othman98@hotmail.com",
  });
  console.log("Profiles deduped:", dedupe);

  const chat = await cleanup("clear-country-chat");
  console.log("Country chat cleared:", chat);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
