#!/bin/bash
set -e

# Use a writable directory
GEO_DIR=/tmp/geoip
mkdir -p "$GEO_DIR"

# Download the GeoLite2 City database
echo "Downloading GeoLite2 City database..."
curl -L --fail -o /tmp/GeoLite2-City.tar.gz \
"https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"

# Verify download
if [ ! -s /tmp/GeoLite2-City.tar.gz ]; then
  echo "Error: GeoLite2 download failed"
  exit 1
fi

# Extract .mmdb into the writable directory
tar -xzf /tmp/GeoLite2-City.tar.gz --strip-components=1 -C "$GEO_DIR" */GeoLite2-City.mmdb
rm /tmp/GeoLite2-City.tar.gz

# Show the file in logs
echo "GeoLite2 file:"
ls -lh "$GEO_DIR"

# Set environment variable for Umami to use
export GEOLOCATION_DB_PATH="$GEO_DIR/GeoLite2-City.mmdb"

# Start Umami directly
npm run start
