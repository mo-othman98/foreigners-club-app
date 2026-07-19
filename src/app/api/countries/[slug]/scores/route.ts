import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/api-cors";
import { isAdminEmail } from "@/lib/admin-auth";
import { getUserBySessionToken } from "@/lib/auth-store";
import {
  getScoreOverride,
  upsertScoreOverride,
  type ScoreOverrideRatings,
} from "@/lib/country-scores-store";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const override = await getScoreOverride(slug);
  return NextResponse.json(
    { override },
    { headers: CORS_HEADERS }
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const user = await getUserBySessionToken(token);

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json(
      { error: "Unauthorized — admin only" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  const { slug } = await params;
  const body = await request.json().catch(() => ({}));
  const ratings = (body.ratings ?? {}) as ScoreOverrideRatings;
  const monthlyCostUsd =
    typeof body.monthlyCostUsd === "number" ? body.monthlyCostUsd : undefined;

  const override = await upsertScoreOverride({
    slug,
    ratings,
    monthlyCostUsd,
    updatedBy: user.email,
  });

  return NextResponse.json({ override }, { headers: CORS_HEADERS });
}
