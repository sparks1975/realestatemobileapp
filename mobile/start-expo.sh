#!/bin/bash

# Make sure we're in the mobile directory
cd "$(dirname "$0")"

# Always ensure dependencies are up-to-date
echo "Updating dependencies..."
npm install

# Start Expo with specific version to match package.json
echo "Starting Expo..."
npx expo@^48.0.18 start --clear