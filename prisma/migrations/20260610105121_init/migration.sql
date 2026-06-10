-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PassportProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "currentCountry" TEXT NOT NULL,
    "currentCity" TEXT NOT NULL,
    "languages" TEXT NOT NULL DEFAULT '[]',
    "countriesLived" TEXT NOT NULL DEFAULT '[]',
    "countriesVisited" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PassportProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CountryInsight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "costOfLiving" TEXT,
    "friendlinessRating" REAL,
    "languageSituation" TEXT,
    "culturalTips" TEXT,
    "commonMistakes" TEXT,
    "foreignerQuotes" TEXT DEFAULT '[]',
    "activeUserCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PassportProfile_userId_key" ON "PassportProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CountryInsight_countryCode_key" ON "CountryInsight"("countryCode");
