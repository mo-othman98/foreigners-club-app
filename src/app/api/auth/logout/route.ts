import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { revokeSession } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (token) await revokeSession(token);
  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}
