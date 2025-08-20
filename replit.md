# Realtor Dashboard with Mobile App

## Overview

A comprehensive real estate management system consisting of a web dashboard and mobile application for real estate professionals. The platform enables property management, client communication, appointment scheduling, and business analytics. The web dashboard provides full-featured property editing and management capabilities, while the mobile app offers on-the-go access to core features with a native mobile experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Web Client**: React.js with TypeScript using Vite as the build tool
- **Mobile Client**: React Native with Expo for cross-platform mobile development
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query for server state management and caching
- **Navigation**: Wouter for web routing, React Navigation for mobile
- **Theme System**: Dark mode enforced across all interfaces

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database Layer**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with consistent error handling
- **Storage Interface**: Abstracted storage layer for flexible database operations
- **Authentication**: User-based authentication with session management

### Data Storage Solutions
- **Primary Database**: PostgreSQL for production data
- **ORM**: Drizzle ORM with schema-first approach
- **Migration System**: Drizzle Kit for database schema management
- **Connection Pooling**: Neon serverless PostgreSQL with connection pooling

### Mobile-Specific Architecture
- **Image Handling**: Expo ImagePicker with client-side compression
- **Network Layer**: Axios with configurable base URLs for development/production
- **Navigation Stack**: Stack and Tab navigators for hierarchical app structure
- **Platform Optimization**: iOS and Android specific configurations

### Theme Customization System
- **Granular Typography Controls**: Separate font settings for headings, body text, and buttons
- **Navigation Styling**: Independent color controls for navigation text and header background
- **Dynamic Font Loading**: Automatic Google Fonts integration for custom typography
- **CSS Variable System**: Real-time theme updates using CSS custom properties
- **Database-Driven Themes**: Theme settings stored in PostgreSQL with user-specific configurations

### Shared Components
- **Schema Definition**: Centralized TypeScript schemas shared between client and server
- **Type Safety**: Zod validation schemas derived from database schemas
- **Code Reuse**: Shared utilities and types between web and mobile applications

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/**: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework

### Mobile-Specific Dependencies
- **expo**: React Native development platform
- **@react-navigation/**: Navigation library for React Native
- **@expo/vector-icons**: Icon library for mobile interface
- **react-native-reanimated**: Animation library for smooth interactions

### Development Tools
- **vite**: Fast build tool for web development
- **typescript**: Type safety across the entire stack
- **date-fns**: Date manipulation and formatting
- **zod**: Runtime type validation and schema generation

### Third-Party Services
- **Unsplash**: Image hosting service for property photos and profile images
- **Replit Platform**: Hosting and development environment integration
- **Expo Go**: Mobile app testing and development platform