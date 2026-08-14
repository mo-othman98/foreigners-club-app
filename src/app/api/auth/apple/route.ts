import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { verifyAppleIdentityToken } from "@/lib/apple-auth";
import { loginOrRegisterApple } from "@/lib/auth-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const body = await request.json();
  const identityToken = (body.identityToken as string | undefined)?.trim();
  const fallbackEmail = (body.email as string | undefined)?.trim();
  const fallbackName = (body.name as string | undefined)?.trim();

  if (!identityToken) {
    return NextResponse.json(
      { error: "Apple identity token is required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const claims = await verifyAppleIdentityToken(identityToken);
    const email = claims.email ?? fallbackEmail;
    if (!email) {
      throw new Error(
        "Apple did not share an email for this sign-in. Try again and allow email access."
      );
    }

    const emailVerified =
      claims.email_verified === true ||
      claims.email_verified === "true" ||
      Boolean(email);

    const result = await loginOrRegisterApple({
      email,
      name: fallbackName ?? email.split("@")[0],
      appleId: claims.sub,
      emailVerified,
    });

    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Apple sign-in failed";
    return NextResponse.json({ error: msg }, { status: 401, headers: CORS_HEADERS });
  }
}
