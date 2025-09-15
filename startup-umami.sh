#!/bin/bash
set -e

# Writable directory
GEO_DIR=/tmp/geoip
mkdir -p "$GEO_DIR"

# Download GeoLite2 City DB
echo "Downloading GeoLite2 City database..."
curl -L --fail -o /tmp/GeoLite2-City.tar.gz \
"https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"

# Verify download
if [ ! -s /tmp/GeoLite2-City.tar.gz ]; then
  echo "Error: GeoLite2 download failed"
  exit 1
fi

# Extract the .mmdb into GEO_DIR (strip top-level folder)
tar -xzf /tmp/GeoLite2-City.tar.gz --strip-components=1 -C "$GEO_DIR" */GeoLite2-City.mmdb

# Cleanup
rm /tmp/GeoLite2-City.tar.gz

# Show file
echo "GeoLite2 file:"
ls -lh "$GEO_DIR"

# Export path for Umami
export GEOLOCATION_DB_PATH="$GEO_DIR/GeoLite2-City.mmdb"

# Start Umami
npm run start
