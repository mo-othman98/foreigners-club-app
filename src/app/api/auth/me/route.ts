import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { getUserBySessionToken } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const user = await getUserBySessionToken(token);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json({ user }, { headers: CORS_HEADERS });
}
