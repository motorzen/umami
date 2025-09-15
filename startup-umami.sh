#!/bin/bash
set -e

APP_DIR="/opt/render/project/src"
GEO_DIR="/tmp/geoip"

# Create a temporary directory for the GeoIP database
mkdir -p "$GEO_DIR"

# Check that the license key is set
if [ -z "$MAXMIND_LICENSE_KEY" ]; then
  echo "ERROR: MAXMIND_LICENSE_KEY environment variable is not set."
  exit 1
fi

# Download the GeoLite2 City database from MaxMind
echo "Downloading GeoLite2 City database..."
curl -L -o /tmp/GeoLite2-City.tar.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"

# Extract the .mmdb file
echo "Extracting GeoLite2-City.mmdb..."
tar -xzf /tmp/GeoLite2-City.tar.gz --strip-components=1 -C "$GEO_DIR" */GeoLite2-City.mmdb

# Set Umami environment variable for GeoIP
export UMAMI_GEOIP_DB="$GEO_DIR/GeoLite2-City.mmdb"

# Start Umami
echo "Starting Umami..."
cd "$APP_DIR"
node server/dist/index.js
