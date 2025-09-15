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

// Ensure destination folder exists
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// Path to local copy of the database
const localGeoDb = path.resolve(__dirname, '../geoip/GeoLite2-City.mmdb');

if (fs.existsSync(localGeoDb)) {
  const target = path.join(dest, 'GeoLite2-City.mmdb');
  fs.copyFileSync(localGeoDb, target);
  console.log('Using local GeoIP database:', target);
  process.exit(0); // skip download
}

// If no local copy, attempt download
let url = `https://raw.githubusercontent.com/GitSquared/node-geolite2-redist/master/redist/${db}.tar.gz`;

if (process.env.MAXMIND_LICENSE_KEY) {
  url =
    `https://download.maxmind.com/app/geoip_download` +
    `?edition_id=${db}&license_key=${process.env.MAXMIND_LICENSE_KEY}&suffix=tar.gz`;
}

console.log('Downloading GeoIP database from MaxMind:', url);

const download = url =>
  new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download GeoIP DB: ${res.statusCode} ${res.statusMessage}`));
      }
      resolve(res.pipe(zlib.createGunzip()).pipe(tar.t()));
    }).on('error', reject);
  });

download(url)
  .then(
    res =>
      new Promise((resolve, reject) => {
        res.on('entry', entry => {
          if (entry.path.endsWith('.mmdb')) {
            const filename = path.join(dest, path.basename(entry.path));
            entry.pipe(fs.createWriteStream(filename));
            console.log('Saved GeoIP database:', filename);
          }
        });

        res.on('error', reject);
        res.on('finish', resolve);
      }),
  )
  .catch(err => {
    console.error('Failed to download GeoIP database:', err);
    process.exit(1);
  });
