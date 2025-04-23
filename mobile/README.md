# Realtor Dashboard Mobile App

This is the mobile application for the Realtor Dashboard, built with Expo and React Native. The app follows Apple's Human Interface guidelines with a clean, minimalist aesthetic and carefully considers typography, spacing, and visual elements.

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo Go app installed on your physical device (iOS/Android)

### Running the App

You have several options to run the mobile app:

#### Option 1: Using the provided script

```bash
# Navigate to the mobile directory
cd mobile

# Make the script executable and run it
chmod +x start-expo.sh
./start-expo.sh
```

#### Option 2: Using npm scripts

```bash
# Navigate to the mobile directory
cd mobile

# Install dependencies if needed
npm install

# Start the Expo development server
npm run dev
```

#### Option 3: Using Expo CLI directly

```bash
# Navigate to the mobile directory
cd mobile

# Install dependencies if needed
npm install

# Start Expo
npx expo start
```

### Viewing the App

When you run the app using any of the methods above, you'll see a QR code in your terminal.

- **On iOS**: Scan the QR code with your device's Camera app
- **On Android**: Scan the QR code using the Expo Go app

## App Structure

The mobile app is organized as follows:

- `src/screens/`: Contains all the screen components
- `src/api/`: Contains API client and service modules
- `src/components/`: Reusable UI components
- `src/types.ts`: Type definitions

## Configuration

The app is configured to connect to the API hosted on Replit by default. If you need to change the API endpoint:

1. Create a `.env` file in the mobile directory (copy from `.env.example`)
2. Update the `EXPO_PUBLIC_API_URL` variable with your API URL

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed (`npm install`)
2. Try clearing the cache (`npm run dev` which includes the `--clear` flag)
3. Verify your device is on the same network as your development machine
4. Check that the backend API is running and accessible