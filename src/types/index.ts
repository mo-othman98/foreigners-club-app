export interface PassportData {
  name: string;
  nationality: string;
  currentCountry: string;
  currentCity: string;
  languages: string[];
  countriesLived: string[];
  countriesVisited: string[];
}

export interface CountryInsightData {
  countryCode: string;
  countryName: string;
  costOfLiving: string;
  friendlinessRating: number;
  languageSituation: string;
  culturalTips: string[];
  commonMistakes: string[];
  foreignerQuotes: string[];
  activeUserCount: number;
}

export const EMPTY_PASSPORT: PassportData = {
  name: "",
  nationality: "",
  currentCountry: "",
  currentCity: "",
  languages: [],
  countriesLived: [],
  countriesVisited: [],
};
