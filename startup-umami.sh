#!/bin/bash
set -e

# --- Directories ---
APP_DIR="/opt/render/project/src"
GEO_DIR="/tmp/geoip"  # Must be writable

mkdir -p "$GEO_DIR"

# --- Download GeoLite2 City database ---
echo "Downloading GeoLite2 City database..."
curl -L -o /tmp/GeoLite2-City.tar.gz "https://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz"

# --- Extract the MMDB ---
echo "Extracting GeoLite2-City.mmdb..."
tar -xzf /tmp/GeoLite2-City.tar.gz --strip-components=1 -C "$GEO_DIR" */GeoLite2-City.mmdb

# --- Set environment variable for Umami ---
export UMAMI_GEOIP_DB="$GEO_DIR/GeoLite2-City.mmdb"

# --- Start Umami ---
echo "Starting Umami..."
cd "$APP_DIR"
node server/dist/index.js
