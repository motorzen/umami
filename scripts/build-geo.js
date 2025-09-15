/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../geoip/GeoLite2-City.mmdb');
const destDir = path.join(__dirname, '../geo');

// Ensure destination folder exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy database to a folder that will be included in the build
const dest = path.join(destDir, 'GeoLite2-City.mmdb');
fs.copyFileSync(src, dest);
console.log('GeoIP database copied for runtime use:', dest);

// Set environment variable for Umami (used at runtime)
process.env.GEOIP_DB = dest;
console.log('GEOIP_DB set to:', process.env.GEOIP_DB);
