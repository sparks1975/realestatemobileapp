#!/bin/bash

# Navigate to PWA directory
cd pwa

# Install dependencies (if needed)
echo "Installing dependencies..."
npm install --no-save

# Build the PWA
echo "Building PWA..."
npx vite build

# Create the dist directory if it doesn't exist
mkdir -p ../dist/pwa

# Copy the built files to the dist directory
echo "Copying files to dist/pwa..."
cp -r dist/* ../dist/pwa/

echo "PWA build complete!"