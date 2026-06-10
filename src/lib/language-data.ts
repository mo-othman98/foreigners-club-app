import type { LanguageDistribution } from "@/types/country";

export const LANGUAGE_DATA: Record<
  string,
  {
    distribution: LanguageDistribution[];
    recommended: string[];
    label?: string;
  }
> = {
  morocco: {
    label: "High",
    distribution: [
      { language: "Darija", communicability: 92, note: "Very Common" },
      { language: "Standard Arabic", communicability: 75, note: "Common" },
      { language: "French", communicability: 88, note: "Very Common" },
      { language: "English", communicability: 45, note: "Growing" },
      { language: "Spanish", communicability: 25, note: "Regional" },
    ],
    recommended: ["Darija", "French", "English"],
  },
  turkey: {
    label: "Moderate",
    distribution: [
      { language: "Turkish", communicability: 90, note: "Essential" },
      { language: "English", communicability: 40, note: "Urban/Tourist" },
      { language: "German", communicability: 15, note: "Regional" },
    ],
    recommended: ["Turkish", "English"],
  },
  japan: {
    label: "Moderate",
    distribution: [
      { language: "Japanese", communicability: 95, note: "Essential" },
      { language: "English", communicability: 35, note: "Limited" },
    ],
    recommended: ["Japanese", "English"],
  },
  netherlands: {
    label: "Very High",
    distribution: [
      { language: "English", communicability: 90, note: "Very Common" },
      { language: "Dutch", communicability: 95, note: "Essential long-term" },
      { language: "German", communicability: 30, note: "Some overlap" },
    ],
    recommended: ["English", "Dutch"],
  },
  germany: {
    label: "High",
    distribution: [
      { language: "German", communicability: 92, note: "Essential" },
      { language: "English", communicability: 65, note: "Common in cities" },
    ],
    recommended: ["German", "English"],
  },
};

export const TOP_CITIES: Record<string, string[]> = {
  morocco: ["Casablanca", "Rabat", "Marrakech", "Tangier"],
  turkey: ["Istanbul", "Izmir", "Antalya", "Ankara"],
  japan: ["Tokyo", "Osaka", "Kyoto", "Fukuoka"],
  netherlands: ["Amsterdam", "Rotterdam", "Utrecht", "The Hague"],
  spain: ["Madrid", "Barcelona", "Valencia", "Seville"],
  portugal: ["Lisbon", "Porto", "Braga", "Faro"],
  germany: ["Berlin", "Munich", "Hamburg", "Cologne"],
  mexico: ["Mexico City", "Guadalajara", "Monterrey", "Playa del Carmen"],
  thailand: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya"],
};
