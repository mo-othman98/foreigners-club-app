import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import {
  isEmailDeliveryConfigured,
  passwordResetAvailable,
  shouldRequireEmailVerification,
} from "@/lib/auth-config";
import { ensureAppReviewAccount } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** Public auth capabilities for the mobile client. */
export async function GET() {
  try {
    await ensureAppReviewAccount();
  } catch (err) {
    console.error("[auth] ensureAppReviewAccount failed:", err);
  }

  return NextResponse.json(
    {
      emailDeliveryConfigured: isEmailDeliveryConfigured(),
      emailVerificationRequired: shouldRequireEmailVerification(),
      passwordResetAvailable: passwordResetAvailable(),
    },
    { headers: CORS_HEADERS }
  );
}
