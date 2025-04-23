# Realtor Dashboard with Mobile App

This project consists of two main components:

1. **Web Dashboard**: A responsive web-based dashboard for real estate professionals
2. **Mobile App**: A native mobile application built with Expo/React Native

## Project Structure

The project is organized as follows:

```
/
├── client/             # Web client (React)
├── server/             # Backend (Express)
├── shared/             # Shared code between server and client
└── mobile/             # Mobile app (Expo/React Native)
```

## Web Dashboard

The web dashboard provides a comprehensive interface for real estate professionals to manage their properties, clients, and business operations.

### Features

- Property management
- Client interaction
- Appointment scheduling
- Activity tracking
- Financial insights

### Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components

### Running the Web Dashboard

```bash
# Start the web dashboard and backend
npm run dev
```

## Mobile App

The mobile app is built with Expo/React Native and provides a native mobile experience for realtors on the go.

### Features

- Dashboard with key metrics
- Property management
- Messaging
- Scheduling
- Profile settings

### Tech Stack

- React Native / Expo
- TypeScript
- React Navigation
- Axios for API requests

### Setup Instructions

See the [mobile app README](./mobile/README.md) for detailed setup instructions.

## Development Workflows

Two workflows are available in this project:

1. **Start application**: Runs the web dashboard and backend
2. **Start mobile app**: Runs the mobile app (requires additional setup)

## Implementation Notes

- The mobile app uses the same backend API as the web dashboard.
- The app follows Apple's Human Interface Guidelines with a clean, minimalist aesthetic.
- The UI design mimics the style of dubapp.com with custom fonts, gradients, and visual elements.
- The app respects the system dark/light mode settings.

## Next Steps

1. Complete the mobile app implementation
2. Improve API connectivity between mobile and backend
3. Enhance the user interface with custom components
4. Add offline capabilities
5. Implement push notifications