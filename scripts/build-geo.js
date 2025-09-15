// scripts/build-geo.js
import fs from "fs";
import path from "path";
import maxmind from "maxmind";

// Use environment variable or default path in repo
const GEO_DB_PATH = process.env.GEOIP_DB || path.resolve("./geoip/GeoLite2-City.mmdb");
const OUTPUT_JSON_PATH = path.resolve("./public/geo/geo.json");

// Check that GeoLite2 database exists
if (!fs.existsSync(GEO_DB_PATH)) {
  console.error("MaxMind database not found at", GEO_DB_PATH);
  process.exit(1);
}

console.log("Loading GeoLite2 database from:", GEO_DB_PATH);

async function buildGeo() {
  try {
    // Open database (async API for maxmind v2)
    const lookup = await maxmind.open(GEO_DB_PATH);

    // Example: if you have a list of IPs to convert
    // You can replace this with your actual data source
    const sampleIPs = [
      { ip: "8.8.8.8", label: "Google DNS" },
      { ip: "1.1.1.1", label: "Cloudflare DNS" }
    ];

    const geoData = sampleIPs.map(entry => {
      const geo = lookup.get(entry.ip);
      return {
        ip: entry.ip,
        label: entry.label,
        country: geo?.country?.iso_code || null,
        region: geo?.subdivisions?.[0]?.iso_code || null,
        city: geo?.city?.names?.en || null
      };
    });

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(OUTPUT_JSON_PATH), { recursive: true });

    // Write JSON file
    fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(geoData, null, 2));

    console.log("Geo data built successfully at:", OUTPUT_JSON_PATH);
  } catch (err) {
    console.error("Error building geo data:", err);
    process.exit(1);
  }
}

buildGeo();
