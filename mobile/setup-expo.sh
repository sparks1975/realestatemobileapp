#!/bin/bash

# Make sure we're in the mobile directory
cd "$(dirname "$0")"

# Install Expo dependencies
echo "Installing Expo CLI and dependencies..."
npm install -g expo-cli

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Create a temporary metro.config.js if it doesn't exist
if [ ! -f metro.config.js ]; then
  echo "Creating metro.config.js..."
  cat > metro.config.js << 'EOL'
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

module.exports = config;
EOL
fi

# Create a babel.config.js file if it doesn't already exist
if [ ! -f babel.config.js ] || [ -z "$(cat babel.config.js)" ]; then
  echo "Creating babel.config.js..."
  cat > babel.config.js << 'EOL'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOL
fi

# Create or update tsconfig.json if it doesn't exist
if [ ! -f tsconfig.json ] || [ -z "$(cat tsconfig.json)" ]; then
  echo "Creating tsconfig.json..."
  cat > tsconfig.json << 'EOL'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
EOL
fi

echo "Setup complete! You can now run 'npx expo start' to launch the app."