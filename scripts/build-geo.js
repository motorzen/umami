// scripts/build-geo.js
import fs from "fs";
import path from "path";
import geoip from "maxmind";

// Use the environment variable for the database path
const GEO_DB_PATH = process.env.GEOIP_DB;
if (!GEO_DB_PATH) {
  throw new Error("Environment variable GEOIP_DB is not set.");
}

// Verify that the database file exists
if (!fs.existsSync(GEO_DB_PATH)) {
  throw new Error(`MaxMind database not found at ${GEO_DB_PATH}`);
}

// Output path
const OUTPUT_JSON_PATH = path.resolve("public/geo/geo.json");

// Load the MaxMind database
const lookup = geoip.openSync(GEO_DB_PATH);

// Convert the GeoLite2 database into a simple JSON mapping
// (This is just an example; you can adjust what data you need)
const geoData = {};
// For demo, let's map example IPs or just export an empty JSON
// In production, you might prefill from some list or leave empty
fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(geoData, null, 2));

console.log(`Geo data JSON successfully written to ${OUTPUT_JSON_PATH}`);
