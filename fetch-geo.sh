#!/bin/bash
set -e

# Directory for GeoLite2 database
mkdir -p /geoip

# Download the latest GeoLite2 City database (replace YOUR_LICENSE_KEY with your MaxMind license key)
curl -L -o /tmp/GeoLite2-City.tar.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"

# Extract the .mmdb file into /geoip
tar -xzf /tmp/GeoLite2-City.tar.gz --strip-components=1 -C /geoip */GeoLite2-City.mmdb

# Clean up
rm /tmp/GeoLite2-City.tar.gz

# Confirm file exists (this will show in Render logs)
echo "Contents of /geoip directory:"
ls -lh /geoip/

# Start Umami
npm start
