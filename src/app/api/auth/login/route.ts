import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { loginUser } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const result = await loginUser({
      email: body.email ?? "",
      password: body.password ?? "",
    });
    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: msg }, { status: 401, headers: CORS_HEADERS });
  }
}
