#!/bin/bash
set -e

# Start PostgreSQL in the background
docker-entrypoint.sh postgres &

# Wait until PostgreSQL is ready
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for Postgres..."
  sleep 2
done

# Check if the Hungary table already exists
if ! psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1 FROM information_schema.tables WHERE table_name='hungary'" | grep -q 1; then
  echo "Running Hungary import..."
  /app/country_init.sh
else
  echo "Hungary table already exists, skipping import."
fi

# Wait for PostgreSQL to stay alive
wait
