import { NextResponse } from "next/server";
import { readFeedImage } from "@/lib/country-feed-store";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; postId: string }> }
) {
  const { slug, postId } = await params;
  const image = await readFeedImage(slug, postId);
  if (!image) {
    return new NextResponse(null, { status: 404, headers: CORS });
  }

  return new NextResponse(new Uint8Array(image.buffer), {
    headers: {
      ...CORS,
      "Content-Type": image.mime,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
