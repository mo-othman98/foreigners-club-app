import { resolveCountryCode } from "@/lib/mock-data";

export interface StampDesign {
  symbol: string;
  pattern: string;
  inkColor: string;
  borderStyle: "circle" | "rect" | "hex";
}

const DESIGNS: Record<string, StampDesign> = {
  MA: {
    symbol: "✦",
    pattern: "moroccan-star",
    inkColor: "#c2410c",
    borderStyle: "circle",
  },
  TR: {
    symbol: "☪",
    pattern: "turkish-crescent",
    inkColor: "#b91c1c",
    borderStyle: "circle",
  },
  PS: {
    symbol: "✵",
    pattern: "olive-branch",
    inkColor: "#15803d",
    borderStyle: "rect",
  },
  ES: {
    symbol: "☀",
    pattern: "iberian-sun",
    inkColor: "#c2410c",
    borderStyle: "rect",
  },
  JP: {
    symbol: "◎",
    pattern: "rising-sun",
    inkColor: "#dc2626",
    borderStyle: "circle",
  },
  DE: {
    symbol: "⬡",
    pattern: "eagle-shield",
    inkColor: "#1e3a5f",
    borderStyle: "hex",
  },
  FR: {
    symbol: "⚜",
    pattern: "fleur-de-lis",
    inkColor: "#1d4ed8",
    borderStyle: "rect",
  },
  GB: {
    symbol: "✠",
    pattern: "crown-mark",
    inkColor: "#1e3a5f",
    borderStyle: "circle",
  },
  US: {
    symbol: "★",
    pattern: "star-stripes",
    inkColor: "#1d4ed8",
    borderStyle: "rect",
  },
  PT: {
    symbol: "⚓",
    pattern: "maritime-cross",
    inkColor: "#15803d",
    borderStyle: "circle",
  },
  TH: {
    symbol: "๛",
    pattern: "temple-spire",
    inkColor: "#7c3aed",
    borderStyle: "circle",
  },
  MX: {
    symbol: "🌵",
    pattern: "aztec-sun",
    inkColor: "#15803d",
    borderStyle: "circle",
  },
  BR: {
    symbol: "◆",
    pattern: "southern-cross",
    inkColor: "#15803d",
    borderStyle: "circle",
  },
  IT: {
    symbol: "❋",
    pattern: "roman-laurel",
    inkColor: "#15803d",
    borderStyle: "rect",
  },
  KR: {
    symbol: "☯",
    pattern: "taegeuk",
    inkColor: "#b91c1c",
    borderStyle: "circle",
  },
  NL: {
    symbol: "✿",
    pattern: "tulip-mark",
    inkColor: "#c2410c",
    borderStyle: "rect",
  },
  AU: {
    symbol: "✦",
    pattern: "southern-star",
    inkColor: "#1d4ed8",
    borderStyle: "circle",
  },
  AE: {
    symbol: "◈",
    pattern: "desert-dhow",
    inkColor: "#b45309",
    borderStyle: "hex",
  },
  SG: {
    symbol: "◉",
    pattern: "lion-mark",
    inkColor: "#b91c1c",
    borderStyle: "rect",
  },
};

export function getStampDesign(country: string): StampDesign {
  const code = resolveCountryCode(country);
  return (
    DESIGNS[code] ?? {
      symbol: "✦",
      pattern: "generic",
      inkColor: "#0f766e",
      borderStyle: "circle",
    }
  );
}
