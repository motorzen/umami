#!/bin/bash
set -e

# Path to the GeoLite2 database
GEO_DB_PATH="./server/GeoLite2-City.mmdb"

# Always download a fresh copy
echo "Downloading fresh GeoLite2 City database..."
curl -sSL -o "$GEO_DB_PATH.gz" "https://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz"

# Extract the .mmdb file from the tar.gz
tar -xzf "$GEO_DB_PATH.gz" --strip-components=1 --wildcards "*/GeoLite2-City.mmdb" -C "$(dirname "$GEO_DB_PATH")"

# Remove the downloaded archive
rm "$GEO_DB_PATH.gz"

echo "GeoLite2 City database downloaded."

# Start Umami
echo "Starting Umami..."
node server/dist/index.js
