import { NextResponse } from "next/server";
import { getCountryPhotos } from "@/lib/country-photos";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const countryName = url.searchParams.get("country") ?? undefined;
  const refresh = url.searchParams.get("refresh") === "1";

  try {
    const bundle = await getCountryPhotos(slug, countryName ?? undefined, {
      refresh,
    });
    return NextResponse.json(bundle, { headers: CORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Photos unavailable";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
