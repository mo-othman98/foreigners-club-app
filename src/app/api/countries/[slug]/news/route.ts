import { NextResponse } from "next/server";
import { getCountryNews } from "@/lib/country-news";

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
    const news = await getCountryNews(slug, countryName ?? undefined, { refresh });
    return NextResponse.json(news, { headers: CORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "News unavailable";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
