#!/bin/bash

# Make sure we're in the mobile directory
cd "$(dirname "$0")"

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start Expo with specific version to match package.json
echo "Starting Expo..."
npx expo@^48.0.18 start --clear