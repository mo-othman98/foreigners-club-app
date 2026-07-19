import { createHash } from "crypto";

export interface WikimediaPhotoResult {
  id: string;
  imageUrl: string;
  attribution?: string;
}

const WIKIMEDIA_HEADERS = {
  "User-Agent": "ForeignersClub/1.0 (https://foreigners-club.app; country-photos)",
  Accept: "application/json",
};

function photoId(reference: string): string {
  return createHash("sha1").update(reference).digest("hex").slice(0, 12);
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, "").trim();
}

export async function fetchWikimediaCountryPhotos(
  countryName: string,
  limit = 5
): Promise<WikimediaPhotoResult[]> {
  const queries = [
    `${countryName} landscape`,
    `${countryName} landmarks`,
    `${countryName} cityscape`,
  ];

  const photos: WikimediaPhotoResult[] = [];
  const seen = new Set<string>();

  for (const query of queries) {
    if (photos.length >= limit) break;

    const search = encodeURIComponent(query);
    const url =
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
      `&gsrnamespace=6&gsrsearch=${search}&gsrlimit=15&prop=imageinfo` +
      `&iiprop=url|extmetadata&iiurlwidth=960&format=json`;

    try {
      const res = await fetch(url, {
        headers: WIKIMEDIA_HEADERS,
        cache: "no-store",
      });
      if (!res.ok) continue;

      const data = (await res.json()) as {
        query?: {
          pages?: Record<
            string,
            {
              title?: string;
              imageinfo?: {
                thumburl?: string;
                url?: string;
                extmetadata?: { Artist?: { value?: string } };
              }[];
            }
          >;
        };
      };

      for (const page of Object.values(data.query?.pages ?? {})) {
        const info = page.imageinfo?.[0];
        const imageUrl = info?.thumburl ?? info?.url;
        if (!imageUrl || /\.(svg|gif)$/i.test(imageUrl)) continue;
        if (seen.has(imageUrl)) continue;
        seen.add(imageUrl);

        photos.push({
          id: photoId(imageUrl),
          imageUrl,
          attribution:
            stripHtml(info?.extmetadata?.Artist?.value ?? "") ||
            page.title?.replace(/^File:/, "") ||
            undefined,
        });

        if (photos.length >= limit) break;
      }
    } catch {
      // try next query
    }
  }

  return photos;
}
