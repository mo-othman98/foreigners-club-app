/** Comma-separated admin emails. Defaults to the app owner. */
export function adminEmails(): string[] {
  const raw =
    process.env.ADMIN_EMAILS?.trim() || "mo-othman98@hotmail.com";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase().trim());
}
