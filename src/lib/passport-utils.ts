import { resolveCountryCode } from "@/lib/mock-data";
import { getSlugFromCountry } from "@/lib/country-data";
import type {
  PassportEndorsement,
  PassportJournal,
  PassportStamp,
  StampType,
  TravelStats,
} from "@/types/passport";

const CONTINENT_MAP: Record<string, string> = {
  US: "North America",
  CA: "North America",
  MX: "North America",
  BR: "South America",
  AR: "South America",
  CO: "South America",
  CL: "South America",
  PE: "South America",
  EC: "South America",
  UY: "South America",
  CR: "North America",
  PA: "North America",
  GB: "Europe",
  DE: "Europe",
  FR: "Europe",
  ES: "Europe",
  IT: "Europe",
  PT: "Europe",
  NL: "Europe",
  BE: "Europe",
  CH: "Europe",
  AT: "Europe",
  IE: "Europe",
  PL: "Europe",
  SE: "Europe",
  NO: "Europe",
  DK: "Europe",
  FI: "Europe",
  IS: "Europe",
  GR: "Europe",
  CZ: "Europe",
  HU: "Europe",
  RO: "Europe",
  HR: "Europe",
  RS: "Europe",
  BG: "Europe",
  TR: "Asia",
  JP: "Asia",
  KR: "Asia",
  CN: "Asia",
  IN: "Asia",
  TH: "Asia",
  VN: "Asia",
  ID: "Asia",
  SG: "Asia",
  MY: "Asia",
  PH: "Asia",
  TW: "Asia",
  AE: "Asia",
  SA: "Asia",
  IL: "Asia",
  PS: "Asia",
  MA: "Africa",
  EG: "Africa",
  ZA: "Africa",
  KE: "Africa",
  NG: "Africa",
  GH: "Africa",
  ET: "Africa",
  AU: "Oceania",
  NZ: "Oceania",
};

