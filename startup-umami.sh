#!/bin/bash
set -e

# --------------------------------------
# Variables
# --------------------------------------
UMAMI_DIR="/opt/render/project/src"
GEOIP_DIR="$UMAMI_DIR/geoip"
MAXMIND_LICENSE_KEY="${MAXMIND_LICENSE_KEY:-}"

# --------------------------------------
# Download GeoLite2 City database
# --------------------------------------
mkdir -p "$GEOIP_DIR"

if [ ! -f "$GEOIP_DIR/GeoLite2-City.mmdb" ]; then
    if [ -z "$MAXMIND_LICENSE_KEY" ]; then
        echo "ERROR: MAXMIND_LICENSE_KEY not set. Cannot download GeoLite2."
        exit 1
    fi

    echo "Downloading GeoLite2 City database..."
    curl -L -o "$GEOIP_DIR/GeoLite2-City.tar.gz" \
        "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz"

    echo "Extracting GeoLite2 City database..."
    tar -xvzf "$GEOIP_DIR/GeoLite2-City.tar.gz" -C "$GEOIP_DIR" --strip-components=1

    rm "$GEOIP_DIR/GeoLite2-City.tar.gz"
else
    echo "GeoLite2 City database already exists, skipping download."
fi

# --------------------------------------
# Build Umami
# --------------------------------------
cd "$UMAMI_DIR"

echo "Installing npm dependencies..."
npm install --legacy-peer-deps

echo "Building Umami..."
npm run build
npm run build:server

# --------------------------------------
# Start Umami server
# --------------------------------------
echo "Starting Umami..."
node server/dist/index.js
