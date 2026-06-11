import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { signUpUser } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const result = await signUpUser({
      email: body.email ?? "",
      name: body.name ?? "",
      password: body.password ?? "",
    });
    return NextResponse.json(result, { status: 201, headers: CORS_HEADERS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Sign up failed";
    return NextResponse.json({ error: msg }, { status: 400, headers: CORS_HEADERS });
  }
}
