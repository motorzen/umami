import fs from "fs";
import path from "path";
import maxmind from "maxmind";

const GEOIP_DB = process.env.GEOIP_DB;
const OUTPUT = path.resolve("./public/geo/geo.json");

if (!fs.existsSync(GEOIP_DB)) {
  console.error("GeoLite2 database not found:", GEOIP_DB);
  process.exit(1);
}

let lookup;
try {
  lookup = maxmind.openSync(GEOIP_DB);
} catch (err) {
  console.error("Failed to open mmdb:", err.message);
  process.exit(1);
}

// Optional: test a known IP
const test = lookup.get("8.8.8.8");
console.log("Test lookup:", test);

const geo = [
  { ip: "8.8.8.8", label: "Google DNS", ...extract(test) },
  { ip: "1.1.1.1", label: "Cloudflare DNS", ...extract(lookup.get("1.1.1.1")) },
];

function extract(record) {
  if (!record) return { country: null, region: null, city: null };
  return {
    country: record.country?.iso_code || null,
    region: record.subdivisions?.[0]?.iso_code || null,
    city: record.city?.names?.en || null,
  };
}

// Write geo.json
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(geo, null, 2));
console.log("Geo data built successfully at:", OUTPUT);
