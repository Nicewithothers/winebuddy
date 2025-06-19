#!/bin/bash

set -e

# Configuration
DB_NAME=${POSTGRES_DB:-winebuddy}
DB_USER=${POSTGRES_USER:-winebuddy}
DB_HOST=${POSTGRES_HOST:-localhost}
DB_PORT=${POSTGRES_PORT:-5432}
TABLE_NAME="hungary"
TMP_DIR="/tmp/hungary"

# Download and unzip Natural Earth data
mkdir -p $TMP_DIR && cd $TMP_DIR
wget -O countries.zip https://naturalearth.s3.amazonaws.com/10m_cultural/ne_10m_admin_0_countries.zip
unzip -o countries.zip

# Find the shapefile
SHP_FILE=$(find . -name "*.shp")

# Extract only Hungary using ogr2ogr
ogr2ogr -f "ESRI Shapefile" hungary.shp "$SHP_FILE" -where "SOVEREIGNT = 'Hungary'"

# Use shp2pgsql to import
shp2pgsql -I -s 4326 hungary.shp $TABLE_NAME | psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT
