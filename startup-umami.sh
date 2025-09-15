#!/bin/bash
set -e

# -----------------------------
# 1. Environment check
# -----------------------------
echo "Checking environment..."
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set!"
  exit 1
fi

if [ -z "$MAXMIND_LICENSE_KEY" ]; then
  echo "ERROR: MAXMIND_LICENSE_KEY is not set!"
  exit 1
fi

# -----------------------------
# 2. Prepare GeoLite2 database
# -----------------------------
echo "Preparing GeoLite2 City database..."

# Remove any existing (possibly corrupted) GeoLite2 database
rm -rf geoip/GeoLite2-City*

# Create geoip directory if missing
mkdir -p geoip

# Download fresh database
curl -L -o geoip/GeoLite2-City.tar.gz \
  "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz"

# Extract database safely
tar -xvzf geoip/GeoLite2-City.tar.gz --strip-components=1 -C geoip/

# Confirm extraction
if [ ! -f geoip/GeoLite2-City.mmdb ]; then
  echo "ERROR: GeoLite2-City.mmdb was not found after extraction!"
  exit 1
fi
echo "GeoLite2 City database ready."

# -----------------------------
# 3. Install dependencies and build
# -----------------------------
echo "Installing npm dependencies..."
npm install --legacy-peer-deps

echo "Building Umami..."
npm run build
npm run build:server

# -----------------------------
# 4. Start Umami server
# -----------------------------
echo "Starting Umami..."
node server/dist/index.js
