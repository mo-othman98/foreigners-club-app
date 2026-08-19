import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { getUserBySessionToken } from "@/lib/auth-store";
import { blockUser, getBlockedEmailsForUser, unblockUser } from "@/lib/moderation-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** GET /api/moderation/block — list all emails blocked by the caller */
export async function GET(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const user = await getUserBySessionToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  const blocked = await getBlockedEmailsForUser(user.email);
  return NextResponse.json({ blocked }, { headers: CORS_HEADERS });
}

/** POST /api/moderation/block — block or unblock a user */
export async function POST(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const user = await getUserBySessionToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  const body = await request.json();
  const blockedEmail = (body.blockedEmail as string | undefined)?.trim();
  const action = (body.action as "block" | "unblock" | undefined) ?? "block";

  if (!blockedEmail) {
    return NextResponse.json({ error: "blockedEmail is required" }, { status: 400, headers: CORS_HEADERS });
  }

  if (blockedEmail === user.email) {
    return NextResponse.json({ error: "Cannot block yourself" }, { status: 400, headers: CORS_HEADERS });
  }

  if (action === "unblock") {
    await unblockUser({ blockerEmail: user.email, blockedEmail });
  } else {
    await blockUser({ blockerEmail: user.email, blockedEmail });
  }

  console.log(`[moderation] ${user.email} ${action}ed ${blockedEmail}`);
  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}
