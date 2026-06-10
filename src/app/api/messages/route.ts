import { NextResponse } from "next/server";
import {
  getThreadMessages,
  listConversations,
  markThreadRead,
  sendMessage,
} from "@/lib/messages-store";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim();
  const withEmail = searchParams.get("with")?.trim();

  if (!email) {
    return NextResponse.json(
      { error: "email is required" },
      { status: 400, headers: CORS }
    );
  }

  if (withEmail) {
    const messages = await getThreadMessages(email, withEmail);
    return NextResponse.json({ messages }, { headers: CORS });
  }

  const conversations = await listConversations(email);
  return NextResponse.json({ conversations }, { headers: CORS });
}

export async function POST(request: Request) {
  const body = await request.json();
  const fromEmail = (body.fromEmail as string | undefined)?.trim();
  const toEmail = (body.toEmail as string | undefined)?.trim();
  const text = (body.text as string | undefined)?.trim();

  if (!fromEmail || !toEmail || !text) {
    return NextResponse.json(
      { error: "fromEmail, toEmail, and text are required" },
      { status: 400, headers: CORS }
    );
  }

  const message = await sendMessage({ fromEmail, toEmail, text });
  return NextResponse.json({ message }, { status: 201, headers: CORS });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const email = (body.email as string | undefined)?.trim();
  const withEmail = (body.withEmail as string | undefined)?.trim();

  if (!email || !withEmail) {
    return NextResponse.json(
      { error: "email and withEmail are required" },
      { status: 400, headers: CORS }
    );
  }

  await markThreadRead(email, withEmail);
  return NextResponse.json({ ok: true }, { headers: CORS });
}
