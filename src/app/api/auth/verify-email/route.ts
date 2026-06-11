import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { verifyEmailCode } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const user = await verifyEmailCode(body.email ?? "", body.code ?? "");
    return NextResponse.json({ user }, { headers: CORS_HEADERS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: msg }, { status: 400, headers: CORS_HEADERS });
  }
}
