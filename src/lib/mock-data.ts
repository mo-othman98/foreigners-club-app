import type { CountryInsightData } from "@/types";

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  "United States of America": "US",
  "United States": "US",
  "United Kingdom": "GB",
  Germany: "DE",
  France: "FR",
  Spain: "ES",
  Italy: "IT",
  Japan: "JP",
  "South Korea": "KR",
  "Korea, Republic of": "KR",
  Thailand: "TH",
  Mexico: "MX",
  Brazil: "BR",
  Portugal: "PT",
  Netherlands: "NL",
  Australia: "AU",
  Canada: "CA",
  India: "IN",
  "United Arab Emirates": "AE",
  Singapore: "SG",
  Sweden: "SE",
  Norway: "NO",
  Poland: "PL",
  Vietnam: "VN",
  Indonesia: "ID",
  Turkey: "TR",
  "South Africa": "ZA",
  Argentina: "AR",
  Colombia: "CO",
  Philippines: "PH",
  Taiwan: "TW",
  China: "CN",
  "People's Republic of China": "CN",
  Switzerland: "CH",
  Austria: "AT",
  Belgium: "BE",
  Ireland: "IE",
  "New Zealand": "NZ",
  Morocco: "MA",
  Palestine: "PS",
  "State of Palestine": "PS",
  Egypt: "EG",
  Chile: "CL",
  Peru: "PE",
  Greece: "GR",
  "Czech Republic": "CZ",
  Czechia: "CZ",
  Hungary: "HU",
  Romania: "RO",
  Ukraine: "UA",
  Russia: "RU",
  "Russian Federation": "RU",
  Malaysia: "MY",
  "Costa Rica": "CR",
  Panama: "PA",
  Ecuador: "EC",
  Uruguay: "UY",
  Denmark: "DK",
  Finland: "FI",
  Iceland: "IS",
  Croatia: "HR",
  Serbia: "RS",
  Bulgaria: "BG",
  Israel: "IL",
  Jordan: "JO",
  Lebanon: "LB",
  Kenya: "KE",
  Nigeria: "NG",
  Ghana: "GH",
  Ethiopia: "ET",
  "Saudi Arabia": "SA",
  Qatar: "QA",
  Bahrain: "BH",
  Kuwait: "KW",
  Oman: "OM",
  Pakistan: "PK",
  Bangladesh: "BD",
  "Sri Lanka": "LK",
  Nepal: "NP",
  Cambodia: "KH",
  Laos: "LA",
  Myanmar: "MM",
  Mongolia: "MN",
  Kazakhstan: "KZ",
  Uzbekistan: "UZ",
  Georgia: "GE",
  Armenia: "AM",
  Azerbaijan: "AZ",
};

export function resolveCountryCode(
  name: string,
  code?: string
): string {
  if (code && code !== "-99" && code.length === 2) return code.toUpperCase();
  if (COUNTRY_NAME_TO_CODE[name]) return COUNTRY_NAME_TO_CODE[name];
  const normalized = name.trim();
  for (const [key, mapped] of Object.entries(COUNTRY_NAME_TO_CODE)) {
    if (key.toLowerCase() === normalized.toLowerCase()) return mapped;
  }
  return normalized.slice(0, 2).toUpperCase();
}

