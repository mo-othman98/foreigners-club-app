import { createRemoteJWKSet, jwtVerify } from "jose";

const APPLE_JWKS = createRemoteJWKSet(
  new URL("https://appleid.apple.com/auth/keys")
);

export interface AppleIdTokenClaims {
  sub: string;
  email?: string;
  email_verified?: boolean | string;
  is_private_email?: boolean | string;
}

export async function verifyAppleIdentityToken(
  identityToken: string
): Promise<AppleIdTokenClaims> {
  const clientId =
    process.env.APPLE_CLIENT_ID ?? "com.foreignersclub.app";

  const { payload } = await jwtVerify(identityToken, APPLE_JWKS, {
    issuer: "https://appleid.apple.com",
    audience: clientId,
  });

  const sub = payload.sub;
  if (!sub) throw new Error("Apple sign-in missing user id");

  const email =
    typeof payload.email === "string" ? payload.email : undefined;

  return {
    sub,
    email,
    email_verified:
      typeof payload.email_verified === "boolean" ||
      typeof payload.email_verified === "string"
        ? payload.email_verified
        : undefined,
    is_private_email:
      typeof payload.is_private_email === "boolean" ||
      typeof payload.is_private_email === "string"
        ? payload.is_private_email
        : undefined,
  };
}
