import { NextResponse } from "next/server";
import { getReviewsForCountry, upsertReview } from "@/lib/reviews-store";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

function clamp(n: unknown, fallback: number): number {
  if (typeof n !== "number" || Number.isNaN(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}

/** Accept new subcategory ratings + legacy six-key payloads. */
function normalizeRatings(bodyRatings: Record<string, unknown> = {}) {
  const hospitality = clamp(
    bodyRatings.hospitality ?? bodyRatings.friendliness,
    70
  );
  const legacySafety = clamp(bodyRatings.safety, 70);
  const legacyCost = clamp(
    bodyRatings.costOfLiving ?? bodyRatings.cost,
    70
  );
  const activities = clamp(
    bodyRatings.activities ??
      bodyRatings.fun ??
      bodyRatings.food ??
      bodyRatings.easeOfMakingFriends,
    70
  );
  const legacyLang = clamp(
    bodyRatings.communication ?? bodyRatings.languageAccessibility,
    70
  );

  return {
    hospitality,
    abilityToMakeFriends: clamp(
      bodyRatings.abilityToMakeFriends,
      Math.round((hospitality + clamp(bodyRatings.easeOfMakingFriends, hospitality)) / 2)
    ),
    communication: legacyLang,
    locals: clamp(
      bodyRatings.locals,
      Math.round(hospitality * 0.95 + 3)
    ),
    foreigners: clamp(
      bodyRatings.foreigners,
      Math.round((hospitality + activities) / 2)
    ),
    costOfLiving: legacyCost,
    publicTransportation: clamp(
      bodyRatings.publicTransportation,
      Math.round((legacyCost + legacyLang) / 2)
    ),
    workLifeBalance: clamp(
      bodyRatings.workLifeBalance,
      Math.round((legacySafety + legacyCost) / 2)
    ),
    activities,
    nightlife: clamp(
      bodyRatings.nightlife,
      Math.round((activities + legacySafety) / 2)
    ),
    localCrime: clamp(bodyRatings.localCrime, legacySafety),
    internationalReputation: clamp(
      bodyRatings.internationalReputation,
      Math.round(legacySafety * 0.96 + 4)
    ),
    architecture: clamp(
      bodyRatings.architecture,
      Math.round((hospitality + legacyCost) / 2)
    ),
    bureaucracy: clamp(bodyRatings.bureaucracy, 40),
  };
}

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

  const ratings = normalizeRatings(body.ratings ?? {});

  const review = await upsertReview({
    countrySlug: slug,
    authorEmail: body.authorEmail ?? "",
    reviewerName: body.reviewerName ?? "Anonymous",
    identityLabel: body.identityLabel ?? "Foreigner",
    citizenships: body.citizenships ?? [],
    familyBackground: body.familyBackground ?? "",
    heritageCountries: body.heritageCountries ?? [],
    yearsLived: body.yearsLived ?? "",
    citiesVisited: body.citiesVisited ?? [],
    text: body.text ?? "",
    overallScore:
      typeof body.overallScore === "number"
        ? Math.min(100, Math.max(1, Math.round(body.overallScore)))
        : undefined,
    ratings,
  });

  const status = review.updatedAt ? 200 : 201;
  return NextResponse.json({ review }, { status, headers: CORS });
}
