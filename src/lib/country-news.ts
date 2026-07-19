import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getCountryBySlug } from "./country-data";
import { getDataDir } from "./data-dir";

export interface CountryNewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

export interface CountryNewsBundle {
  countrySlug: string;
  countryName: string;
  weekKey: string;
  refreshedAt: string;
  articles: CountryNewsArticle[];
}

interface NewsCacheFile {
  [countrySlug: string]: CountryNewsBundle;
}

interface RawNewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
  trustedFeed?: boolean;
}

const DATA_DIR = getDataDir();
const CACHE_FILE = path.join(DATA_DIR, "country-news-cache.json");
const ARTICLE_COUNT = 3;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; ForeignersClubNews/1.1)",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
};

const VERIFIED_SOURCE_NAMES = [
  "reuters",
  "bbc",
  "associated press",
  "ap news",
  "the guardian",
  "al jazeera",
  "npr",
  "france 24",
  "dw",
  "deutsche welle",
  "the new york times",
  "financial times",
  "the washington post",
  "cnn",
  "bloomberg",
  "politico",
  "abc news",
  "cbs news",
  "nbc news",
];

const VERIFIED_DOMAINS = [
  "reuters.com",
  "bbc.co.uk",
  "bbc.com",
  "apnews.com",
  "theguardian.com",
  "aljazeera.com",
  "npr.org",
  "france24.com",
  "dw.com",
  "nytimes.com",
  "ft.com",
  "washingtonpost.com",
  "cnn.com",
  "bloomberg.com",
  "politico.com",
  "abcnews.go.com",
  "cbsnews.com",
  "nbcnews.com",
];

const WORLD_FEEDS = [
  { source: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { source: "NPR", url: "https://feeds.npr.org/1004/rss.xml" },
  { source: "The Guardian", url: "https://www.theguardian.com/world/rss" },
  { source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { source: "AP News", url: "https://feeds.apnews.com/rss/topnews" },
];

function currentWeekKey(date = new Date()): string {
  const jan1 = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - jan1.getTime()) / 86400000);
  const week = Math.ceil((days + jan1.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const match = block.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
  );
  return match ? decodeXml(match[1]) : "";
}

function extractLink(block: string): string {
  const textLink = extractTag(block, "link");
  if (textLink) return textLink;
  const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  return hrefMatch ? decodeXml(hrefMatch[1]) : "";
}

function parseSourceFromTitle(title: string): string {
  const parts = title.split(" - ");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].trim();
}

function parseFeedBlocks(xml: string): string[] {
  const blocks: string[] = [];
  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
    blocks.push(match[1]);
  }
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)) {
    blocks.push(match[1]);
  }
  return blocks;
}

function parseRss(xml: string, fallbackSource: string, trustedFeed = false): RawNewsItem[] {
  const items: RawNewsItem[] = [];

  for (const block of parseFeedBlocks(xml)) {
    const title = extractTag(block, "title");
    const link = extractLink(block);
    const pubDate =
      extractTag(block, "pubDate") ||
      extractTag(block, "published") ||
      extractTag(block, "updated");
    const description =
      extractTag(block, "description") || extractTag(block, "summary");
    const source =
      extractTag(block, "source") ||
      extractTag(block, "dc:creator") ||
      parseSourceFromTitle(title) ||
      fallbackSource;

    if (title && link) {
      items.push({
        title: title.replace(/\s+-\s+[^-]+$/, "").trim() || title,
        link,
        pubDate,
        source,
        description,
        trustedFeed,
      });
    }
  }

  return items;
}

function isVerifiedArticle(item: RawNewsItem): boolean {
  if (item.trustedFeed) return true;

  const sourceLower = item.source.toLowerCase();
  if (VERIFIED_SOURCE_NAMES.some((name) => sourceLower.includes(name))) {
    return true;
  }

  try {
    const host = new URL(item.link).hostname.replace(/^www\./, "");
    if (VERIFIED_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
      return true;
    }
    if (host === "news.google.com") {
      return VERIFIED_SOURCE_NAMES.some((name) => sourceLower.includes(name));
    }
  } catch {
    return false;
  }

  return false;
}

function articleId(url: string, title: string): string {
  return createHash("sha1").update(`${url}|${title}`).digest("hex").slice(0, 12);
}

