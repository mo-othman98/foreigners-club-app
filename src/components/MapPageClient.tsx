"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { getCountryBySlug } from "@/lib/country-data";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        <p className="text-sm text-slate-600">Preparing map…</p>
      </div>
    </div>
  ),
});

export default function MapPageClient() {
  const searchParams = useSearchParams();
  const highlightSlug = searchParams.get("highlight");
  const embed = searchParams.get("embed") === "1";
  const highlightCountry = highlightSlug
    ? getCountryBySlug(highlightSlug)?.countryName ?? null
    : null;

  return (
    <div
      className={`relative flex flex-col ${
        embed ? "h-screen" : "h-[calc(100vh-4rem)]"
      }`}
    >
      {!highlightCountry && !embed && (
        <div className="absolute left-4 top-4 z-[600] max-w-xs rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
            World Map
          </p>
          <p className="mt-0.5 text-sm font-medium text-slate-800">
            Click a country to explore
          </p>
        </div>
      )}
      <MapView highlightCountry={highlightCountry} />
    </div>
  );
}
