import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { requestPasswordReset } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  try {
    const result = await requestPasswordReset(String(body.email ?? ""));
    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not start reset";
    return NextResponse.json({ error: msg }, { status: 400, headers: CORS_HEADERS });
  }
}
