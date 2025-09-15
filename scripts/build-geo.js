/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// Detect Vercel environment (optional)
if (process.env.VERCEL) {
  console.log('Vercel environment detected. Skipping geo setup.');
  process.exit(0);
}

// Destination folder for Umami to read GeoIP database from
const dest = path.resolve(__dirname, '../geo');

// Ensure destination folder exists
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// Path to the local GeoIP database in your repo
const localGeoDb = path.resolve(__dirname, '../geoip/GeoLite2-City.mmdb');

if (!fs.existsSync(localGeoDb)) {
  console.error('Local GeoIP database not found at:', localGeoDb);
  process.exit(1);
}

// Copy the local database to the expected folder
const target = path.join(dest, 'GeoLite2-City.mmdb');
fs.copyFileSync(localGeoDb, target);

console.log('Using local GeoIP database:', target);

// Exit successfully
process.exit(0);