export const COUNTRY_INSIGHTS: Record<string, CountryInsightData> = {
  US: {
    countryCode: "US",
    countryName: "United States",
    costOfLiving: "High in coastal cities; varies dramatically by state",
    friendlinessRating: 3.8,
    languageSituation:
      "English dominates daily life. Spanish is widely spoken in many regions.",
    culturalTips: [
      "Tipping 15–20% is expected at restaurants, not optional.",
      "Small talk with strangers is normal and friendly, not intrusive.",
      "Healthcare is tied to employment — plan coverage before arriving.",
    ],
    commonMistakes: [
      "Assuming public transit exists everywhere — many cities are car-dependent.",
      "Underestimating sales tax added at checkout.",
      "Thinking 'How are you?' always expects a real answer.",
    ],
    foreignerQuotes: [
      "The paperwork for visas and bank accounts took longer than finding a job.",
      "People are warm in conversation but building deep friendships takes time.",
      "I was shocked by how different each state feels — it's like many countries in one.",
    ],
    activeUserCount: 2847,
  },
  DE: {
    countryCode: "DE",
    countryName: "Germany",
    costOfLiving: "Moderate; Berlin affordable, Munich and Frankfurt expensive",
    friendlinessRating: 3.2,
    languageSituation:
      "German is essential for bureaucracy and many workplaces. English works in tech hubs.",
    culturalTips: [
      "Sunday quiet hours are real — most shops close.",
      "Cash is still common; always carry some euros.",
      "Direct communication is cultural, not rudeness.",
    ],
    commonMistakes: [
      "Crossing the street on red — locals take crossing signals seriously.",
      "Arriving late without notice to social plans.",
      "Ignoring the Pfand (deposit) system on bottles.",
    ],
    foreignerQuotes: [
      "Once I learned German, doors opened — before that, life felt administratively frozen.",
      "The work-life balance is incredible once you adapt to the formality.",
      "Berlin feels international; smaller towns require real integration effort.",
    ],
    activeUserCount: 1523,
  },
  JP: {
    countryCode: "JP",
    countryName: "Japan",
    costOfLiving: "High in Tokyo; reasonable in smaller cities",
    friendlinessRating: 4.1,
    languageSituation:
      "Japanese is critical for daily life outside major tourist areas. English signage exists but limited.",
    culturalTips: [
      "Remove shoes indoors when others do — watch and follow.",
      "Trash sorting rules are strict and neighborhood-specific.",
      "Silence on trains is a strong social norm.",
    ],
    commonMistakes: [
      "Speaking loudly on public transport.",
      "Tipping — it can cause confusion or offense.",
      "Assuming credit cards work everywhere; carry cash.",
    ],
    foreignerQuotes: [
      "The kindness is real, but the loneliness of not speaking Japanese hit hard at first.",
      "Convenience stores are a lifeline when you're still learning kanji.",
      "Once you understand the unspoken rules, daily life becomes peaceful.",
    ],
    activeUserCount: 1892,
  },
  ES: {
    countryCode: "ES",
    countryName: "Spain",
    costOfLiving: "Moderate; Madrid and Barcelona pricier than south",
    friendlinessRating: 4.3,
    languageSituation:
      "Spanish is primary. Catalan, Basque, and Galician in regional areas.",
    culturalTips: [
      "Lunch is late (2–3pm), dinner often after 9pm.",
      "Siesta culture varies — don't assume all shops close.",
      "Social life happens in public spaces, not just at home.",
    ],
    commonMistakes: [
      "Eating dinner at 7pm like back home.",
      "Ignoring regional identity — Catalonia isn't just 'Spain' to locals.",
      "Expecting fast bureaucratic processes.",
    ],
    foreignerQuotes: [
      "Spaniards welcomed me into their circle once I stopped rushing meals.",
      "Bureaucracy is slow, but the lifestyle reward is worth it.",
      "Learning even basic Spanish transformed how locals treated me.",
    ],
    activeUserCount: 1341,
  },
  TH: {
    countryCode: "TH",
    countryName: "Thailand",
    costOfLiving: "Low to moderate; Bangkok rising, Chiang Mai still affordable",
    friendlinessRating: 4.5,
    languageSituation:
      "Thai for daily life. English in tourist and expat areas only.",
    culturalTips: [
      "Respect for the monarchy and religion is deeply important.",
      "Never touch someone's head or point feet at people or Buddha images.",
      "Smiles often mean politeness, not necessarily agreement.",
    ],
    commonMistakes: [
      "Treating Thailand as a permanent vacation — visa rules are strict.",
      "Disrespecting temples with clothing or behavior.",
      "Assuming 'yes' means yes — it often means 'I hear you.'",
    ],
    foreignerQuotes: [
      "The warmth is genuine, but long-term life requires respecting Thai norms.",
      "Visa runs and immigration rules are the biggest stress for foreigners.",
      "Learning Thai opened a completely different layer of the country.",
    ],
    activeUserCount: 987,
  },
  GB: {
    countryCode: "GB",
    countryName: "United Kingdom",
    costOfLiving: "High, especially London",
    friendlinessRating: 3.5,
    languageSituation: "English everywhere. Regional accents can be challenging at first.",
    culturalTips: [
      "Queueing is sacred — never cut in line.",
      "Politeness often hides direct opinions — read between the lines.",
      "Pubs are social hubs, not just drinking spots.",
    ],
    commonMistakes: [
      "Confusing UK countries — England, Scotland, Wales, Northern Ireland differ.",
      "Underestimating rain and heating costs.",
      "Over-sharing personal details too quickly.",
    ],
    foreignerQuotes: [
      "London is global but expensive — I felt more at home in Manchester.",
      "The humor is dry; once you get it, you feel inside the culture.",
      "NHS registration was smooth, but housing was a nightmare.",
    ],
    activeUserCount: 1654,
  },
  FR: {
    countryCode: "FR",
    countryName: "France",
    costOfLiving: "High in Paris; moderate in provinces",
    friendlinessRating: 3.4,
    languageSituation:
      "French is expected. Attempting French earns respect even if imperfect.",
    culturalTips: [
      "Always greet shopkeepers with 'Bonjour' before asking questions.",
      "Lunch breaks are real — don't expect fast service at midday.",
      "Administrative paperwork (dossiers) is an art form.",
    ],
    commonMistakes: [
      "Starting conversations in English without a greeting in French.",
      "Rushing meals or eating while walking.",
      "Expecting stores open on Sundays in smaller towns.",
    ],
    foreignerQuotes: [
      "Paris was cold at first until I learned the social codes.",
      "French bureaucracy is intense but the healthcare and food are worth it.",
      "Once locals saw me trying, everything softened.",
    ],
    activeUserCount: 1432,
  },
  MX: {
    countryCode: "MX",
    countryName: "Mexico",
    costOfLiving: "Low to moderate; CDMX and coastal towns vary",
    friendlinessRating: 4.6,
    languageSituation: "Spanish essential. English in tourist zones only.",
    culturalTips: [
      "Family and community ties shape social life.",
      "Time is flexible — 'ahorita' doesn't mean right now.",
      "Regional food and culture differ enormously by state.",
    ],
    commonMistakes: [
      "Reducing Mexico to beaches and tacos.",
      "Ignoring safety differences between neighborhoods and cities.",
      "Being impatient with slower administrative timelines.",
    ],
    foreignerQuotes: [
      "Mexicans made me feel like family once I showed up for their world.",
      "The warmth is real — integration means showing respect for local rhythm.",
      "Learning street Spanish vs textbook Spanish was a game changer.",
    ],
    activeUserCount: 876,
  },
  PT: {
    countryCode: "PT",
    countryName: "Portugal",
    costOfLiving: "Moderate; Lisbon rising, smaller cities affordable",
    friendlinessRating: 4.4,
    languageSituation:
      "Portuguese for daily life. English common in Lisbon and Porto.",
    culturalTips: [
      "Coffee culture is daily ritual — espresso at the counter is normal.",
      "Coastal vs inland lifestyles differ significantly.",
      "Bureaucracy is slow but people are patient helpers.",
    ],
    commonMistakes: [
      "Assuming Portuguese is like Spanish — locals notice.",
      "Expecting fast internet and services outside cities.",
      "Ignoring winter dampness in older apartments.",
    ],
    foreignerQuotes: [
      "Lisbon felt like Europe's best-kept secret until everyone discovered it.",
      "The pace is gentle — fighting it makes life harder.",
      "Portuguese people go out of their way once you're not just passing through.",
    ],
    activeUserCount: 743,
  },
  KR: {
    countryCode: "KR",
    countryName: "South Korea",
    costOfLiving: "Moderate to high in Seoul",
    friendlinessRating: 3.9,
    languageSituation:
      "Korean is essential outside international workplaces. English education is widespread but spoken comfort varies.",
    culturalTips: [
      "Age and hierarchy shape language — honorifics matter.",
      "Group dining and sharing food is the norm.",
      "Delivery culture is exceptional — learn the apps early.",
    ],
    commonMistakes: [
      "Pouring your own drink at group meals.",
      "Writing names in red ink.",
      "Assuming K-culture represents all daily Korean life.",
    ],
    foreignerQuotes: [
      "Seoul is futuristic but lonely until you find your community.",
      "Work culture was the hardest adjustment, not the language.",
      "Once I understood nunchi, social life became much easier.",
    ],
    activeUserCount: 1124,
  },
  AU: {
    countryCode: "AU",
    countryName: "Australia",
    costOfLiving: "High in Sydney and Melbourne",
    friendlinessRating: 4.2,
    languageSituation: "English. Slang and humor take time to decode.",
    culturalTips: [
      "Outdoor lifestyle is central — beaches and parks are social spaces.",
      "Casual tone at work doesn't mean low standards.",
      "Sun safety is serious — slip, slop, slap.",
    ],
    commonMistakes: [
      "Underestimating distances between cities.",
      "Ignoring wildlife and ocean safety warnings.",
      "Assuming Australia is just 'warm Britain.'",
    ],
    foreignerQuotes: [
      "Australians are easygoing until you badmouth their sport team.",
      "The visa and points system dominated my first year mentally.",
      "Melbourne's multicultural food scene made me feel less homesick.",
    ],
    activeUserCount: 892,
  },
  SG: {
    countryCode: "SG",
    countryName: "Singapore",
    costOfLiving: "High, especially housing",
    friendlinessRating: 3.7,
    languageSituation:
      "English is official and widely used. Mandarin, Malay, and Tamil also present.",
    culturalTips: [
      "Rules are strict and enforced — fines are real.",
      "Food courts (hawker centres) are cultural institutions.",
      "Efficiency is valued — be prepared and punctual.",
    ],
    commonMistakes: [
      "Chewing gum, littering, or eating on transit.",
      "Assuming it's cheap because it's in Southeast Asia.",
      "Ignoring the mix of Asian and Western business cultures.",
    ],
    foreignerQuotes: [
      "Everything works — but I had to build intentionality to feel rooted.",
      "It's a launchpad for Asia, not always a place to settle cheaply.",
      "The expat bubble is comfortable; breaking out took effort.",
    ],
    activeUserCount: 654,
  },
  BR: {
    countryCode: "BR",
    countryName: "Brazil",
    costOfLiving: "Moderate; São Paulo and Rio pricier",
    friendlinessRating: 4.7,
    languageSituation: "Portuguese essential. Spanish helps little.",
    culturalTips: [
      "Physical affection and warmth in greetings is normal.",
      "Regional culture differs hugely — south vs northeast vs Amazon.",
      "Music and football are genuine social glue.",
    ],
    commonMistakes: [
      "Showing up overly formal at casual gatherings.",
      "Underestimating urban safety awareness needs.",
      "Expecting European-style punctuality at social events.",
    ],
    foreignerQuotes: [
      "Brazilians embrace you fast — I felt less like a foreigner than anywhere else.",
      "Learning Portuguese was non-negotiable for real life.",
      "Bureaucracy is chaotic, but human warmth compensates daily.",
    ],
    activeUserCount: 1089,
  },
  NL: {
    countryCode: "NL",
    countryName: "Netherlands",
    costOfLiving: "High, especially Amsterdam housing",
    friendlinessRating: 3.6,
    languageSituation:
      "Dutch is national language but English proficiency is excellent.",
    culturalTips: [
      "Direct feedback is normal — don't take it personally.",
      "Bicycles have priority — learn the rules fast.",
      "Calendar culture is strong — plan social life ahead.",
    ],
    commonMistakes: [
      "Walking in bike lanes.",
      "Assuming Amsterdam represents all of the Netherlands.",
      "Expecting warmth without investing in Dutch language.",
    ],
    foreignerQuotes: [
      "The directness shocked me, then became refreshing.",
      "Finding housing in Amsterdam was harder than my job search.",
      "Dutch people are private until you're in their circle — then loyal.",
    ],
    activeUserCount: 721,
  },
  AE: {
    countryCode: "AE",
    countryName: "United Arab Emirates",
    costOfLiving: "High in Dubai and Abu Dhabi",
    friendlinessRating: 3.8,
    languageSituation:
      "English works in daily expat life. Arabic deepens local relationships.",
    culturalTips: [
      "Respect Islamic customs, especially during Ramadan.",
      "Dress modestly in government and traditional areas.",
      "Expat life can feel transient — communities rotate often.",
    ],
    commonMistakes: [
      "Public displays of affection beyond cultural norms.",
      "Assuming all emirates share the same vibe — they don't.",
      "Ignoring employment contract terms tied to visa status.",
    ],
    foreignerQuotes: [
      "Dubai is a hub, not always a home — plan your roots intentionally.",
      "Tax-free salary is great, but rent can absorb the gain.",
      "The diversity is unmatched — everyone is from somewhere else.",
    ],
    activeUserCount: 1438,
  },
};

