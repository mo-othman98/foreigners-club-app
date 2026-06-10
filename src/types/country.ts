export interface ScoreDimensions {
  friendliness: number;
  cost: number;
  easeOfMakingFriends: number;
  safety: number;
  languageAccessibility: number;
  bureaucracyDifficulty: number;
}

export interface LanguageDistribution {
  language: string;
  communicability: number;
  note?: string;
}

export interface ForeignerReview {
  nationality: string;
  nationalityFlag: string;
  yearsLived: string;
  review: string;
}

export interface LanguagePhrase {
  english: string;
  local: string;
  pronunciation: string;
}

export interface SurvivalGuideItem {
  title: string;
  content: string;
}

export interface LocalSong {
  title: string;
  artist: string;
  note?: string;
}

export interface CountryPageData {
  slug: string;
  countryCode: string;
  countryName: string;
  flag: string;
  foreignerScore: number;
  scoreDimensions: ScoreDimensions;
  reviewCount: number;
  membersCurrentlyHere: number;
  whatForeignersLove: string[];
  biggestChallenges: string[];
  realityChecks: string[];
  survivalGuide: SurvivalGuideItem[];
  popularSongs: LocalSong[];
  languagePhrases: LanguagePhrase[];
  reviews: ForeignerReview[];
  topCities?: string[];
  languageDistribution?: LanguageDistribution[];
  recommendedLanguages?: string[];
  languageAccessibilityLabel?: string;
}
