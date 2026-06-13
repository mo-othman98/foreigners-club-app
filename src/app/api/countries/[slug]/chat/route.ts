import { NextResponse } from "next/server";
import { ensureDataMaintenance } from "@/lib/data-maintenance";
import {
  getCountryChatMessages,
  postCountryChatMessage,
} from "@/lib/country-chat-store";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  await ensureDataMaintenance();
  const { slug } = await params;
  const since = new URL(request.url).searchParams.get("since") ?? undefined;
  const messages = await getCountryChatMessages(slug, since);
  return NextResponse.json({ messages }, { headers: CORS });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  try {
    const message = await postCountryChatMessage({
      countrySlug: slug,
      authorEmail: body.authorEmail ?? "",
      authorName: body.authorName ?? "Anonymous",
      text: body.text ?? "",
    });
    return NextResponse.json({ message }, { status: 201, headers: CORS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send message";
    return NextResponse.json({ error: msg }, { status: 400, headers: CORS });
  }
}
