"use client";

import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { GeoJsonObject, Feature, Geometry } from "geojson";
import type { Layer, PathOptions } from "leaflet";
import { resolveCountryCode } from "@/lib/mock-data";
import type { PassportStamp } from "@/types/passport";

const GEOJSON_URL =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface CountryProperties {
  name?: string;
  ADMIN?: string;
  [key: string]: string | undefined;
}

export default function PersonalPassportMap({
  stamps,
  highlightedCountry,
}: {
  stamps: PassportStamp[];
  highlightedCountry: string | null;
}) {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);

  const stampCountries = new Set(
    stamps.map((s) => resolveCountryCode(s.country).toUpperCase())
  );
  const highlightCode = highlightedCountry
    ? resolveCountryCode(highlightedCountry).toUpperCase()
    : null;

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((data: GeoJsonObject) => setGeoData(data))
      .catch(() => {});
  }, []);

  const getStyle = useCallback(
    (feature?: Feature<Geometry, CountryProperties>): PathOptions => {
      if (!feature) return { fillOpacity: 0, weight: 0 };
      const name = feature.properties?.ADMIN ?? feature.properties?.name ?? "";
      const code = feature.properties?.["ISO_A2"] ?? "";
      const resolved = resolveCountryCode(name, code).toUpperCase();

      if (resolved === highlightCode) {
        return {
          fillColor: "#0d9488",
          fillOpacity: 0.65,
          color: "#0f766e",
          weight: 2.5,
          opacity: 1,
        };
      }

      if (stampCountries.has(resolved)) {
        return {
          fillColor: "#14b8a6",
          fillOpacity: 0.35,
          color: "#5eead4",
          weight: 1.5,
          opacity: 0.8,
        };
      }

      return {
        fillColor: "#e2e8f0",
        fillOpacity: 0.15,
        color: "#cbd5e1",
        weight: 0.5,
        opacity: 0.4,
      };
    },
    [stampCountries, highlightCode]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="border-b border-slate-100 bg-white px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
          Your Personal Map
        </p>
        <p className="text-sm text-slate-600">
          {highlightedCountry
            ? `${highlightedCountry} highlighted — your stamps light up the world`
            : "Countries you've collected stamps in"}
        </p>
      </div>
      <MapContainer
        center={[25, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        className="h-56 w-full z-0 sm:h-64"
        scrollWheelZoom={false}
        dragging
        worldCopyJump
      >
        <TileLayer
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {geoData && (
          <GeoJSON
            key={`${highlightCode}-${stampCountries.size}`}
            data={geoData}
            style={getStyle}
          />
        )}
      </MapContainer>
    </div>
  );
}
