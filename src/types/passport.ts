export type StampType = "visitor" | "resident" | "heritage" | "birth";

export interface PassportStamp {
  id: string;
  country: string;
  type: StampType;
  entryDate: string;
  exitDate?: string;
  cities: string[];
  notes?: string;
}

export interface PassportJournal {
  name: string;
  nationality: string;
  birthCountry: string;
  birthDate: string;
  currentCountry: string;
  currentCity: string;
  languages: string[];
  heritageCountries: string[];
  stamps: PassportStamp[];
}

export type PassportView = "scroll" | "timeline" | "book";

export interface TravelStats {
  countriesVisited: number;
  countriesLivedIn: number;
  heritageConnections: number;
  daysAbroad: number;
  continentsExplored: number;
  passportCompletion: number;
  totalStamps: number;
}

export interface PassportEndorsement {
  id: string;
  title: string;
  description: string;
  collected: boolean;
}

export const EMPTY_JOURNAL: PassportJournal = {
  name: "",
  nationality: "",
  birthCountry: "",
  birthDate: "",
  currentCountry: "",
  currentCity: "",
  languages: [],
  heritageCountries: [],
  stamps: [],
};

export const STAMP_TYPE_LABELS: Record<StampType, string> = {
  birth: "Birth Stamp",
  heritage: "Heritage Stamp",
  resident: "Resident Stamp",
  visitor: "Visitor Stamp",
};
