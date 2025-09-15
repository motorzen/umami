// scripts/build-geo.js
const fs = require("fs");
const path = require("path");
const maxmind = require("maxmind");

const GEO_DB_PATH = path.resolve(__dirname, "../data/GeoLite2-City.mmdb");
const OUTPUT_JSON_PATH = path.resolve(__dirname, "../public/geo/geo.json");

async function buildGeo() {
  try {
    if (!fs.existsSync(GEO_DB_PATH)) {
      console.error("MaxMind database not found at", GEO_DB_PATH);
      process.exit(1);
    }

    // Open the MaxMind DB
    const lookup = await maxmind.open(GEO_DB_PATH);
    const geoData = {};

    // Example: Add logic to build geo data as needed
    // For demonstration, you can add IPs or pull from your dataset
    const exampleIps = ["8.8.8.8", "1.1.1.1"];
    exampleIps.forEach((ip) => {
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

    // Write the geo data to JSON
    fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(geoData, null, 2));
    console.log("✅ Geo JSON built successfully at", OUTPUT_JSON_PATH);
  } catch (err) {
    console.error("❌ Error building Geo JSON:", err);
    process.exit(1);
  }
}

// Run the build
buildGeo();
