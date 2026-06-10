import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const passport = await prisma.passportProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!passport) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    name: passport.name,
    nationality: passport.nationality,
    currentCountry: passport.currentCountry,
    currentCity: passport.currentCity,
    languages: JSON.parse(passport.languages),
    countriesLived: JSON.parse(passport.countriesLived),
    countriesVisited: JSON.parse(passport.countriesVisited),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const user = await prisma.user.upsert({
    where: { email: session.user.email ?? "demo@foreigners.club" },
    update: {},
    create: {
      id: session.user.id,
      email: session.user.email ?? "demo@foreigners.club",
      name: body.name,
    },
  });

  const passport = await prisma.passportProfile.upsert({
    where: { userId: user.id },
    update: {
      name: body.name,
      nationality: body.nationality,
      currentCountry: body.currentCountry,
      currentCity: body.currentCity,
      languages: JSON.stringify(body.languages ?? []),
      countriesLived: JSON.stringify(body.countriesLived ?? []),
      countriesVisited: JSON.stringify(body.countriesVisited ?? []),
    },
    create: {
      userId: user.id,
      name: body.name,
      nationality: body.nationality,
      currentCountry: body.currentCountry,
      currentCity: body.currentCity,
      languages: JSON.stringify(body.languages ?? []),
      countriesLived: JSON.stringify(body.countriesLived ?? []),
      countriesVisited: JSON.stringify(body.countriesVisited ?? []),
    },
  });

  return NextResponse.json(passport);
}
