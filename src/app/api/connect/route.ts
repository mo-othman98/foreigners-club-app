import { NextResponse } from "next/server";
import { ensureDataMaintenance } from "@/lib/data-maintenance";
import { saveProfilePhoto } from "@/lib/profile-photos";
import {
  listMemberProfiles,
  upsertMemberProfile,
} from "@/lib/profiles-store";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  await ensureDataMaintenance();
  const profiles = await listMemberProfiles();
  return NextResponse.json({ profiles }, { headers: CORS });
}

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email as string | undefined)?.trim();
  const name = (body.name as string | undefined)?.trim();
  const journal = body.journal as Record<string, unknown> | undefined;

  if (!email || !name || !journal) {
    return NextResponse.json(
      { error: "email, name, and journal are required" },
      { status: 400, headers: CORS }
    );
  }

  let profilePhotoUrl: string | undefined;
  const photoBase64 = body.profilePhotoBase64 as string | undefined;
  if (photoBase64 && photoBase64.length > 0) {
    profilePhotoUrl = await saveProfilePhoto(
      email,
      photoBase64,
      (body.profilePhotoMime as string | undefined) ?? "image/jpeg"
    );
  }

  const syncedJournal = { ...journal };
  if (profilePhotoUrl) {
    syncedJournal.profilePhotoUri = profilePhotoUrl;
  }

  const profile = await upsertMemberProfile({
    email,
    name,
    journal: syncedJournal,
    profilePhotoUrl,
  });
  const status = profile.updatedAt ? 200 : 201;
  return NextResponse.json({ profile }, { status, headers: CORS });
}
