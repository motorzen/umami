// scripts/check-geo.js
import fs from 'fs';
import path from 'path';
import maxmind from 'maxmind';

const geoDbPath = path.resolve('./geo/GeoLite2-City.mmdb');

// Check that the DB file exists
if (!fs.existsSync(geoDbPath)) {
  console.error(`❌ GEOIP_DB file not found: ${geoDbPath}`);
  process.exit(1);
}

console.log(`✅ GEOIP_DB file exists at runtime: ${geoDbPath}`);

async function checkGeo() {
  try {
    // Open the database asynchronously (v2 API)
    const lookup = await maxmind.open(geoDbPath);

    // Test with a sample IP
    const testIp = '8.8.8.8';
    const city = lookup.get(testIp);

    if (city) {
      console.log(`✅ MaxMind DB loaded successfully. Sample lookup: ${JSON.stringify(city)}`);
    } else {
      console.warn(`⚠ MaxMind DB loaded, but no data for IP: ${testIp}`);
    }
  } catch (err) {
    console.error('❌ Failed to load MaxMind DB:', err);
    process.exit(1);
  }
}

checkGeo();
