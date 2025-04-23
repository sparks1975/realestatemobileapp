#!/bin/bash

# Make sure we're in the mobile directory
cd "$(dirname "$0")"

echo "Setting up Expo development environment..."

# Clean install to avoid any dependency issues
echo "Installing dependencies..."
rm -rf node_modules
npm install

# Install Expo CLI globally if not already installed
echo "Installing Expo CLI..."
npm install -g expo-cli

echo "Setup complete! Now you can run ./start-expo.sh to start the Expo development server."