function mentionsCountry(text: string, countryName: string): boolean {
  const hay = text.toLowerCase();
  const needle = countryName.toLowerCase();
  if (hay.includes(needle)) return true;

  const aliases: Record<string, string[]> = {
    "united states": ["u.s.", "usa", "america", "american"],
    "united kingdom": ["u.k.", "britain", "british"],
    "south korea": ["korea", "korean"],
    czechia: ["czech republic", "czech"],
    morocco: ["moroccan", "rabat", "casablanca"],
    turkey: ["turkish", "ankara", "istanbul"],
    japan: ["japanese", "tokyo"],
    mexico: ["mexican"],
    thailand: ["thai", "bangkok"],
    portugal: ["portuguese", "lisbon"],
    spain: ["spanish", "madrid"],
    germany: ["german", "berlin"],
    france: ["french", "paris"],
    egypt: ["egyptian", "cairo"],
    india: ["indian", "delhi", "mumbai"],
    china: ["chinese", "beijing"],
    brazil: ["brazilian"],
    canada: ["canadian", "ottawa", "toronto"],
    australia: ["australian", "sydney"],
  };

  return (aliases[needle] ?? []).some((alias) => hay.includes(alias));
}

async function fetchXml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: FETCH_HEADERS, cache: "no-store" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function fetchGoogleNews(countryName: string) {
  const query = encodeURIComponent(`${countryName}`);
  const url = `https://news.google.com/rss/search?q=${query}+when:7d&hl=en-US&gl=US&ceid=US:en`;
  const xml = await fetchXml(url);
  if (!xml) return [];
  return parseRss(xml, "Google News");
}

async function fetchGuardianSearch(countryName: string) {
  const query = encodeURIComponent(countryName);
  const url = `https://www.theguardian.com/world/rss?search=${query}`;
  const xml = await fetchXml(url);
  if (!xml) return [];
  return parseRss(xml, "The Guardian", true);
}

async function fetchWorldFeeds() {
  const results = await Promise.all(
    WORLD_FEEDS.map(async (feed) => {
      const xml = await fetchXml(feed.url);
      if (!xml) return [];
      return parseRss(xml, feed.source, true);
    })
  );
  return results.flat();
}

function pickArticles(candidates: RawNewsItem[], countryName: string): CountryNewsArticle[] {
  const verified = candidates.filter(isVerifiedArticle);

  const countrySpecific = verified.filter((item) =>
    mentionsCountry(
      `${item.title} ${item.description ?? ""} ${item.source}`,
      countryName
    )
  );

  const pools = [
    countrySpecific,
    verified.filter((item) => item.trustedFeed),
    verified,
  ];

  const seen = new Set<string>();
  const picked: CountryNewsArticle[] = [];

  for (const pool of pools) {
    const sorted = [...pool].sort(
      (a, b) =>
        new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
    );

    for (const item of sorted) {
      const key = `${item.title.toLowerCase()}|${item.source.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const published = item.pubDate ? new Date(item.pubDate) : new Date();
      picked.push({
        id: articleId(item.link, item.title),
        title: item.title,
        source: item.source,
        url: item.link,
        publishedAt: Number.isNaN(published.getTime())
          ? new Date().toISOString()
          : published.toISOString(),
      });

      if (picked.length >= ARTICLE_COUNT) return picked;
    }
  }

  return picked;
}

async function readCache(): Promise<NewsCacheFile> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(CACHE_FILE, "utf8");
    return JSON.parse(raw) as NewsCacheFile;
  } catch {
    return {};
  }
}

async function writeCache(cache: NewsCacheFile) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
}

function isCacheFresh(bundle: CountryNewsBundle): boolean {
  const sameWeek = bundle.weekKey === currentWeekKey();
  const freshEnough =
    Date.now() - new Date(bundle.refreshedAt).getTime() < CACHE_TTL_MS;
  return sameWeek && freshEnough && bundle.articles.length > 0;
}

async function buildNewsBundle(
  countrySlug: string,
  countryName: string
): Promise<CountryNewsBundle> {
  const [googleItems, guardianItems, feedItems] = await Promise.all([
    fetchGoogleNews(countryName),
    fetchGuardianSearch(countryName),
    fetchWorldFeeds(),
  ]);

  const articles = pickArticles(
    [...googleItems, ...guardianItems, ...feedItems],
    countryName
  );

  return {
    countrySlug,
    countryName,
    weekKey: currentWeekKey(),
    refreshedAt: new Date().toISOString(),
    articles,
  };
}

export async function getCountryNews(
  countrySlug: string,
  countryName?: string,
  options?: { refresh?: boolean }
): Promise<CountryNewsBundle> {
  const slug = countrySlug.toLowerCase().trim();
  const hub = getCountryBySlug(slug);
  const name = countryName?.trim() || hub?.countryName || slug;

  if (!options?.refresh) {
    const cache = await readCache();
    const cached = cache[slug];
    if (cached && isCacheFresh(cached)) {
      return cached;
    }
  }

  const bundle = await buildNewsBundle(slug, name);

  if (bundle.articles.length > 0) {
    const cache = await readCache();
    cache[slug] = bundle;
    await writeCache(cache);
  }

  return bundle;
}
