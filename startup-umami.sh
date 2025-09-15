#!/bin/bash
set -e

# writable directory
GEO_DIR=/tmp/geoip
mkdir -p "$GEO_DIR"

# download GeoLite2 City
echo "Downloading GeoLite2 City database..."
curl -L --fail -o /tmp/GeoLite2-City.tar.gz \
"https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"

# verify
if [ ! -s /tmp/GeoLite2-City.tar.gz ]; then
  echo "Error: download failed"
  exit 1
fi

# extract the .mmdb (strip top-level folder)
tar -xzf /tmp/GeoLite2-City.tar.gz --strip-components=1 -C "$GEO_DIR" */GeoLite2-City.mmdb

# clean up
rm /tmp/GeoLite2-City.tar.gz

# show file
echo "GeoLite2 file:"
ls -lh "$GEO_DIR"

# set env for Umami
export GEOLOCATION_DB_PATH="$GEO_DIR/GeoLite2-City.mmdb"

# start Umami
npm run start
