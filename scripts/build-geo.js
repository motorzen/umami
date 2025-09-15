import path from "path";
import fs from "fs";
import maxmind from "maxmind";

// 1️⃣ Paths
const GEO_DB_PATH = process.env.GEOIP_DB || path.resolve(__dirname, "../data/GeoLite2-City.mmdb");
const OUTPUT_JSON_PATH = path.resolve(__dirname, "../public/geo/geo.json");

// 2️⃣ Check database exists
if (!fs.existsSync(GEO_DB_PATH)) {
  console.error(`MaxMind database not found at ${GEO_DB_PATH}`);
  process.exit(1);
}

// 3️⃣ Ensure output directory exists
const outputDir = path.dirname(OUTPUT_JSON_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 4️⃣ Open MaxMind database
const lookup = maxmind.openSync(GEO_DB_PATH);

// 5️⃣ Convert DB to JSON (example: list of cities with coordinates)
// Note: Adjust this logic to your desired output
const geoData = [];
lookup.getGeoData = function(ip) {
  try {
    return lookup.get(ip);
  } catch {
    return null;
  }
};

// Optional: if you want to export all data, you might use your own dataset of IPs
// For demonstration, this is a minimal example with empty array
fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(geoData, null, 2));

console.log(`Geo data successfully generated at ${OUTPUT_JSON_PATH}`);
