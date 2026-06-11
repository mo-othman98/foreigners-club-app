import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { loginOrRegisterGoogle } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

async function verifyGoogleIdToken(idToken: string) {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );
  if (!res.ok) throw new Error("Invalid Google sign-in");
  const data = (await res.json()) as {
    email?: string;
    name?: string;
    sub?: string;
    aud?: string;
    email_verified?: string;
  };

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (clientId && data.aud !== clientId) {
    throw new Error("Google client mismatch");
  }

  if (!data.email || !data.sub) {
    throw new Error("Google account missing email");
  }

  return {
    email: data.email,
    name: data.name ?? data.email.split("@")[0],
    googleId: data.sub,
    emailVerified: data.email_verified === "true",
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const idToken = (body.idToken as string | undefined)?.trim();
  if (!idToken) {
    return NextResponse.json(
      { error: "Google id token is required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const profile = await verifyGoogleIdToken(idToken);
    const result = await loginOrRegisterGoogle(profile);
    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Google sign-in failed";
    return NextResponse.json({ error: msg }, { status: 401, headers: CORS_HEADERS });
  }
}
