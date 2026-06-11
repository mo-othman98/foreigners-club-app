import { NextResponse } from "next/server";
import {
  feedImageApiPath,
  getCountryFeedPosts,
  postCountryFeedPhoto,
} from "@/lib/country-feed-store";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const posts = await getCountryFeedPosts(slug);
  return NextResponse.json(
    {
      posts: posts.map((p) => ({
        ...p,
        imageUrl: feedImageApiPath(p.countrySlug, p.id),
      })),
    },
    { headers: CORS }
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  try {
    const post = await postCountryFeedPhoto({
      countrySlug: slug,
      authorEmail: body.authorEmail ?? "",
      authorName: body.authorName ?? "Anonymous",
      caption: body.caption ?? "",
      imageBase64: body.imageBase64 ?? "",
      imageMime: body.imageMime,
    });
    return NextResponse.json(
      {
        post: {
          ...post,
          imageUrl: feedImageApiPath(post.countrySlug, post.id),
        },
      },
      { status: 201, headers: CORS }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to upload photo";
    return NextResponse.json({ error: msg }, { status: 400, headers: CORS });
  }
}
