import { NextResponse } from "next/server";
import {
  clearAllCountryChatMessages,
  clearCountryChatMessages,
} from "@/lib/country-chat-store";
import {
  dedupeMemberProfilesByNameKeepingEmail,
  deleteMemberProfilesByIds,
} from "@/lib/profiles-store";

function authorize(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("x-admin-secret")?.trim();
  return header === secret;
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const action = body.action as string | undefined;

  if (action === "dedupe-profiles") {
    const name = (body.name as string | undefined)?.trim();
    const keepEmail = (body.keepEmail as string | undefined)?.trim();
    if (!name || !keepEmail) {
      return NextResponse.json(
        { error: "name and keepEmail are required" },
        { status: 400 }
      );
    }
    const result = await dedupeMemberProfilesByNameKeepingEmail(name, keepEmail);
    return NextResponse.json({ ok: true, action, ...result });
  }

  if (action === "delete-profiles") {
    const ids = Array.isArray(body.ids) ? (body.ids as string[]) : [];
    const removed = await deleteMemberProfilesByIds(ids);
    return NextResponse.json({ ok: true, action, removed });
  }

  if (action === "clear-country-chat") {
    const slug = (body.countrySlug as string | undefined)?.trim();
    if (slug) {
      const removed = await clearCountryChatMessages(slug);
      return NextResponse.json({ ok: true, action, countrySlug: slug, removed });
    }
    const removed = await clearAllCountryChatMessages();
    return NextResponse.json({ ok: true, action, removed });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
