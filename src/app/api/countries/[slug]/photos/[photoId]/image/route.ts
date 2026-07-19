import { NextResponse } from "next/server";
import { resolveCountryPhotoSource } from "@/lib/country-photos";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; photoId: string }> }
) {
  const { slug, photoId } = await params;
  const source = await resolveCountryPhotoSource(slug, photoId);

  if (!source) {
    return new NextResponse("Not found", { status: 404, headers: CORS });
  }

  try {
    const upstream = await fetch(source.url, {
      headers: source.headers,
      redirect: "follow",
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 24 * 7 },
    });

    if (!upstream.ok) {
      return new NextResponse("Upstream error", { status: 502, headers: CORS });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        ...CORS,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Failed to load image", { status: 502, headers: CORS });
  }
}
