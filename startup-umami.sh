#!/bin/bash
set -e  # Exit on first error

# -----------------------------
# CONFIGURATION
# -----------------------------
# Your MaxMind license key (create a free account to get one)
MAXMIND_LICENSE_KEY="${MAXMIND_LICENSE_KEY:-YOUR_LICENSE_KEY}"

# GeoLite2 download URLs
GEOLITE2_URL="https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz"

# Paths
GEO_DIR="./geoip"
BUILD_DIR="./server"

# -----------------------------
# STEP 1: Clean old files
# -----------------------------
echo "Cleaning old GeoLite2 files..."
rm -rf "$GEO_DIR"
mkdir -p "$GEO_DIR"

# -----------------------------
# STEP 2: Download and extract GeoLite2
# -----------------------------
echo "Downloading GeoLite2 City database..."
curl -L -o "$GEO_DIR/GeoLite2-City.tar.gz" "$GEOLITE2_URL"

echo "Extracting GeoLite2 database..."
tar -xvzf "$GEO_DIR/GeoLite2-City.tar.gz" -C "$GEO_DIR" --strip-components=1

echo "GeoLite2 database ready."

# -----------------------------
# STEP 3: Install dependencies
# -----------------------------
echo "Installing npm dependencies..."
npm install --legacy-peer-deps

# -----------------------------
# STEP 4: Build Umami
# -----------------------------
echo "Building Umami..."
npm run build
npm run build:server

# -----------------------------
# STEP 5: Start Umami
# -----------------------------
echo "Starting Umami server..."
node "$BUILD_DIR/dist/index.js"
