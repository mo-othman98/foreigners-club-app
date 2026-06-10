import { COUNTRY_HUBS } from "@/lib/country-hubs";
import { getFlag } from "@/lib/country-flags";
import {
  calculateForeignerScore,
  languageAccessibilityLabel,
} from "@/lib/country-score";
import { LANGUAGE_DATA, TOP_CITIES } from "@/lib/language-data";
import {
  COUNTRY_INSIGHTS,
  resolveCountryCode,
} from "@/lib/mock-data";
import type { CountryPageData, ScoreDimensions } from "@/types/country";

const CODE_TO_SLUG: Record<string, string> = {
  US: "united-states",
  GB: "united-kingdom",
  DE: "germany",
  FR: "france",
  ES: "spain",
  IT: "italy",
  JP: "japan",
  KR: "south-korea",
  TH: "thailand",
  MX: "mexico",
  BR: "brazil",
  PT: "portugal",
  NL: "netherlands",
  AU: "australia",
  CA: "canada",
  IN: "india",
  AE: "united-arab-emirates",
  SG: "singapore",
  MA: "morocco",
  PS: "palestine",
  TR: "turkey",
  VN: "vietnam",
  ID: "indonesia",
  PL: "poland",
  SE: "sweden",
  NO: "norway",
  ZA: "south-africa",
  AR: "argentina",
  CO: "colombia",
  PH: "philippines",
  TW: "taiwan",
  CN: "china",
  CH: "switzerland",
  AT: "austria",
  BE: "belgium",
  IE: "ireland",
  NZ: "new-zealand",
  EG: "egypt",
  CL: "chile",
  PE: "peru",
  GR: "greece",
  CZ: "czech-republic",
  HU: "hungary",
  RO: "romania",
  UA: "ukraine",
  RU: "russia",
  MY: "malaysia",
  CR: "costa-rica",
  PA: "panama",
  EC: "ecuador",
  UY: "uruguay",
  DK: "denmark",
  FI: "finland",
  IS: "iceland",
  HR: "croatia",
  RS: "serbia",
  BG: "bulgaria",
  IL: "israel",
  JO: "jordan",
  LB: "lebanon",
  KE: "kenya",
  NG: "nigeria",
  GH: "ghana",
  ET: "ethiopia",
  SA: "saudi-arabia",
  QA: "qatar",
  BH: "bahrain",
  KW: "kuwait",
  OM: "oman",
  PK: "pakistan",
  BD: "bangladesh",
  LK: "sri-lanka",
  NP: "nepal",
  KH: "cambodia",
  LA: "laos",
  MM: "myanmar",
  MN: "mongolia",
  KZ: "kazakhstan",
  UZ: "uzbekistan",
  GE: "georgia",
  AM: "armenia",
  AZ: "azerbaijan",
};

const SLUG_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(CODE_TO_SLUG).map(([code, slug]) => [slug, code])
);

Object.values(COUNTRY_HUBS).forEach((hub) => {
  SLUG_TO_CODE[hub.slug] = hub.countryCode;
  CODE_TO_SLUG[hub.countryCode] = hub.slug;
});

