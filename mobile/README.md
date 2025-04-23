# Realtor Dashboard Mobile App

A native mobile application built with Expo/React Native that provides realtors with a comprehensive dashboard to manage properties, clients, messages, and appointments.

## Features

- **Dashboard View**: Portfolio value, recent activity, and key stats
- **Property Management**: List, view, and manage real estate listings
- **Messaging System**: Chat with clients and team members
- **Scheduling**: Appointment calendar and reminders
- **Profile Management**: Update personal and professional information

## Tech Stack

- **Frontend**: React Native, Expo
- **Navigation**: React Navigation (bottom tabs and stack navigation)
- **API Communication**: Axios
- **State Management**: React hooks and context
- **UI Components**: Native components styled to match dubapp.com design language

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on physical devices)

### Installation

1. Clone the repository
2. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
3. Run the setup script:
   ```bash
   ./setup.sh
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:

```bash
npm start
```

This will display a QR code that you can scan with the Expo Go app on your iOS or Android device, or you can press:
- `i` to open in iOS simulator
- `a` to open in Android emulator
- `w` to open in web browser

## Project Structure

```
mobile/
├── assets/             # Images, fonts, and other static files
├── src/
│   ├── api/            # API service modules
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── types.ts        # TypeScript interfaces and types
│   └── utils/          # Utility functions
├── app.json            # Expo configuration
├── App.tsx             # Main application component
├── babel.config.js     # Babel configuration
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Workflow

In the Replit environment, you can run the mobile app using the "Start mobile app" workflow. This workflow has been configured to automatically restart when files are changed.

## Design Guidelines

The app follows Apple's Human Interface guidelines with a clean, minimalist aesthetic and careful attention to typography, spacing, and visual elements. The UI mimics the design style of dubapp.com, including fonts, color palette, glows, and gradients.

The app respects the accessibility color mode set on the user's phone and provides a seamless experience for realtors to manage their online presence.