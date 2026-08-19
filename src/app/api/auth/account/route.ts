import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { deleteUserAccount, getUserBySessionToken } from "@/lib/auth-store";
import { deleteProfilePhoto } from "@/lib/profile-photos";
import { deleteMemberProfilesByEmail } from "@/lib/profiles-store";
import { deleteUserModerationData } from "@/lib/moderation-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function DELETE(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const user = await getUserBySessionToken(token);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  try {
    const { email } = await deleteUserAccount(user.id);
    await deleteMemberProfilesByEmail(email);
    await deleteProfilePhoto(email);
    await deleteUserModerationData(email);
    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not delete account";
    return NextResponse.json({ error: msg }, { status: 500, headers: CORS_HEADERS });
  }
}
