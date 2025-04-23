# Realtor Dashboard Mobile App

This is a React Native mobile app built with Expo for realtors to manage their properties, clients, messages, and schedule.

## Features

- Dashboard with portfolio value and recent activities
- Property listings with filtering
- Messaging with clients
- Schedule management with calendar
- User profile

## Getting Started

1. Install dependencies:
```
cd mobile
npm install
```

2. Start the Expo development server:
```
npm start
```

3. Use the Expo Go app on your mobile device to scan the QR code, or press 'i' or 'a' in the terminal to open the app in an iOS or Android simulator.

## Backend API

The mobile app connects to the same backend API as the web app. The backend server should be running at:

```
http://localhost:5000
```

## Project Structure

- `/src`: Source code
  - `/screens`: Main screen components
  - `/components`: Reusable UI components
  - `/hooks`: Custom React hooks
- `/assets`: Images, fonts, and other static assets