export function slugFromName(name: string): string {
  const code = resolveCountryCode(name);
  if (CODE_TO_SLUG[code]) return CODE_TO_SLUG[code];
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getSlugFromCountry(name: string, code?: string): string {
  const resolved = resolveCountryCode(name, code);
  if (CODE_TO_SLUG[resolved]) return CODE_TO_SLUG[resolved];
  return slugFromName(name);
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededValue(seed: number, min: number, max: number): number {
  const normalized = (seed % 1000) / 1000;
  return Math.round(min + normalized * (max - min));
}

function generateDimensions(code: string, name: string): ScoreDimensions {
  const insight = COUNTRY_INSIGHTS[code];
  const seed = hashSeed(code + name);

  const friendliness = insight
    ? Math.round(insight.friendlinessRating * 20)
    : seededValue(seed, 55, 90);

  return {
    friendliness,
    cost: seededValue(seed + 1, 45, 88),
    easeOfMakingFriends: seededValue(seed + 2, 40, 85),
    safety: seededValue(seed + 3, 55, 92),
    languageAccessibility: seededValue(seed + 4, 25, 75),
    bureaucracyDifficulty: seededValue(seed + 5, 45, 85),
  };
}

function generateHubFromInsight(
  slug: string,
  code: string,
  name: string
): CountryPageData {
  const insight = COUNTRY_INSIGHTS[code];
  const seed = hashSeed(code);
  const scoreDimensions = generateDimensions(code, name);

  const loves = insight
    ? insight.culturalTips.slice(0, 3).map((t) => t.split("—")[0].split(".")[0])
    : ["Local hospitality", "Cultural richness", "Unique lifestyle"];

  const challenges = insight
    ? insight.commonMistakes.slice(0, 3)
    : ["Language barriers", "Bureaucracy", "Cultural adjustment"];

  const realityChecks = insight
    ? [
        `Tourists and residents experience ${name} very differently.`,
        ...insight.foreignerQuotes.slice(0, 2).map((q) => q.replace(/^"|"$/g, "")),
      ]
    : [
        `The ${name} you visit is not the ${name} you live in.`,
        "Friendliness doesn't always mean instant belonging.",
        "Learning even basic local phrases changes everything.",
      ];

  const reviewCount = insight
    ? Math.round(insight.activeUserCount * 0.6)
    : seededValue(seed, 200, 900);

  const members = insight?.activeUserCount ?? seededValue(seed + 7, 80, 400);

  return {
    slug,
    countryCode: code,
    countryName: insight?.countryName ?? name,
    flag: getFlag(code),
    scoreDimensions,
    foreignerScore: calculateForeignerScore(scoreDimensions),
    reviewCount,
    membersCurrentlyHere: members,
    whatForeignersLove: loves,
    biggestChallenges: challenges,
    realityChecks,
    survivalGuide: [
      {
        title: "Learn basic greetings",
        content: insight
          ? insight.culturalTips[0] ?? "Learn hello and thank you — effort is noticed immediately."
          : "Learn hello and thank you — effort is noticed immediately.",
      },
      {
        title: "Understand local etiquette",
        content: insight
          ? insight.culturalTips[1] ?? "Observe how locals queue, eat, and greet."
          : "Observe how locals queue, eat, and greet.",
      },
      {
        title: "Learn common scams",
        content: insight
          ? insight.commonMistakes[0]
          : "Research neighborhood-specific scams before arriving.",
      },
      {
        title: "Understand social norms",
        content: insight
          ? insight.culturalTips[2] ?? "Personal space and directness vary — watch before acting."
          : "Personal space and directness vary — watch before acting.",
      },
    ],
    popularSongs: [
      { title: "Local Folk Classic", artist: "Various Artists", note: "Ask a local — everyone has an opinion" },
      { title: "Modern Pop Hit", artist: "Chart Topper", note: "Plays in cafés and taxis" },
      { title: "Traditional Standard", artist: "National Icon", note: "Heard at gatherings" },
    ],
    languagePhrases: [
      { english: "Hello", local: "—", pronunciation: "Ask a local on arrival" },
      { english: "Thank you", local: "—", pronunciation: "Ask a local on arrival" },
      { english: "Excuse me", local: "—", pronunciation: "Ask a local on arrival" },
      { english: "How much?", local: "—", pronunciation: "Ask a local on arrival" },
    ],
    reviews: (insight?.foreignerQuotes ?? [
      `"${name} surprised me — living here is nothing like visiting."`,
      `"The first months were admin and adjustment. It gets better."`,
      `"Nobody tells you how much you relearn daily life."`,
    ]).slice(0, 3).map((quote, i) => ({
      nationality: ["American", "British", "German"][i] ?? "Foreigner",
      nationalityFlag: ["🇺🇸", "🇬🇧", "🇩🇪"][i] ?? "🌍",
      yearsLived: `${1 + (i % 3)} years`,
      review: quote.replace(/^"|"$/g, ""),
    })),
    topCities: TOP_CITIES[slug] ?? [],
    languageDistribution: LANGUAGE_DATA[slug]?.distribution ?? [],
    recommendedLanguages: LANGUAGE_DATA[slug]?.recommended ?? [],
    languageAccessibilityLabel:
      LANGUAGE_DATA[slug]?.label ??
      languageAccessibilityLabel(scoreDimensions.languageAccessibility),
  };
}

function formatSlugAsName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getCountryBySlug(slug: string): CountryPageData | null {
  const normalized = slug.toLowerCase().trim();
  if (!normalized) return null;

  if (COUNTRY_HUBS[normalized]) {
    return COUNTRY_HUBS[normalized];
  }

  const code = SLUG_TO_CODE[normalized];
  if (code) {
    return generateHubFromInsight(
      normalized,
      code,
      COUNTRY_INSIGHTS[code]?.countryName ?? formatSlugAsName(normalized)
    );
  }

  const name = formatSlugAsName(normalized);
  const resolvedCode = resolveCountryCode(name);
  return generateHubFromInsight(normalized, resolvedCode, name);
}

export function getCountryByName(name: string, code?: string): CountryPageData {
  const slug = getSlugFromCountry(name, code);
  const existing = getCountryBySlug(slug);
  if (existing) return existing;

  const resolved = resolveCountryCode(name, code);
  return generateHubFromInsight(slug, resolved, name);
}

export function getAllCountrySlugs(): string[] {
  const slugs = new Set<string>([
    ...Object.keys(COUNTRY_HUBS),
    ...Object.values(CODE_TO_SLUG),
  ]);
  return Array.from(slugs);
}
