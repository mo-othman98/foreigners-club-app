import { NextResponse } from "next/server";
import { readProfilePhoto } from "@/lib/profile-photos";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      { error: "email is required" },
      { status: 400, headers: CORS }
    );
  }

  const photo = await readProfilePhoto(email);
  if (!photo) {
    return new NextResponse(null, { status: 404, headers: CORS });
  }

  return new NextResponse(new Uint8Array(photo.buffer), {
    headers: {
      ...CORS,
      "Content-Type": photo.mime,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
