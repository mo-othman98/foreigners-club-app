import type { CountryPageData } from "@/types/country";
import CountryHeader from "./CountryHeader";
import ForeignerScoreCard from "./ForeignerScoreCard";
import LivedExperienceSection from "./LivedExperienceSection";
import RealityCheckSection from "./RealityCheckSection";
import CulturalSurvivalGuide from "./CulturalSurvivalGuide";
import MusicSection from "./MusicSection";
import LanguageSection from "./LanguageSection";
import LanguageDistributionSection from "./LanguageDistribution";
import TopCitiesSection from "./TopCitiesSection";
import ForeignerReviews from "./ForeignerReviews";

export default function CountryPageContent({
  country,
}: {
  country: CountryPageData;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <CountryHeader country={country} />

      <div className="mt-8 space-y-12">
        <ForeignerScoreCard
          score={country.foreignerScore}
          dimensions={country.scoreDimensions}
          languageLabel={country.languageAccessibilityLabel}
        />

        {country.topCities && country.topCities.length > 0 && (
          <TopCitiesSection cities={country.topCities} />
        )}

        {country.languageDistribution &&
          country.languageDistribution.length > 0 && (
            <LanguageDistributionSection
              countryName={country.countryName}
              distribution={country.languageDistribution}
              recommended={country.recommendedLanguages}
            />
          )}

        <LivedExperienceSection
          loves={country.whatForeignersLove}
          challenges={country.biggestChallenges}
        />

        <RealityCheckSection statements={country.realityChecks} />

        <div className="grid gap-12 lg:grid-cols-2">
          <CulturalSurvivalGuide items={country.survivalGuide} />
          <div className="space-y-12">
            <MusicSection songs={country.popularSongs} />
            <LanguageSection phrases={country.languagePhrases} />
          </div>
        </div>

        <ForeignerReviews
          reviews={country.reviews}
          totalCount={country.reviewCount}
        />
      </div>

      <p className="mt-16 text-center text-xs text-slate-400">
        Lived experience data from foreigners — not a travel guide.
      </p>
    </div>
  );
}
