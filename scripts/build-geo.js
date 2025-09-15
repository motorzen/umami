// scripts/build-geo.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import maxmind from "maxmind";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your MaxMind DB (GeoLite2-City.mmdb)
const GEO_DB_PATH = path.resolve(__dirname, "../data/GeoLite2-City.mmdb");
// Output JSON path
const OUTPUT_JSON_PATH = path.resolve(__dirname, "../public/geo/geo.json");

async function buildGeo() {
  try {
    if (!fs.existsSync(GEO_DB_PATH)) {
      console.error("MaxMind database not found at", GEO_DB_PATH);
      process.exit(1);
    }

    const lookup = await maxmind.open(GEO_DB_PATH);
    const geoData = {};

    // Example: Add some test IPs or ranges you care about
    const testIps = ["8.8.8.8", "1.1.1.1"]; // replace with real IPs or ranges if needed
    testIps.forEach((ip) => {
      const info = lookup.get(ip);
      if (info) {
        geoData[ip] = {
          city: info.city?.names?.en || null,
          country: info.country?.names?.en || null,
          continent: info.continent?.names?.en || null,
          location: info.location || null,
        };
      }
    });

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(OUTPUT_JSON_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(geoData, null, 2));

    console.log("Geo JSON built successfully at", OUTPUT_JSON_PATH);
  } catch (error) {
    console.error("Error building geo data:", error);
    process.exit(1);
  }
}

buildGeo();
