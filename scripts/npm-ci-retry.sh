#!/usr/bin/env bash
set -eo pipefail

echo "Running npm install with retry/fallback resilience..."
max_attempts=3
attempt=1

while [ $attempt -le $max_attempts ]; do
  echo "Attempt $attempt of $max_attempts..."
  if [ -f package-lock.json ]; then
    if npm ci --no-audit --no-fund "$@"; then
      echo "npm ci succeeded."
      exit 0
    fi
  fi

  if npm install --ignore-scripts --no-audit --no-fund "$@"; then
    echo "npm install succeeded."
    exit 0
  fi

  echo "Attempt $attempt failed. Retrying in 5 seconds..."
  sleep 5
  attempt=$((attempt + 1))
done

echo "Failed to install dependencies after $max_attempts attempts."
exit 1
