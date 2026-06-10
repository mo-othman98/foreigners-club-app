import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { COUNTRY_INSIGHTS } from "../src/lib/mock-data";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const insight of Object.values(COUNTRY_INSIGHTS)) {
    await prisma.countryInsight.upsert({
      where: { countryCode: insight.countryCode },
      update: {
        countryName: insight.countryName,
        costOfLiving: insight.costOfLiving,
        friendlinessRating: insight.friendlinessRating,
        languageSituation: insight.languageSituation,
        culturalTips: JSON.stringify(insight.culturalTips),
        commonMistakes: JSON.stringify(insight.commonMistakes),
        foreignerQuotes: JSON.stringify(insight.foreignerQuotes),
        activeUserCount: insight.activeUserCount,
      },
      create: {
        countryCode: insight.countryCode,
        countryName: insight.countryName,
        costOfLiving: insight.costOfLiving,
        friendlinessRating: insight.friendlinessRating,
        languageSituation: insight.languageSituation,
        culturalTips: JSON.stringify(insight.culturalTips),
        commonMistakes: JSON.stringify(insight.commonMistakes),
        foreignerQuotes: JSON.stringify(insight.foreignerQuotes),
        activeUserCount: insight.activeUserCount,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
