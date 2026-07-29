/** Auth delivery / verification policy for production launches. */

export function isEmailDeliveryConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.AUTH_FROM_EMAIL?.trim()
  );
}

/**
 * When true, new signups must verify email before entering the app.
 * Defaults to on whenever Resend is configured; set
 * AUTH_REQUIRE_EMAIL_VERIFICATION=false to disable even with Resend.
 */
export function shouldRequireEmailVerification(): boolean {
  const explicit = process.env.AUTH_REQUIRE_EMAIL_VERIFICATION?.trim().toLowerCase();
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  return isEmailDeliveryConfigured();
}

export function passwordResetAvailable(): boolean {
  return isEmailDeliveryConfigured();
}

export function getAppReviewCredentials(): {
  email: string;
  password: string;
  name: string;
} | null {
  const email = process.env.APP_REVIEW_EMAIL?.trim().toLowerCase();
  const password = process.env.APP_REVIEW_PASSWORD?.trim();
  if (!email || !password || password.length < 8) return null;
  return {
    email,
    password,
    name: process.env.APP_REVIEW_NAME?.trim() || "App Reviewer",
  };
}
