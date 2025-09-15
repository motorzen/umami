import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import maxmind from "maxmind";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const GEO_DB_PATH = process.env.GEOIP_DB || path.resolve(__dirname, "../data/GeoLite2-City.mmdb");
const OUTPUT_JSON_PATH = path.resolve(__dirname, "../public/geo/geo.json");

// Check that GeoIP DB exists
if (!fs.existsSync(GEO_DB_PATH)) {
  console.error(`MaxMind database not found at ${GEO_DB_PATH}`);
  process.exit(1);
}

console.log(`Using MaxMind DB at: ${GEO_DB_PATH}`);

// Open MaxMind DB
const lookup = maxmind.openSync(GEO_DB_PATH);

console.log("MaxMind DB opened successfully.");

// Example: create geo.json with country and city info for demonstration
// You can adapt this to your existing geo processing logic
const geoData = {};

// If you have a list of IPs to map, loop through them:
// Example IPs array (replace with your data if needed)
const exampleIPs = ["8.8.8.8", "1.1.1.1"];

exampleIPs.forEach((ip) => {
  const geo = lookup.get(ip);
  geoData[ip] = geo || null;
});

// Ensure output directory exists
fs.mkdirSync(path.dirname(OUTPUT_JSON_PATH), { recursive: true });

// Write geo.json
fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(geoData, null, 2));
console.log(`Geo JSON generated at: ${OUTPUT_JSON_PATH}`);