export function generateStampId(): string {
  return `stamp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function parseYear(date: string): number {
  const year = parseInt(date.slice(0, 4), 10);
  return isNaN(year) ? 0 : year;
}

export function sortStampsChronologically(
  stamps: PassportStamp[]
): PassportStamp[] {
  return [...stamps].sort(
    (a, b) => parseYear(a.entryDate) - parseYear(b.entryDate)
  );
}

export function daysBetween(start: string, end: string): number {
  const s = new Date(start.length === 4 ? `${start}-06-15` : start);
  const e = new Date(end.length === 4 ? `${end}-06-15` : end);
  const diff = e.getTime() - s.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function computeTravelStats(journal: PassportJournal): TravelStats {
  const visited = new Set(
    journal.stamps
      .filter((s) => s.type === "visitor")
      .map((s) => s.country.toLowerCase())
  );
  const lived = new Set(
    journal.stamps
      .filter((s) => s.type === "resident")
      .map((s) => s.country.toLowerCase())
  );
  const heritage = new Set(
    [
      ...journal.heritageCountries,
      ...journal.stamps
        .filter((s) => s.type === "heritage")
        .map((s) => s.country),
    ].map((c) => c.toLowerCase())
  );

  const continents = new Set<string>();
  journal.stamps.forEach((s) => {
    const code = resolveCountryCode(s.country);
    const continent = CONTINENT_MAP[code];
    if (continent) continents.add(continent);
  });

  let daysAbroad = 0;
  journal.stamps
    .filter((s) => s.type === "visitor" || s.type === "resident")
    .forEach((s) => {
      if (s.exitDate) {
        daysAbroad += daysBetween(s.entryDate, s.exitDate);
      } else if (s.type === "resident") {
        const entryYear = parseYear(s.entryDate);
        const now = new Date().getFullYear();
        daysAbroad += (now - entryYear) * 365;
      } else {
        daysAbroad += 30;
      }
    });

  const uniqueCountries = new Set(
    journal.stamps
      .filter((s) => s.type !== "birth")
      .map((s) => s.country.toLowerCase())
  );

  return {
    countriesVisited: visited.size,
    countriesLivedIn: lived.size,
    heritageConnections: heritage.size,
    daysAbroad,
    continentsExplored: continents.size,
    passportCompletion: Math.min(
      100,
      Math.round((uniqueCountries.size / 50) * 100)
    ),
    totalStamps: journal.stamps.length,
  };
}

export function computeEndorsements(
  journal: PassportJournal,
  stats: TravelStats
): PassportEndorsement[] {
  return [
    {
      id: "first-stamp",
      title: "First Stamp",
      description: "Your journey begins with a single border crossing.",
      collected: stats.totalStamps >= 1,
    },
    {
      id: "five-countries",
      title: "Five Countries Visited",
      description: "A passport that has seen more than a handful of horizons.",
      collected: stats.countriesVisited >= 5,
    },
    {
      id: "lived-abroad",
      title: "Lived Abroad",
      description: "You didn't just visit — you unpacked your life somewhere new.",
      collected: stats.countriesLivedIn >= 1,
    },
    {
      id: "multilingual",
      title: "Multilingual",
      description: "Three languages or more — words carried across borders.",
      collected: journal.languages.length >= 3,
    },
    {
      id: "cross-continent",
      title: "Cross-Continent Traveler",
      description: "Your stamps span continents, not just countries.",
      collected: stats.continentsExplored >= 2,
    },
  ];
}

export function getCountrySlug(country: string): string {
  return getSlugFromCountry(country);
}

export function stampRotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  return ((hash % 7) - 3) * 1.2;
}

interface LegacyPassport {
  name?: string;
  nationality?: string;
  currentCountry?: string;
  currentCity?: string;
  languages?: string[];
  countriesLived?: string[];
  countriesVisited?: string[];
  stamps?: PassportStamp[];
  birthCountry?: string;
  birthDate?: string;
  heritageCountries?: string[];
}

export function migrateToJournal(raw: unknown): PassportJournal {
  const data = (raw ?? {}) as LegacyPassport;

  if (data.stamps && Array.isArray(data.stamps)) {
    return {
      name: data.name ?? "",
      nationality: data.nationality ?? "",
      birthCountry: data.birthCountry ?? data.nationality ?? "",
      birthDate: data.birthDate ?? "",
      currentCountry: data.currentCountry ?? "",
      currentCity: data.currentCity ?? "",
      languages: data.languages ?? [],
      heritageCountries: data.heritageCountries ?? [],
      stamps: data.stamps,
    };
  }

  const stamps: PassportStamp[] = [];
  const birthCountry = data.birthCountry ?? data.nationality ?? "";

  if (birthCountry) {
    stamps.push({
      id: generateStampId(),
      country: birthCountry,
      type: "birth",
      entryDate: data.birthDate || "1990",
      cities: [],
      notes: "Where the journey began.",
    });
  }

  (data.countriesLived ?? []).forEach((country, i) => {
    stamps.push({
      id: generateStampId(),
      country,
      type: "resident",
      entryDate: String(2015 + i * 2),
      cities: [],
    });
  });

  (data.countriesVisited ?? []).forEach((country, i) => {
    if (
      !(data.countriesLived ?? []).includes(country) &&
      country !== birthCountry
    ) {
      stamps.push({
        id: generateStampId(),
        country,
        type: "visitor",
        entryDate: String(2018 + i),
        exitDate: String(2018 + i),
        cities: [],
      });
    }
  });

  return {
    name: data.name ?? "",
    nationality: data.nationality ?? "",
    birthCountry,
    birthDate: data.birthDate ?? "",
    currentCountry: data.currentCountry ?? "",
    currentCity: data.currentCity ?? "",
    languages: data.languages ?? [],
    heritageCountries: data.heritageCountries ?? [],
    stamps,
  };
}

export function syncHeritageStamps(journal: PassportJournal): PassportJournal {
  const stamps = [...journal.stamps];

  journal.heritageCountries.forEach((country) => {
    const exists = stamps.some(
      (s) =>
        s.country.toLowerCase() === country.toLowerCase() &&
        s.type === "heritage"
    );
    if (!exists) {
      stamps.push({
        id: generateStampId(),
        country,
        type: "heritage",
        entryDate: "—",
        cities: [],
        notes: "Family roots and cultural connection.",
      });
    }
  });

  if (journal.birthCountry) {
    const hasBirth = stamps.some((s) => s.type === "birth");
    if (!hasBirth) {
      stamps.unshift({
        id: generateStampId(),
        country: journal.birthCountry,
        type: "birth",
        entryDate: journal.birthDate || "—",
        cities: [],
        notes: "Where the journey began.",
      });
    }
  }

  return { ...journal, stamps };
}

export const STAMP_TYPE_STYLES: Record<
  StampType,
  { bg: string; border: string; badge: string; label: string }
> = {
  birth: {
    bg: "bg-amber-50",
    border: "border-amber-400",
    badge: "bg-amber-500 text-white",
    label: "Birth",
  },
  heritage: {
    bg: "bg-violet-50",
    border: "border-violet-400",
    badge: "bg-violet-500 text-white",
    label: "Heritage",
  },
  resident: {
    bg: "bg-teal-50",
    border: "border-teal-500",
    badge: "bg-teal-600 text-white",
    label: "Resident",
  },
  visitor: {
    bg: "bg-sky-50",
    border: "border-sky-400",
    badge: "bg-sky-500 text-white",
    label: "Visitor",
  },
};
