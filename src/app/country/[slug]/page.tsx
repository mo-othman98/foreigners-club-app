import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CountryPageContent from "@/components/country/CountryPageContent";
import { getCountryBySlug, getAllCountrySlugs } from "@/lib/country-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCountrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    return { title: "Country Not Found — Foreigners Club" };
  }

  return {
    title: `${country.countryName} — Foreigner Insights | Foreigners Club`,
    description: `What it feels like to live in ${country.countryName} as a foreigner. Score: ${country.foreignerScore}/100. ${country.reviewCount} reviews from people who lived there.`,
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  return <CountryPageContent country={country} />;
}
