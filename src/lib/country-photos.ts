import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getCountryBySlug } from "./country-data";
import { getDataDir } from "./data-dir";
import { fetchWikimediaCountryPhotos } from "./wikimedia-photos";

export interface CountryPhoto {
  id: string;
  imageUrl: string;
  attribution?: string;
  source: "google" | "wikimedia";
}

interface CachedPhoto extends CountryPhoto {
  reference: string;
}

interface PhotoCacheEntry {
  countrySlug: string;
  countryName: string;
  refreshedAt: string;
  photos: CachedPhoto[];
}

interface PhotoCacheFile {
  [countrySlug: string]: PhotoCacheEntry;
}

const DATA_DIR = getDataDir();
const CACHE_FILE = path.join(DATA_DIR, "country-photos-cache.json");
const PHOTO_COUNT = 5;
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function photoId(reference: string): string {
  return createHash("sha1").update(reference).digest("hex").slice(0, 12);
}

export function countryPhotoImagePath(
  countrySlug: string,
  photoId: string
): string {
  return `/api/countries/${encodeURIComponent(countrySlug)}/photos/${encodeURIComponent(photoId)}/image`;
}

async function readCache(): Promise<PhotoCacheFile> {
  try {
    const raw = await readFile(CACHE_FILE, "utf8");
    return JSON.parse(raw) as PhotoCacheFile;
  } catch {
    return {};
  }
}

async function writeCache(cache: PhotoCacheFile): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
}

function googleApiKey(): string | undefined {
  return (
    process.env.GOOGLE_PLACES_API_KEY ??
    process.env.GOOGLE_MAPS_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );
}

interface GooglePlaceResult {
  photos?: { photo_reference: string; html_attributions?: string[] }[];
  name?: string;
}

async function fetchGooglePlacePhotos(
  countrySlug: string,
  countryName: string
): Promise<CachedPhoto[]> {
  const apiKey = googleApiKey();
  if (!apiKey) return [];

  const query = encodeURIComponent(`${countryName} landmarks scenery`);
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;

  const res = await fetch(searchUrl, { cache: "no-store" });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    results?: GooglePlaceResult[];
    status?: string;
  };

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    return [];
  }

  const photos: CachedPhoto[] = [];
  const seen = new Set<string>();

  for (const place of data.results ?? []) {
    for (const photo of place.photos ?? []) {
      if (!photo.photo_reference || seen.has(photo.photo_reference)) continue;
      seen.add(photo.photo_reference);
      const id = photoId(photo.photo_reference);
      photos.push({
        id,
        imageUrl: countryPhotoImagePath(countrySlug, id),
        attribution: photo.html_attributions?.[0]?.replace(/<[^>]+>/g, "") ?? place.name,
        source: "google",
        reference: photo.photo_reference,
      });
      if (photos.length >= PHOTO_COUNT) return photos;
    }
  }

  return photos;
}

async function fetchWikimediaPhotos(
  countrySlug: string,
  countryName: string
): Promise<CachedPhoto[]> {
  const results = await fetchWikimediaCountryPhotos(countryName, PHOTO_COUNT);
  return results.map((photo) => ({
    id: photo.id,
    imageUrl: countryPhotoImagePath(countrySlug, photo.id),
    attribution: photo.attribution,
    source: "wikimedia" as const,
    reference: photo.imageUrl,
  }));
}

/** Resolve image bytes for a cached photo id (Google redirect or Wikimedia URL). */
export async function resolveCountryPhotoSource(
  countrySlug: string,
  id: string
): Promise<{ url: string; headers?: Record<string, string> } | null> {
  const cache = await readCache();
  const entry = cache[countrySlug];
  if (!entry) return null;

  const photo = entry.photos.find((p) => p.id === id);
  if (!photo) return null;

  const apiKey = googleApiKey();
  if (photo.source === "google" && apiKey) {
    return {
      url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${encodeURIComponent(photo.reference)}&key=${apiKey}`,
    };
  }

  if (photo.source === "wikimedia") {
    return { url: photo.reference };
  }

  return null;
}

function toPublicPhotos(photos: CachedPhoto[]): CountryPhoto[] {
  return photos.map(({ id, imageUrl, attribution, source }) => ({
    id,
    imageUrl,
    attribution,
    source,
  }));
}

export async function getCountryPhotos(
  slug: string,
  countryName?: string,
  options?: { refresh?: boolean }
): Promise<{
  countrySlug: string;
  countryName: string;
  photos: CountryPhoto[];
  source: "google" | "wikimedia" | "none";
}> {
  const country = getCountryBySlug(slug);
  const name = countryName ?? country?.countryName ?? slug;
  const canonical = country?.slug ?? slug;

  const cache = await readCache();
  const existing = cache[canonical];
  const fresh =
    existing &&
    !options?.refresh &&
    Date.now() - new Date(existing.refreshedAt).getTime() < CACHE_TTL_MS;

  if (fresh && existing.photos.length > 0) {
    return {
      countrySlug: canonical,
      countryName: existing.countryName,
      photos: toPublicPhotos(existing.photos),
      source: existing.photos[0]?.source ?? "none",
    };
  }

  let photos = await fetchGooglePlacePhotos(canonical, name);
  let source: "google" | "wikimedia" | "none" = photos.length ? "google" : "none";

  if (photos.length < PHOTO_COUNT) {
    const wiki = await fetchWikimediaPhotos(canonical, name);
    if (wiki.length > 0 && wiki.length >= photos.length) {
      photos = wiki;
      source = "wikimedia";
    }
  }

  const entry: PhotoCacheEntry = {
    countrySlug: canonical,
    countryName: name,
    refreshedAt: new Date().toISOString(),
    photos: photos.slice(0, PHOTO_COUNT),
  };

  cache[canonical] = entry;
  await writeCache(cache);

  return {
    countrySlug: canonical,
    countryName: name,
    photos: toPublicPhotos(entry.photos),
    source: entry.photos.length ? source : "none",
  };
}
