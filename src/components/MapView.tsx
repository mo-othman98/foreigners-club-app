"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import type { GeoJsonObject, Feature, Geometry } from "geojson";
import type { Layer, PathOptions } from "leaflet";

// Fix Leaflet default marker icons when bundled (prevents broken tile layer init)
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
    ._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}
import { getSlugFromCountry } from "@/lib/country-data";
import { resolveCountryCode } from "@/lib/mock-data";
import MapResizer from "./MapResizer";

const GEOJSON_SOURCES = [
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
  "https://cdn.jsdelivr.net/gh/datasets/geo-countries@master/data/countries.geojson",
];

const defaultStyle: PathOptions = {
  fillColor: "#0d9488",
  fillOpacity: 0.15,
  color: "#94a3b8",
  weight: 1,
  opacity: 0.6,
};

const hoverStyle: PathOptions = {
  fillColor: "#0d9488",
  fillOpacity: 0.4,
  color: "#0f766e",
  weight: 1.5,
  opacity: 0.9,
};

const highlightStyle: PathOptions = {
  fillColor: "#0f766e",
  fillOpacity: 0.55,
  color: "#134e4a",
  weight: 2.5,
  opacity: 1,
};

interface CountryProperties {
  name?: string;
  ADMIN?: string;
  [key: string]: string | undefined;
}

interface MapViewProps {
  highlightCountry?: string | null;
}

async function loadGeoData(): Promise<GeoJsonObject> {
  let lastError: Error | null = null;
  for (const url of GEOJSON_SOURCES) {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as GeoJsonObject;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("fetch failed");
    }
  }
  throw lastError ?? new Error("Could not load map data");
}

export default function MapView({ highlightCountry }: MapViewProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const highlightCode = highlightCountry
    ? resolveCountryCode(highlightCountry).toUpperCase()
    : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadGeoData()
      .then((data) => {
        if (!cancelled) {
          setGeoData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load country boundaries. Please refresh.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  const navigateToCountry = useCallback(
    (name: string, code?: string) => {
      const slug = getSlugFromCountry(name, code);
      router.push(`/explore?country=${slug}`);
    },
    [router]
  );

  const geoJsonStyle = useCallback(
    (feature?: Feature<Geometry, CountryProperties>): PathOptions => {
      if (!feature || !highlightCode) return defaultStyle;
      const name = feature.properties?.ADMIN ?? feature.properties?.name ?? "";
      const code = feature.properties?.["ISO_A2"];
      const resolved = resolveCountryCode(name, code).toUpperCase();
      return resolved === highlightCode ? highlightStyle : defaultStyle;
    },
    [highlightCode]
  );

  const onEachFeature = useCallback(
    (feature: Feature<Geometry, CountryProperties>, layer: Layer) => {
      const name =
        feature.properties?.ADMIN ?? feature.properties?.name ?? "Unknown";
      const code = feature.properties?.["ISO_A2"];
      const resolved = resolveCountryCode(name, code).toUpperCase();
      const isHighlighted = resolved === highlightCode;

      layer.on({
        mouseover: (e) => {
          const target = e.target;
          if (!isHighlighted) target.setStyle(hoverStyle);
          target.bringToFront();
          setHoveredName(name);
        },
        mouseout: (e) => {
          const target = e.target;
          target.setStyle(isHighlighted ? highlightStyle : defaultStyle);
          setHoveredName(null);
        },
        click: () => navigateToCountry(name, code),
      });
    },
    [navigateToCountry, highlightCode]
  );

  if (!mounted) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[400px] w-full">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            <p className="text-sm text-slate-600">Loading world map…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-50 px-6">
          <p className="text-center text-sm text-red-600">{error}</p>
        </div>
      )}

      {highlightCountry && !loading && !error && (
        <div className="absolute left-4 top-4 z-[600] rounded-2xl border border-teal-200 bg-teal-50/95 px-4 py-3 shadow-lg backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
            From your passport
          </p>
          <p className="mt-0.5 text-sm font-medium text-teal-900">
            {highlightCountry} highlighted
          </p>
        </div>
      )}

      <MapContainer
        center={[25, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={8}
        className="h-full w-full z-0"
        style={{ height: "100%", width: "100%", minHeight: 400 }}
        scrollWheelZoom
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapResizer />
        {geoData && (
          <GeoJSON
            key={highlightCode ?? "default"}
            data={geoData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {!loading && !error && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-[500] -translate-x-1/2">
          <div className="rounded-full bg-white/95 px-5 py-2.5 text-sm font-medium text-slate-600 shadow-lg backdrop-blur-sm">
            {hoveredName
              ? `Open ${hoveredName} →`
              : "Click any country to explore its knowledge hub"}
          </div>
        </div>
      )}
    </div>
  );
}
