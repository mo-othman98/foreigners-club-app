import type { ScoreDimensions } from "@/types/country";

export const SCORE_LABELS: Record<keyof ScoreDimensions, string> = {
  friendliness: "Friendliness",
  cost: "Cost of Living",
  easeOfMakingFriends: "Ease of Making Friends",
  safety: "Safety",
  languageAccessibility: "Language Accessibility",
  bureaucracyDifficulty: "Bureaucracy",
};

export function languageAccessibilityLabel(score: number): string {
  if (score >= 85) return "Very High";
  if (score >= 70) return "High";
  if (score >= 50) return "Moderate";
  return "Low";
}

export function calculateForeignerScore(dimensions: ScoreDimensions): number {
  const bureaucracyEase = 100 - dimensions.bureaucracyDifficulty;

  const score =
    dimensions.friendliness * 0.2 +
    dimensions.cost * 0.15 +
    dimensions.easeOfMakingFriends * 0.2 +
    dimensions.safety * 0.2 +
    dimensions.languageAccessibility * 0.1 +
    bureaucracyEase * 0.15;

  return Math.round(Math.min(100, Math.max(0, score)));
}

export function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 65) return "text-teal-600";
  if (score >= 50) return "text-amber-600";
  return "text-orange-600";
}

export function scoreRingColor(score: number): string {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 65) return "stroke-teal-500";
  if (score >= 50) return "stroke-amber-500";
  return "stroke-orange-500";
}

export function dimensionBarValue(
  key: keyof ScoreDimensions,
  value: number
): number {
  if (key === "bureaucracyDifficulty") return 100 - value;
  return value;
}
