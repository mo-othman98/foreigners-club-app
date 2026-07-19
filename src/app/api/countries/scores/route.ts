import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { getAllScoreOverrides } from "@/lib/country-scores-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** Public: all admin score overrides for clients to merge into listings. */
export async function GET() {
  const overrides = await getAllScoreOverrides();
  return NextResponse.json({ overrides }, { headers: CORS_HEADERS });
}
