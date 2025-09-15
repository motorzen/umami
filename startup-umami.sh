#!/bin/bash
set -e

# Directory for GeoLite2 database
GEO_DIR=/geoip
mkdir -p "$GEO_DIR"

# Download the GeoLite2 City database from MaxMind
echo "Downloading GeoLite2 City database..."
curl -L --fail -o /tmp/GeoLite2-City.tar.gz \
"https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"

# Check that the download succeeded
if [ ! -s /tmp/GeoLite2-City.tar.gz ]; then
  echo "Error: GeoLite2 download failed or file is empty"
  exit 1
fi

# Extract the .mmdb file into /geoip
echo "Extracting GeoLite2 database..."
tar -xzf /tmp/GeoLite2-City.tar.gz --strip-components=1 -C "$GEO_DIR" */GeoLite2-City.mmdb

# Clean up the tar.gz
rm /tmp/GeoLite2-City.tar.gz

# Confirm the file exists (logs will show this in Render)
echo "GeoLite2 database contents:"
ls -lh "$GEO_DIR"

# Start Umami directly, bypassing build-geo
echo "Starting Umami..."
npm run start
