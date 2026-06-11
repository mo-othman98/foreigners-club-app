import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getDataDir } from "./data-dir";

export interface CountryFeedPost {
  id: string;
  countrySlug: string;
  authorEmail: string;
  authorName: string;
  caption: string;
  createdAt: string;
  imageExt: "jpg" | "png";
}

const DATA_DIR = getDataDir();
const META_FILE = path.join(DATA_DIR, "country-feed.json");
const IMAGE_DIR = path.join(DATA_DIR, "country-feed");
const MAX_POSTS_PER_COUNTRY = 200;

async function ensureMeta() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(META_FILE, "utf8");
  } catch {
    await writeFile(META_FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<CountryFeedPost[]> {
  await ensureMeta();
  const raw = await readFile(META_FILE, "utf8");
  try {
    return JSON.parse(raw) as CountryFeedPost[];
  } catch {
    return [];
  }
}

async function writeAll(posts: CountryFeedPost[]) {
  await ensureMeta();
  await writeFile(META_FILE, JSON.stringify(posts, null, 2), "utf8");
}

function normSlug(slug: string) {
  return slug.toLowerCase().trim();
}

function normEmail(email: string) {
  return email.toLowerCase().trim();
}

export function feedImagePath(post: CountryFeedPost): string {
  return path.join(IMAGE_DIR, post.countrySlug, `${post.id}.${post.imageExt}`);
}

export function feedImageApiPath(countrySlug: string, postId: string): string {
  return `/api/countries/${encodeURIComponent(countrySlug)}/feed/${encodeURIComponent(postId)}/image`;
}

export async function getCountryFeedPosts(
  countrySlug: string
): Promise<CountryFeedPost[]> {
  const slug = normSlug(countrySlug);
  const all = await readAll();
  return all
    .filter((p) => normSlug(p.countrySlug) === slug)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_POSTS_PER_COUNTRY);
}

export async function postCountryFeedPhoto(input: {
  countrySlug: string;
  authorEmail: string;
  authorName: string;
  caption?: string;
  imageBase64: string;
  imageMime?: string;
}): Promise<CountryFeedPost> {
  const base64 = input.imageBase64.trim();
  if (!base64) throw new Error("Image data is required");

  const mime = input.imageMime ?? "image/jpeg";
  const imageExt: "jpg" | "png" = mime.includes("png") ? "png" : "jpg";
  const buffer = Buffer.from(base64, "base64");
  if (buffer.length < 100) throw new Error("Invalid image data");
  if (buffer.length > 4 * 1024 * 1024) {
    throw new Error("Image must be under 4MB");
  }

  const post: CountryFeedPost = {
    id: randomUUID(),
    countrySlug: normSlug(input.countrySlug),
    authorEmail: normEmail(input.authorEmail || "anonymous@foreigners.club"),
    authorName: (input.authorName || "Anonymous").trim().slice(0, 80),
    caption: (input.caption ?? "").trim().slice(0, 280),
    createdAt: new Date().toISOString(),
    imageExt,
  };

  const dir = path.join(IMAGE_DIR, post.countrySlug);
  await mkdir(dir, { recursive: true });
  await writeFile(feedImagePath(post), buffer);

  const all = await readAll();
  all.push(post);

  const byCountry = new Map<string, CountryFeedPost[]>();
  for (const p of all) {
    const key = normSlug(p.countrySlug);
    const bucket = byCountry.get(key) ?? [];
    bucket.push(p);
    byCountry.set(key, bucket);
  }

  const trimmed: CountryFeedPost[] = [];
  for (const [, posts] of byCountry) {
    const sorted = [...posts].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    trimmed.push(...sorted.slice(0, MAX_POSTS_PER_COUNTRY));
  }

  await writeAll(trimmed);
  return post;
}

export async function readFeedImage(
  countrySlug: string,
  postId: string
): Promise<{ buffer: Buffer; mime: string } | null> {
  const all = await readAll();
  const post = all.find(
    (p) => p.id === postId && normSlug(p.countrySlug) === normSlug(countrySlug)
  );
  if (!post) return null;

  try {
    const buffer = await readFile(feedImagePath(post));
    return {
      buffer,
      mime: post.imageExt === "png" ? "image/png" : "image/jpeg",
    };
  } catch {
    return null;
  }
}
