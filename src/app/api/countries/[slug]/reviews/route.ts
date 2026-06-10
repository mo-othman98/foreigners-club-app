import { NextResponse } from "next/server";
import { getReviewsForCountry, upsertReview } from "@/lib/reviews-store";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const reviews = await getReviewsForCountry(slug);
  return NextResponse.json({ reviews }, { headers: CORS });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  const review = await upsertReview({
    countrySlug: slug,
    authorEmail: body.authorEmail ?? "",
    reviewerName: body.reviewerName ?? "Anonymous",
    identityLabel: body.identityLabel ?? "Foreigner",
    citizenships: body.citizenships ?? [],
    heritageCountries: body.heritageCountries ?? [],
    yearsLived: body.yearsLived ?? "",
    citiesVisited: body.citiesVisited ?? [],
    text: body.text ?? "",
    ratings: body.ratings ?? {
      friendliness: 70,
      cost: 70,
      safety: 70,
      languageAccessibility: 70,
      easeOfMakingFriends: 70,
      bureaucracy: 40,
    },
  });

  const status = review.updatedAt ? 200 : 201;
  return NextResponse.json({ review }, { status, headers: CORS });
}