export function getCountryInsight(
  countryName: string,
  countryCode?: string
): CountryInsightData {
  const code = countryCode ?? resolveCountryCode(countryName);
  const existing = COUNTRY_INSIGHTS[code];

  if (existing) return existing;

  return {
    countryCode: code,
    countryName,
    costOfLiving: "Varies by city — urban centers typically cost more",
    friendlinessRating: 3.5 + Math.random() * 1.2,
    languageSituation:
      "Local language dominates daily life. English may work in international workplaces.",
    culturalTips: [
      "Learn basic local greetings — effort is noticed and appreciated.",
      "Observe how locals handle queues, meals, and personal space.",
      "Bureaucracy may move slower than you're used to — patience helps.",
    ],
    commonMistakes: [
      "Comparing everything to your home country out loud.",
      "Staying only in expat bubbles without engaging locally.",
      "Underestimating how much paperwork living abroad requires.",
    ],
    foreignerQuotes: [
      `"${countryName} surprised me — the tourist version and the living version are different worlds."`,
      `"The first three months were admin and loneliness. Month four is when it started feeling real."`,
      `"Nobody tells you how much you relearn — grocery stores, humor, even how to make friends."`,
    ],
    activeUserCount: Math.floor(120 + Math.random() * 880),
  };
}

export const POPULAR_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
];
