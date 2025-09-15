// scripts/build-geo.js
import fs from 'fs';
import path from 'path';
import maxmind from 'maxmind';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// If using ESM, get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const geoDir = path.resolve(__dirname, '../geo');
const geoDbPath = path.join(geoDir, 'GeoLite2-City.mmdb');

// Ensure the geo directory exists
if (!fs.existsSync(geoDir)) {
  fs.mkdirSync(geoDir, { recursive: true });
}

// Normally you’d download the GeoLite2-City.mmdb file here
// For this example, we assume it’s already in geo/ directory

async function buildGeo() {
  try {
    const lookup = await maxmind.open(geoDbPath);

    // Test with a sample IP to ensure DB is working
    const testIp = '8.8.8.8';
    const city = lookup.get(testIp);

    if (city) {
      console.log(`✅ GeoIP database ready: ${geoDbPath}`);
      console.log(`Sample lookup for ${testIp}: ${JSON.stringify(city)}`);
    } else {
      console.warn(`⚠ GeoIP DB loaded, but no data for IP: ${testIp}`);
    }

    // Set the environment variable for runtime
    process.env.GEOIP_DB = geoDbPath;
    console.log(`GEOIP_DB set to: ${geoDbPath}`);
  } catch (err) {
    console.error('❌ Failed to load MaxMind DB:', err);
    process.exit(1);
  }
}

buildGeo();
