import type { CountryPageData } from "@/types/country";
import { calculateForeignerScore, languageAccessibilityLabel } from "@/lib/country-score";
import { LANGUAGE_DATA, TOP_CITIES } from "@/lib/language-data";

type HubInput = Omit<CountryPageData, "foreignerScore">;

function hub(data: HubInput): CountryPageData {
  const langMeta = LANGUAGE_DATA[data.slug];
  const topCities = data.topCities ?? TOP_CITIES[data.slug] ?? [];
  return {
    ...data,
    topCities,
    languageDistribution:
      data.languageDistribution ?? langMeta?.distribution ?? [],
    recommendedLanguages:
      data.recommendedLanguages ?? langMeta?.recommended ?? [],
    languageAccessibilityLabel:
      data.languageAccessibilityLabel ??
      langMeta?.label ??
      languageAccessibilityLabel(data.scoreDimensions.languageAccessibility),
    foreignerScore: calculateForeignerScore(data.scoreDimensions),
  };
}

export const COUNTRY_HUBS: Record<string, CountryPageData> = {
  morocco: hub({
    slug: "morocco",
    countryCode: "MA",
    countryName: "Morocco",
    flag: "🇲🇦",
    scoreDimensions: {
      friendliness: 88,
      cost: 82,
      easeOfMakingFriends: 72,
      safety: 78,
      languageAccessibility: 55,
      bureaucracyDifficulty: 68,
    },
    reviewCount: 1244,
    membersCurrentlyHere: 318,
    whatForeignersLove: [
      "Hospitality",
      "Café culture",
      "Weather",
      "Street food",
      "Architectural beauty",
      "Affordable lifestyle",
    ],
    biggestChallenges: [
      "Bureaucracy",
      "Language barriers",
      "Housing quality",
      "Gender dynamics in public space",
      "Seasonal tourism crowds",
    ],
    realityChecks: [
      "Tourists and residents experience Morocco very differently.",
      "People are friendly but friendships take time.",
      "French is often more useful than English.",
      "The medina charm fades when you need a working internet connection.",
      "Ramadan changes the rhythm of entire cities — plan around it.",
    ],
    survivalGuide: [
      {
        title: "Learn basic greetings",
        content:
          "As-salamu alaykum, labas, and shukran go far. Moroccans notice effort immediately, especially outside tourist zones.",
      },
      {
        title: "Understand local etiquette",
        content:
          "Dress modestly in medinas and religious areas. Accept tea when offered — refusing can feel rude. Haggling is normal in souks, not in supermarkets.",
      },
      {
        title: "Learn common scams",
        content:
          "Unofficial 'guides,' inflated taxi fares without meters, and fake orphanage donations are common in tourist areas. Agree taxi prices upfront or use apps.",
      },
      {
        title: "Understand social norms",
        content:
          "Public affection is conservative. Photography of people requires permission. Friday lunch with family is sacred — don't expect fast responses.",
      },
    ],
    popularSongs: [
      { title: "Aicha", artist: "Khaled", note: "Pan-Arab classic everyone knows" },
      { title: "Ya Moulati", artist: "Najat Aatabou", note: "Beloved Chaabi anthem" },
      { title: "Lmara Wana", artist: "Saad Lamjarred", note: "Modern pop staple" },
      { title: "Goulou Liya", artist: "Douzi", note: "Wedding and café favorite" },
    ],
    languagePhrases: [
      { english: "Hello", local: "Salam / Labas", pronunciation: "sah-LAM / LA-bas" },
      { english: "Thank you", local: "Shukran", pronunciation: "SHOOK-rahn" },
      { english: "Excuse me", local: "Smah liya", pronunciation: "smah LEE-yah" },
      { english: "How much?", local: "Bshhal?", pronunciation: "besh-HAHL" },
      { english: "No thank you", local: "La, shukran", pronunciation: "lah SHOOK-rahn" },
    ],
    reviews: [
      {
        nationality: "American",
        nationalityFlag: "🇺🇸",
        yearsLived: "2 years",
        review:
          "The hospitality is incredible, but paperwork requires patience. Once I accepted the pace, Marrakech felt like home.",
      },
      {
        nationality: "French",
        nationalityFlag: "🇫🇷",
        yearsLived: "3 years",
        review:
          "French opens every door here. Without it, daily errands in Casablanca become exhausting.",
      },
      {
        nationality: "British",
        nationalityFlag: "🇬🇧",
        yearsLived: "1 year",
        review:
          "Tangier is nothing like the desert Instagram promised. Coastal cities have their own rhythm — research your city, not the country.",
      },
      {
        nationality: "German",
        nationalityFlag: "🇩🇪",
        yearsLived: "18 months",
        review:
          "I loved the café culture until I needed a residence permit. Bureaucracy is the real boss in Morocco.",
      },
    ],
  }),

  turkey: hub({
    slug: "turkey",
    countryCode: "TR",
    countryName: "Turkey",
    flag: "🇹🇷",
    scoreDimensions: {
      friendliness: 85,
      cost: 78,
      easeOfMakingFriends: 80,
      safety: 74,
      languageAccessibility: 48,
      bureaucracyDifficulty: 72,
    },
    reviewCount: 1876,
    membersCurrentlyHere: 542,
    whatForeignersLove: [
      "Food culture",
      "Hospitality",
      "Affordable cities",
      "Bosphorus lifestyle",
      "History everywhere",
      "Nightlife in Istanbul",
    ],
    biggestChallenges: [
      "Bureaucracy",
      "Language barriers",
      "Inflation volatility",
      "Housing scams",
      "Political tension awareness",
    ],
    realityChecks: [
      "Istanbul and Anatolia feel like different countries.",
      "Turks are warm, but contracts and permits are cold.",
      "A little Turkish transforms daily interactions completely.",
      "The lira's swings affect rent and savings overnight.",
      "Tourist Istanbul is not the Istanbul foreigners live in.",
    ],
    survivalGuide: [
      {
        title: "Learn basic greetings",
        content:
          "Merhaba, teşekkürler, and lütfen are essentials. Turks reward effort with generosity.",
      },
      {
        title: "Understand local etiquette",
        content:
          "Remove shoes in homes. Accept tea — it's a social ritual, not just a drink. Don't discuss politics loudly in mixed company.",
      },
      {
        title: "Learn common scams",
        content:
          "Overpriced carpets, fake 'closed' mosques redirecting to shops, and unlicensed apartment deposits. Always verify landlords.",
      },
      {
        title: "Understand social norms",
        content:
          "Personal space is closer than Northern Europe. Punctuality is flexible socially but expected professionally.",
      },
    ],
    popularSongs: [
      { title: "Şımarık", artist: "Tarkan", note: "Iconic 90s pop everyone recognizes" },
      { title: "Gülümse", artist: "Sezen Aksu", note: "The voice of modern Turkey" },
      { title: "Yalan", artist: "Tarkan", note: "Still plays in taxis nationwide" },
      { title: "Fesuphanallah", artist: "Barış Manço", note: "Classic Anatolian rock" },
    ],
    languagePhrases: [
      { english: "Hello", local: "Merhaba", pronunciation: "mehr-HAH-bah" },
      { english: "Thank you", local: "Teşekkürler", pronunciation: "teh-shek-KEWR-ler" },
      { english: "Excuse me", local: "Affedersiniz", pronunciation: "ah-feh-der-see-NEEZ" },
      { english: "How much?", local: "Ne kadar?", pronunciation: "neh kah-DAHR" },
      { english: "Delicious", local: "Çok güzel", pronunciation: "choke goo-ZEL" },
    ],
    reviews: [
      {
        nationality: "American",
        nationalityFlag: "🇺🇸",
        yearsLived: "2 years",
        review:
          "Istanbul's energy is addictive. Learning Turkish was harder than the visa process, but worth every hour.",
      },
      {
        nationality: "Russian",
        nationalityFlag: "🇷🇺",
        yearsLived: "4 years",
        review:
          "Antalya feels like a resort until winter. Coastal expat life is comfortable but shallow without local language.",
      },
      {
        nationality: "Dutch",
        nationalityFlag: "🇳🇱",
        yearsLived: "1 year",
        review:
          "The food alone justified the move. Bureaucracy at the immigration office is where optimism goes to wait.",
      },
      {
        nationality: "Italian",
        nationalityFlag: "🇮🇹",
        yearsLived: "3 years",
        review:
          "Turks treat guests like family. Just don't confuse guest warmth with instant deep friendship.",
      },
    ],
  }),

  japan: hub({
    slug: "japan",
    countryCode: "JP",
    countryName: "Japan",
    flag: "🇯🇵",
    scoreDimensions: {
      friendliness: 76,
      cost: 42,
      easeOfMakingFriends: 52,
      safety: 96,
      languageAccessibility: 38,
      bureaucracyDifficulty: 58,
    },
    reviewCount: 2341,
    membersCurrentlyHere: 891,
    whatForeignersLove: [
      "Safety",
      "Convenience",
      "Food quality",
      "Public transit",
      "Seasonal beauty",
      "Politeness culture",
    ],
    biggestChallenges: [
      "Language barriers",
      "Social isolation",
      "Work culture",
      "High rent in cities",
      "Bureaucracy",
      "Making local friends",
    ],
    realityChecks: [
      "Japan is safe and polite — that doesn't mean it's easy.",
      "English works in pockets, not in real daily life.",
      "The 'gaijin bubble' is real and hard to escape.",
      "Convenience store food is great; finding an apartment is not.",
      "Silence on trains is law. Loud foreigners are noticed immediately.",
    ],
    survivalGuide: [
      {
        title: "Learn basic greetings",
        content:
          "Konnichiwa, arigatou, and sumimasen are daily essentials. Sumimasen works for sorry, excuse me, and thank you.",
      },
      {
        title: "Understand local etiquette",
        content:
          "Bow slightly when greeting. No tipping. Carry cash. Remove shoes when you see others doing so. Sort trash by neighborhood rules.",
      },
      {
        title: "Learn common scams",
        content:
          "Japan has few street scams, but watch for exploitative hostess bars, predatory rental agencies, and 'free' tours that end in shops.",
      },
      {
        title: "Understand social norms",
        content:
          "Directness is softened. 'Yes' can mean 'I understand.' Group harmony matters — don't be the loud exception.",
      },
    ],
    popularSongs: [
      { title: "Pretender", artist: "Official HIGE DANdism", note: "Omnipresent in karaoke" },
      { title: "Lemon", artist: "Kenshi Yonezu", note: "Modern classic across generations" },
      { title: "Sukiyaki", artist: "Kyu Sakamoto", note: "Timeless cultural reference" },
      { title: "Paprika", artist: "Foorin", note: "Feel-good song everyone knows" },
    ],
    languagePhrases: [
      { english: "Hello", local: "Konnichiwa", pronunciation: "kohn-nee-chee-WAH" },
      { english: "Thank you", local: "Arigatou", pronunciation: "ah-ree-gah-TOH" },
      { english: "Excuse me", local: "Sumimasen", pronunciation: "soo-mee-MAH-sen" },
      { english: "How much?", local: "Ikura desu ka?", pronunciation: "ee-koo-rah dess kah" },
      { english: "Delicious", local: "Oishii", pronunciation: "oy-SHEE" },
    ],
    reviews: [
      {
        nationality: "American",
        nationalityFlag: "🇺🇸",
        yearsLived: "3 years",
        review:
          "Tokyo is spotless and efficient. I didn't feel lonely until month six — language unlocks the real Japan.",
      },
      {
        nationality: "British",
        nationalityFlag: "🇬🇧",
        yearsLived: "2 years",
        review:
          "The kindness is genuine but bounded. People help you, but inviting you home is rare without Japanese.",
      },
      {
        nationality: "Brazilian",
        nationalityFlag: "🇧🇷",
        yearsLived: "4 years",
        review:
          "Osaka was warmer than Tokyo for making friends. Don't assume one city represents the whole country.",
      },
      {
        nationality: "French",
        nationalityFlag: "🇫🇷",
        yearsLived: "1 year",
        review:
          "Bureaucracy is precise but slow. Every document must be perfect — no exceptions.",
      },
    ],
  }),

  spain: hub({
    slug: "spain",
    countryCode: "ES",
    countryName: "Spain",
    flag: "🇪🇸",
    scoreDimensions: {
      friendliness: 86,
      cost: 70,
      easeOfMakingFriends: 84,
      safety: 82,
      languageAccessibility: 52,
      bureaucracyDifficulty: 74,
    },
    reviewCount: 1653,
    membersCurrentlyHere: 467,
    whatForeignersLove: [
      "Social life",
      "Food and wine",
      "Weather",
      "Walkable cities",
      "Late-night culture",
      "Regional diversity",
    ],
    biggestChallenges: [
      "Bureaucracy",
      "Job market",
      "Housing in Barcelona/Madrid",
      "Regional languages",
      "Summer heat without AC",
    ],
    realityChecks: [
      "Siesta is a stereotype — long lunches are real though.",
      "Spaniards are open, but deep circles form over years.",
      "Catalonia, Basque Country, and Andalusia are different worlds.",
      "NIE appointments are a rite of passage — bring patience.",
    ],
    survivalGuide: [
      {
        title: "Learn basic greetings",
        content: "Hola, gracias, and por favor. In Catalonia, a 'bon dia' earns respect.",
      },
      {
        title: "Understand local etiquette",
        content: "Two kisses on the cheek in many regions. Dinner at 9pm is normal. Don't rush meals.",
      },
      {
        title: "Learn common scams",
        content: "Pickpockets on La Rambla and metro. Rental deposit fraud. Always verify apartment ownership.",
      },
      {
        title: "Understand social norms",
        content: "Volume in bars is high — it's joy, not anger. Personal plans change last minute.",
      },
    ],
    popularSongs: [
      { title: "Bailando", artist: "Enrique Iglesias", note: "Ubiquitous summer hit" },
      { title: "Volare", artist: "Gipsy Kings", note: "Flamenco-pop crossover classic" },
      { title: "Despacito", artist: "Luis Fonsi", note: "Known across Spain, debated endlessly" },
      { title: "La Macarena", artist: "Los del Río", note: "Party staple forever" },
    ],
    languagePhrases: [
      { english: "Hello", local: "Hola", pronunciation: "OH-lah" },
      { english: "Thank you", local: "Gracias", pronunciation: "GRAH-see-ahs" },
      { english: "Excuse me", local: "Perdón", pronunciation: "per-DOHN" },
      { english: "How much?", local: "¿Cuánto cuesta?", pronunciation: "KWAN-toh KWES-tah" },
      { english: "Cheers", local: "Salud", pronunciation: "sah-LOOD" },
    ],
    reviews: [
      {
        nationality: "American",
        nationalityFlag: "🇺🇸",
        yearsLived: "2 years",
        review:
          "Barcelona sold me on the lifestyle. The NIE office nearly sent me home.",
      },
      {
        nationality: "German",
        nationalityFlag: "🇩🇪",
        yearsLived: "5 years",
        review:
          "Valencia is underrated for foreigners. Slower, cheaper, genuinely welcoming.",
      },
      {
        nationality: "Irish",
        nationalityFlag: "🇮🇪",
        yearsLived: "1 year",
        review:
          "Making friends was easy at bars, harder at banks. Spanish bureaucracy has its own timezone.",
      },
    ],
  }),

  germany: hub({
    slug: "germany",
    countryCode: "DE",
    countryName: "Germany",
    flag: "🇩🇪",
    scoreDimensions: {
      friendliness: 62,
      cost: 68,
      easeOfMakingFriends: 58,
      safety: 88,
      languageAccessibility: 72,
      bureaucracyDifficulty: 82,
    },
    reviewCount: 1987,
    membersCurrentlyHere: 612,
    whatForeignersLove: [
      "Work-life balance",
      "Public transit",
      "Healthcare",
      "Safety",
      "Green spaces",
      "Bread culture",
    ],
    biggestChallenges: [
      "Bureaucracy",
      "Making friends",
      "Language barriers",
      "Sunday closures",
      "Cold winters",
      "Direct communication style",
    ],
    realityChecks: [
      "Berlin is international; smaller towns require German.",
      "Friendliness is understated — don't confuse reserve for rejection.",
      "Anmeldung is the gatekeeper to everything else.",
      "Direct feedback is respect, not insult.",
    ],
    survivalGuide: [
      {
        title: "Learn basic greetings",
        content: "Guten Tag, danke, and bitte. Always say hello to shopkeepers first.",
      },
      {
        title: "Understand local etiquette",
        content: "Quiet hours matter. Recycling is serious. Cash is still common. Punctuality is non-negotiable.",
      },
      {
        title: "Learn common scams",
        content: "Rental deposit fraud in Berlin, fake immigration consultants, and ticket inspectors on transit.",
      },
      {
        title: "Understand social norms",
        content: "Privacy is valued. Invitations are rare and meaningful. Sunday is for rest.",
      },
    ],
    popularSongs: [
      { title: "99 Luftballons", artist: "Nena", note: "Cultural touchstone" },
      { title: "Auf uns", artist: "Andreas Bourani", note: "Stadium anthem energy" },
      { title: "Atemlos", artist: "Helene Fischer", note: "Schlager-pop phenomenon" },
      { title: "Major Tom", artist: "Peter Schilling", note: "80s classic still known" },
    ],
    languagePhrases: [
      { english: "Hello", local: "Guten Tag", pronunciation: "GOO-ten tahk" },
      { english: "Thank you", local: "Danke", pronunciation: "DAHN-kuh" },
      { english: "Excuse me", local: "Entschuldigung", pronunciation: "ent-SHOOL-dee-goong" },
      { english: "How much?", local: "Wie viel kostet das?", pronunciation: "vee feel KOS-tet dahs" },
      { english: "Cheers", local: "Prost", pronunciation: "prohst" },
    ],
    reviews: [
      {
        nationality: "American",
        nationalityFlag: "🇺🇸",
        yearsLived: "3 years",
        review:
          "Once I learned German, doors opened — before that, life felt administratively frozen.",
      },
      {
        nationality: "Indian",
        nationalityFlag: "🇮🇳",
        yearsLived: "2 years",
        review:
          "Munich is orderly and expensive. The bureaucracy is a full-time hobby.",
      },
      {
        nationality: "British",
        nationalityFlag: "🇬🇧",
        yearsLived: "4 years",
        review:
          "Work-life balance is incredible. Social life took two years to build.",
      },
    ],
  }),

  thailand: hub({
    slug: "thailand",
    countryCode: "TH",
    countryName: "Thailand",
    flag: "🇹🇭",
    scoreDimensions: {
      friendliness: 90,
      cost: 85,
      easeOfMakingFriends: 78,
      safety: 76,
      languageAccessibility: 45,
      bureaucracyDifficulty: 65,
    },
    reviewCount: 1432,
    membersCurrentlyHere: 389,
    whatForeignersLove: [
      "Street food",
      "Affordability",
      "Warmth",
      "Island life",
      "Massage culture",
      "Exotic fruit year-round",
    ],
    biggestChallenges: [
      "Visa complexity",
      "Language barriers",
      "Pollution in cities",
      "Expat bubbles",
      "Heat and humidity",
    ],
    realityChecks: [
      "The smile is polite, not always agreement.",
      "Bangkok and Chiang Mai are different planets.",
      "Visa rules change — what worked last year may not now.",
      "Thailand is not a permanent vacation.",
    ],
    survivalGuide: [
      {
        title: "Learn basic greetings",
        content: "Sawadee krap/ka and khop khun. The polite particle (krap/ka) matters.",
      },
      {
        title: "Understand local etiquette",
        content: "Never touch heads or point feet at people. Dress modestly at temples. Respect the monarchy.",
      },
      {
        title: "Learn common scams",
        content: "Tuk-tuk gem scams, closed temple redirects, and jet-ski rental damage claims.",
      },
      {
        title: "Understand social norms",
        content: "Conflict is avoided publicly. Saving face is essential. Calm persistence wins.",
      },
    ],
    popularSongs: [
      { title: "รักแท้", artist: "Billkin", note: "Modern Thai pop sensation" },
      { title: "ลูกทุ่ง", artist: "Various", note: "Luk thung plays in every taxi" },
      { title: "One Night Only", artist: "Bodyslam", note: "Rock anthem at festivals" },
      { title: "รถไฟ", artist: "Carabao", note: "Classic protest-folk rock" },
    ],
    languagePhrases: [
      { english: "Hello", local: "Sawadee krap/ka", pronunciation: "sah-wah-DEE krap/kah" },
      { english: "Thank you", local: "Khop khun", pronunciation: "kope KOOHN" },
      { english: "Excuse me", local: "Kho thot", pronunciation: "koh TOHT" },
      { english: "How much?", local: "Tao rai?", pronunciation: "tow RAI" },
      { english: "Delicious", local: "Aroi", pronunciation: "ah-ROY" },
    ],
    reviews: [
      {
        nationality: "Australian",
        nationalityFlag: "🇦🇺",
        yearsLived: "2 years",
        review:
          "Chiang Mai is paradise until visa day. The warmth is genuine, but long-term life requires respecting Thai norms.",
      },
      {
        nationality: "American",
        nationalityFlag: "🇺🇸",
        yearsLived: "1 year",
        review:
          "Learning Thai opened a completely different layer of the country. English-only life is a bubble.",
      },
      {
        nationality: "Swedish",
        nationalityFlag: "🇸🇪",
        yearsLived: "3 years",
        review:
          "Bangkok's convenience is unmatched. Visa runs were the biggest stress of my year.",
      },
    ],
  }),

  mexico: hub({
    slug: "mexico",
    countryCode: "MX",
    countryName: "Mexico",
    flag: "🇲🇽",
    scoreDimensions: {
      friendliness: 92,
      cost: 80,
      easeOfMakingFriends: 88,
      safety: 62,
      languageAccessibility: 40,
      bureaucracyDifficulty: 70,
    },
    reviewCount: 1289,
    membersCurrentlyHere: 421,
    whatForeignersLove: [
      "Food culture",
      "Warmth",
      "Festivals",
      "Affordable living",
      "Regional diversity",
      "Family-oriented culture",
    ],
    biggestChallenges: [
      "Safety awareness",
      "Bureaucracy",
      "Language barriers",
      "Neighborhood variance",
      "Water and infrastructure",
    ],
    realityChecks: [
      "Mexico is not one experience — state-by-state research is mandatory.",
      "Warmth is real, but safety requires street smarts.",
      "Time is flexible — 'ahorita' doesn't mean right now.",
      "Expat neighborhoods can feel like a parallel country.",
    ],
    survivalGuide: [
      {
        title: "Learn basic greetings",
        content: "Hola, gracias, and con permiso. Mexican Spanish has warmth in every phrase.",
      },
      {
        title: "Understand local etiquette",
        content: "Family comes first. Personal questions are normal. Refusing food can offend.",
      },
      {
        title: "Learn common scams",
        content: "ATM skimming, fake police shakedowns, and inflated tourist prices. Use official taxis or apps.",
      },
      {
        title: "Understand social norms",
        content: "Volume and emotion are normal. Directness varies by region. Build local trust networks.",
      },
    ],
    popularSongs: [
      { title: "La Bamba", artist: "Ritchie Valens", note: "Cross-generational classic" },
      { title: "Bésame Mucho", artist: "Consuelo Velázquez", note: "Timeless romantic standard" },
      { title: "Vivir Mi Vida", artist: "Marc Anthony", note: "Celebration anthem everywhere" },
      { title: "Cielito Lindo", artist: "Traditional", note: "Sung at every gathering" },
    ],
    languagePhrases: [
      { english: "Hello", local: "Hola / Qué tal", pronunciation: "OH-lah / kay TAHL" },
      { english: "Thank you", local: "Gracias", pronunciation: "GRAH-see-ahs" },
      { english: "Excuse me", local: "Disculpe", pronunciation: "dees-KOOL-peh" },
      { english: "How much?", local: "¿Cuánto?", pronunciation: "KWAN-toh" },
      { english: "Cheers", local: "Salud", pronunciation: "sah-LOOD" },
    ],
    reviews: [
      {
        nationality: "American",
        nationalityFlag: "🇺🇸",
        yearsLived: "2 years",
        review:
          "CDMX made me feel like family. Learning street Spanish vs textbook Spanish was a game changer.",
      },
      {
        nationality: "Canadian",
        nationalityFlag: "🇨🇦",
        yearsLived: "3 years",
        review:
          "Mérida is calmer than the coast. Research your city, not just the country.",
      },
      {
        nationality: "German",
        nationalityFlag: "🇩🇪",
        yearsLived: "1 year",
        review:
          "The warmth is real — integration means showing respect for local rhythm.",
      },
    ],
  }),

  portugal: hub({
    slug: "portugal",
    countryCode: "PT",
    countryName: "Portugal",
    flag: "🇵🇹",
    scoreDimensions: {
      friendliness: 88,
      cost: 72,
      easeOfMakingFriends: 76,
      safety: 86,
      languageAccessibility: 68,
      bureaucracyDifficulty: 78,
    },
    reviewCount: 1124,
    membersCurrentlyHere: 356,
    whatForeignersLove: [
      "Coffee culture",
      "Coastal living",
      "Safety",
      "Walkable cities",
      "Pastéis de nata",
      "Mild winters",
    ],
    biggestChallenges: [
      "Bureaucracy",
      "Low wages",
      "Housing competition",
      "Slow services",
      "Damp apartments",
    ],
    realityChecks: [
      "Lisbon is no longer Europe's cheap secret.",
      "Portuguese is not Spanish — locals notice the difference.",
      "People are patient helpers, but systems move slowly.",
      "Golden Visa hype distorted housing in key neighborhoods.",
    ],
    survivalGuide: [
      {
        title: "Learn basic greetings",
        content: "Olá, obrigado/a, and por favor. A warm bom dia opens shop interactions.",
      },
      {
        title: "Understand local etiquette",
        content: "Coffee at the counter is normal. Don't rush meals. Dress neatly for government offices.",
      },
      {
        title: "Learn common scams",
        content: "Rental deposit fraud in Lisbon, overpriced airport taxis, and fake immigration help.",
      },
      {
        title: "Understand social norms",
        content: "Volume is moderate. Personal space is closer than Northern Europe. Plans are flexible.",
      },
    ],
    popularSongs: [
      { title: "Ai Se Eu Te Pego", artist: "Michel Teló", note: "Party staple" },
      { title: "Ó Gente da Minha Terra", artist: "Amália Rodrigues", note: "Fado legend" },
      { title: "Veneno", artist: "Bluay", note: "Modern Lisbon sound" },
      { title: "Uma Casa Portuguesa", artist: "Amália Rodrigues", note: "Nostalgic national favorite" },
    ],
    languagePhrases: [
      { english: "Hello", local: "Olá", pronunciation: "oh-LAH" },
      { english: "Thank you", local: "Obrigado/a", pronunciation: "oh-bree-GAH-doo/dah" },
      { english: "Excuse me", local: "Com licença", pronunciation: "kohng lee-SEN-sah" },
      { english: "How much?", local: "Quanto custa?", pronunciation: "KWAN-too KOOS-tah" },
      { english: "Cheers", local: "Saúde", pronunciation: "sah-OO-deh" },
    ],
    reviews: [
      {
        nationality: "American",
        nationalityFlag: "🇺🇸",
        yearsLived: "2 years",
        review:
          "Lisbon felt like Europe's best-kept secret until everyone discovered it. The pace is gentle — fighting it makes life harder.",
      },
      {
        nationality: "British",
        nationalityFlag: "🇬🇧",
        yearsLived: "4 years",
        review:
          "Porto is kinder to budgets. Portuguese people go out of their way once you're not just passing through.",
      },
      {
        nationality: "Brazilian",
        nationalityFlag: "🇧🇷",
        yearsLived: "1 year",
        review:
          "The language helped, but bureaucracy still humbled me. Patience is the real visa.",
      },
    ],
  }),
};
