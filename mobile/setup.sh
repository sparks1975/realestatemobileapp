#!/bin/bash

# Realtor Dashboard Mobile App setup script
echo "Setting up Realtor Dashboard Mobile App..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create necessary directories (if not already created)
echo "Creating directory structure..."
mkdir -p ./assets

# Copy placeholder assets
echo "Setting up assets..."
if [ ! -f ./assets/icon.png ]; then
  # Create a placeholder icon if it doesn't exist
  echo "Creating placeholder icon.png"
  echo "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAA1BMVEX///+nxBvIAAAAVFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPn83/AAAAHHRSTlMAGBMKEQkHHj1KSBwXJy5ZTkQ0LCZgW0lCOh7kcXEZVgAABFVJREFUeNrt3FFy2kAQhWEtwAAiGJCEbPa/z8RVqXKl4pJtcBj1e4e+W9C/GpgZqaoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFKXpsRzlS7gvSnxWqULuDUlrlW6gLYpcavSBdyacEFVPgw0bUCdL+DWhAuq8gW0iiAvoG3CBdX5AlrXQV5At7cCnuMFtLsroHYBDwZUFuXTULO7B9Qn+RbQNLsroD7Jt4Cu2lsB9UneBDTVoR6QvAloqiPdB3kJ0O1sEh7kV0C7s/sgL+G5rp6eBkCeAtrqaTUB8hLQVk+rCZCXgG5hL8gvgHZhJ8BLgG5hL8jvhZ4W9oL8AjQLC1B5CdAsLEDlJUCzsBLkF6BdVoDKS4B2WQEqLwHdogJUXgK6RQWovARMbAr7T4C/C9lZgMpLwMTTAFlWVoDK+wtMLCxA5SVAJz5KlsX3AlvxxyGyArzXCULUfpzWm8Qj8ORSJwiRx8MHcXJFfgH0IlmA3kuyAH2RZAH6JsmHofdJkpdxNekC9GWSJ2GtXiZ5FNrraZJtQC/JPUhek2yE9/on2WqAXpKtBuglWYC+SPIoWS/JvcBT8gzwlGwfpK+SBeilJC9D9Hq5gLr+aNIK0Bd1ur3Ae53uJLgtDvVf4b1OV8DbYjgIdqyAYXHPaDoYDsIPdvDwUE8XwRiGA3/HCfBQz9YDx+G/YyRwHN/7YL1k/9D7WuRVjgz+HctBwzgehFz4XD3U82NAGMd35uV4LcN5tJ+kv5bhFM6j3SM9jfN+WotxHu0+8FOcJ0GL+RoGd1J0KWOcJ0ELGkb3JHgZlh/n6XLGcZ7lLqoLdxrVB9FiMRzHcX5ThhNbwJct4DSsIMFiMIzrXhDBYhzXQTLFYhjX7SyK1Tiue5IYVuO690mwHNc9UITl8OYO6ELEcHh1AQzPvfPNZpizYTi8OQWGw7ujYTEYDm9OxsUwHt7djorhcHD7j4vhza2guBrfXBGLq/G8FxZj8PBH3r28X2E1Hof/jrK33+M47n+5Y6nFOI7/Hbs5i+n7XHZ06fJ2fR6n/yvLO3e1Y9d33tf/29aXLmPH9/KOmzzGhXA4uf4g+zqOwzT9r4ydnftwOI374XCe/tuWd87DOQ/rz7L3DnGYx/3XWd09EB7OBfEweVjF8fNMJ6G9d/O4Xg/nXRz3gq2d3Xt7KY7zvFcPp8NJOA9nwXAYhnk6DPth+prr8jDNw7gXzkMZxjCP4z7sg7n7vLivL+0wTlMehmEYxnEqw3QY5mkchsMwTtM4jdM8H6ZhGKZpmubpMM/TfJinaZrmuQzTNMzzPM3TdJjnYZrm6TCX4TAfDtO8F4phGOdpHJfCPI/DPA3jNE5lKPM4DMM4H4ZpGsdhHMZ5GGcBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEjnN/JmXS9HJX0sAAAAAElFTkSuQmCC" > ./assets/icon.png
fi

if [ ! -f ./assets/splash.png ]; then
  # Create a placeholder splash if it doesn't exist
  echo "Creating placeholder splash.png"
  cp ./assets/icon.png ./assets/splash.png
fi

if [ ! -f ./assets/adaptive-icon.png ]; then
  # Create a placeholder adaptive icon if it doesn't exist
  echo "Creating placeholder adaptive-icon.png"
  cp ./assets/icon.png ./assets/adaptive-icon.png
fi

if [ ! -f ./assets/favicon.png ]; then
  # Create a placeholder favicon if it doesn't exist
  echo "Creating placeholder favicon.png"
  cp ./assets/icon.png ./assets/favicon.png
fi

echo ""
echo "Setup complete! You can now run the app with:"
echo "cd mobile"
echo "npm start"
echo ""
echo "Then scan the QR code with the Expo Go app on your device,"
echo "or press 'i' to open in iOS simulator or 'a' for Android emulator."