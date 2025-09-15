/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');
const tar = require('tar');

if (process.env.VERCEL) {
  console.log('Vercel environment detected. Skipping geo setup.');
  process.exit(0);
}

const db = 'GeoLite2-City';
const dest = path.resolve(__dirname, '../geo');

// Path to local copy of the GeoIP database
const localGeoDb = path.resolve('/umami/geoip/GeoLite2-City.mmdb');

if (!fs.existsSync(dest)) fs.mkdirSync(dest);

if (fs.existsSync(localGeoDb)) {
  // Use local copy
  const target = path.join(dest, 'GeoLite2-City.mmdb');
  fs.copyFileSync(localGeoDb, target);
  console.log('Using local GeoIP database:', target);
  process.exit(0);
}

// Only attempt download if a MaxMind license key is provided
if (!process.env.MAXMIND_LICENSE_KEY) {
  console.warn('No MAXMIND_LICENSE_KEY provided and local database not found. Skipping GeoIP setup.');
  process.exit(0);
}

// Construct MaxMind download URL
const url = `https://download.maxmind.com/app/geoip_download` +
            `?edition_id=${db}&license_key=${process.env.MAXMIND_LICENSE_KEY}&suffix=tar.gz`;

console.log('Downloading GeoIP database from MaxMind:', url);

const download = url =>
  new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download GeoIP DB: ${res.statusCode} ${res.statusMessage}`));
      }

      const gunzip = zlib.createGunzip();
      const extract = tar.t();

      gunzip.on('error', reject);
      extract.on('error', reject);

      extract.on('entry', entry => {
        if (entry.path.endsWith('.mmdb')) {
          const filename = path.join(dest, path.basename(entry.path));
          entry.pipe(fs.createWriteStream(filename));
          console.log('Saved GeoIP database:', filename);
        }
      });

      extract.on('finish', resolve);

      res.pipe(gunzip).pipe(extract);
    }).on('error', reject);
  });

download(url)
  .then(() => console.log('GeoIP database setup complete.'))
  .catch(err => {
    console.error('Failed to download GeoIP database:', err.message);
    process.exit(1);
  });
