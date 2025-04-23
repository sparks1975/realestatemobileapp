# Realtor Dashboard Mobile App Setup

This document provides instructions for setting up and running the Realtor Dashboard mobile app using Expo.

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI
- Expo Go app installed on your mobile device (iOS or Android)

## Setup Instructions

### 1. Install Expo CLI globally (if not already installed)

```bash
npm install -g expo-cli
```

### 2. Install dependencies

Navigate to the mobile directory and install the required dependencies:

```bash
cd mobile
npm install
```

### 3. Configure the API endpoint

The mobile app needs to connect to your backend API. By default, it will connect to the deployed Replit URL. If you want to connect to a local development server, you'll need to modify the API URL.

Open `src/api/client.ts` and update the `getBaseUrl()` function to return your local network IP address:

```javascript
const getBaseUrl = () => {
  // Use your local IP address (e.g., 192.168.1.x:5000)
  return 'http://YOUR_LOCAL_IP:5000';
};
```

### 4. Start the Expo development server

Run the following command to start the Expo development server:

```bash
npm start
# or
npx expo start
```

### 5. Connect to the app

- **Using Expo Go on a physical device**: 
  - Scan the QR code displayed in the terminal with your mobile device's camera
  - It will open the Expo Go app and load your project

- **Using a simulator/emulator**:
  - Press `i` in the terminal to open in iOS simulator
  - Press `a` to open in Android emulator

## App Structure

The mobile app is organized as follows:

- `src/screens/`: Contains all screen components for the app
- `src/api/`: Contains API client and service modules
- `src/components/`: Reusable UI components
- `src/types.ts`: Contains type definitions

## Troubleshooting

If you encounter issues connecting to the API:

1. Ensure your mobile device is on the same Wi-Fi network as your development machine
2. Verify that the API URL in `src/api/client.ts` is correct
3. Check that the backend server is running and accessible

For Expo-specific issues, refer to the official Expo documentation: https://docs.expo.dev/