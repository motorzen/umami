const fs = require('fs');

const geoPath = process.env.GEOIP_DB || './geo/GeoLite2-City.mmdb';

if (fs.existsSync(geoPath)) {
  console.log('✅ GEOIP_DB file exists at runtime:', geoPath);
} else {
  console.error('❌ GEOIP_DB file NOT found at runtime. City/region tracking will fail.');
}

// Optional: try loading MaxMind DB to see if it opens
try {
  const maxmind = require('maxmind');
  const lookup = maxmind.openSync(geoPath);
  console.log('✅ MaxMind DB loaded successfully. Sample lookup for 8.8.8.8:', lookup.get('8.8.8.8'));
} catch (err) {
  console.error('❌ Failed to load MaxMind DB:', err);
}
