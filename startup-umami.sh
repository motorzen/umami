#!/bin/bash
set -e

APP_DIR="/opt/render/project/src"
GEO_DIR="$APP_DIR/geoip"
GEO_FILE="$GEO_DIR/GeoLite2-City.mmdb"

# Create geoip folder in writable app directory
mkdir -p "$GEO_DIR"

# Only download GeoLite2 if it doesn't already exist
if [ ! -f "$GEO_FILE" ]; then
  if [ -z "$MAXMIND_LICENSE_KEY" ]; then
    echo "ERROR: MAXMIND_LICENSE_KEY environment variable is not set."
    exit 1
  fi

  echo "Downloading GeoLite2 City database..."
  curl -L -o /tmp/GeoLite2-City.tar.gz \
    "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"

  echo "Extracting GeoLite2-City.mmdb..."
  tar -xzf /tmp/GeoLite2-City.tar.gz --wildcards --strip-components=1 -C "$GEO_DIR" "*/GeoLite2-City.mmdb"
else
  echo "GeoLite2 City database already exists, skipping download."
fi

# Set Umami env variable
export UMAMI_GEOIP_DB="$GEO_FILE"

# Start Umami
echo "Starting Umami..."
cd "$APP_DIR"
node server/dist/index.js
