import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { resetPasswordWithCode } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  try {
    const result = await resetPasswordWithCode({
      email: String(body.email ?? ""),
      code: String(body.code ?? ""),
      password: String(body.password ?? ""),
    });
    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Reset failed";
    return NextResponse.json({ error: msg }, { status: 400, headers: CORS_HEADERS });
  }
}
