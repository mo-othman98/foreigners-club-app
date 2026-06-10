"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COUNTRY_HUBS } from "@/lib/country-hubs";
import { getCountryBySlug } from "@/lib/country-data";
import CountryPageContent from "@/components/country/CountryPageContent";

const FEATURED = Object.values(COUNTRY_HUBS);

export default function ExplorePageClient() {
  const searchParams = useSearchParams();
  const countrySlug = searchParams.get("country");

  if (countrySlug) {
    const country =
      COUNTRY_HUBS[countrySlug] ?? getCountryBySlug(countrySlug);
    if (country) {
      return (
        <div>
          <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
            <Link
              href="/explore"
              className="text-sm font-medium text-teal-600 hover:text-teal-800"
            >
              ← All countries
            </Link>
          </div>
          <CountryPageContent country={country} />
        </div>
      );
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-teal-600">
          Cultural Atlas
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Explore
        </h1>
        <p className="mt-3 max-w-xl text-slate-600">
          What is it like living here as a foreigner — not a travel guide.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((country) => (
          <Link
            key={country.slug}
            href={`/explore?country=${country.slug}`}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{country.flag}</span>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                {(country.foreignerScore / 10).toFixed(1)}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-teal-800">
              {country.countryName}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
