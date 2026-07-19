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
  if (score >= 70) return "text-green-600";
  if (score >= 45) return "text-yellow-600";
  return "text-red-600";
}

export function scoreRingColor(score: number): string {
  if (score >= 70) return "stroke-green-500";
  if (score >= 45) return "stroke-yellow-500";
  return "stroke-red-500";
}

export function dimensionBarColor(value: number): string {
  if (value >= 70) return "bg-green-500";
  if (value >= 45) return "bg-yellow-500";
  return "bg-red-500";
}

export function categoryScoreTextClass(value: number): string {
  if (value >= 70) return "text-green-600 font-medium";
  if (value >= 45) return "text-yellow-600 font-medium";
  return "text-red-600 font-medium";
}

export function dimensionBarValue(
  key: keyof ScoreDimensions,
  value: number
): number {
  if (key === "bureaucracyDifficulty") return 100 - value;
  return value;
}
