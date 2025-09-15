// scripts/generate-geo.js
import fs from "fs";
import path from "path";
import maxmind from "maxmind";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const GEO_DB_PATH = path.join(process.cwd(), "geoip/GeoLite2-City.mmdb");
const OUTPUT_PATH = path.join(process.cwd(), "public/geo/geo.json");

async function main() {
  if (!fs.existsSync(GEO_DB_PATH)) {
    console.error("GeoLite2 database not found at:", GEO_DB_PATH);
    process.exit(1);
  }

  const lookup = await maxmind.open(GEO_DB_PATH);

  // Fetch all IPs from Umami's "event" table
  const events = await prisma.event.findMany({
    select: { ip: true },
    distinct: ["ip"],
    take: 5000, // limit for safety; remove limit if you want all
  });

  const geoData = events.map((e) => {
    const geo = lookup.get(e.ip) || {};
    return {
      ip: e.ip,
      country: geo.country?.iso_code || null,
      region: geo.subdivisions?.[0]?.names?.en || null,
      city: geo.city?.names?.en || null,
    };
  });

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(geoData, null, 2));

  console.log(`Geo data for ${geoData.length} IPs written to ${OUTPUT_PATH}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
