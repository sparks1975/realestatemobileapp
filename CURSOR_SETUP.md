# LuxeLead Realtor Dashboard - Cursor Setup Guide

## Project Overview

A comprehensive real estate management system with a web dashboard and mobile application for real estate professionals. Features property management, client communication, appointment scheduling, theme customization, and business analytics.

## Tech Stack

### Frontend (Web)
- **React 18** with TypeScript
- **Vite** as build tool
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for server state management
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database with Drizzle ORM
- **Neon Serverless** PostgreSQL

### Mobile
- **React Native** with Expo
- **React Navigation** for navigation

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components (shadcn/ui)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
│   └── index.html
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations interface
│   └── vite.ts            # Vite dev server integration
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts          # Database schema (Drizzle ORM)
├── mobile/                 # React Native mobile app
│   ├── App.tsx            # Mobile app entry
│   └── src/
│       └── screens/       # Mobile screen components
├── attached_assets/        # Static assets (logos, images)
├── package.json
├── drizzle.config.ts      # Drizzle ORM configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## Environment Variables Required

Create a `.env` file in the root directory with:

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Optional: For Neon Database
PGHOST=your-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database

# Mapbox (for map features)
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Object Storage (optional, for file uploads)
DEFAULT_OBJECT_STORAGE_BUCKET_ID=your-bucket-id
```

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

The project uses Drizzle ORM with PostgreSQL. Set up your database:

```bash
# Push schema to database
npm run db:push
```

If you get data-loss warnings during schema push:
```bash
npm run db:push --force
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push database schema changes |

## Key Files to Know

### Database Schema
`shared/schema.ts` - Contains all database table definitions and types using Drizzle ORM.

Key tables:
- `users` - User accounts
- `properties` - Real estate listings
- `clients` - Client information
- `appointments` - Scheduled appointments
- `messages` - Client messages
- `themeSettings` - Website theme customization
- `pageContent` - CMS content for pages
- `communities` - Featured communities
- `websiteThemes` - Available themes

### API Routes
`server/routes.ts` - All API endpoints are defined here.

Key endpoints:
- `GET/POST/PUT/DELETE /api/properties` - Property CRUD
- `GET/POST /api/clients` - Client management
- `GET/POST /api/appointments` - Appointment management
- `GET/PUT /api/theme-settings/:id` - Theme customization
- `GET/POST /api/pages/:pageName/content` - Page content CMS
- `GET/POST /api/communities` - Featured communities

### Storage Interface
`server/storage.ts` - Database operations abstraction layer. All CRUD operations go through this interface.

### Frontend Pages
- `client/src/pages/home.tsx` - Public homepage
- `client/src/pages/admin.tsx` - Admin dashboard (main management interface)
- `client/src/pages/properties.tsx` - Property listings page
- `client/src/pages/about.tsx` - About page
- `client/src/pages/contact.tsx` - Contact page

## Admin Panel Features

The admin panel (`/admin`) includes:

1. **Dashboard** - Overview statistics and analytics
2. **Properties** - Add, edit, delete property listings
3. **Clients** - Client management
4. **Appointments** - Scheduling
5. **Messages** - Client communications
6. **Pages** - CMS for homepage content (hero, about, communities, etc.)
7. **Themes** - Select website themes
8. **Style & Branding** - Customize colors, fonts, logos

## Design System

### Colors (Admin Panel)
- Primary: `#3B5674` (monotone blue-gray)
- Background: `#f8f8f8` / white
- Text: Gray scale

### UI Components
Uses shadcn/ui components located in `client/src/components/ui/`. Import them as:
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## Mobile App Setup

The mobile app is in the `mobile/` directory and uses Expo:

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go app to test on your device.

## Common Development Tasks

### Adding a New Database Table

1. Define the table in `shared/schema.ts`:
```typescript
export const myTable = pgTable("my_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  // ... other fields
});
```

2. Create insert schema and types:
```typescript
export const insertMyTableSchema = createInsertSchema(myTable).omit({ id: true });
export type InsertMyTable = z.infer<typeof insertMyTableSchema>;
export type MyTable = typeof myTable.$inferSelect;
```

3. Add storage methods in `server/storage.ts`

4. Add API routes in `server/routes.ts`

5. Push schema: `npm run db:push`

### Adding a New Page

1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.tsx`:
```tsx
<Route path="/my-page" component={MyPage} />
```

### Modifying Theme Settings

Theme settings are stored in the database. The admin panel provides a UI for editing them at `/admin` under "Style & Branding".

CSS variables are dynamically applied based on theme settings - see the `useEffect` in `home.tsx` that applies `--primary-color`, `--secondary-color`, etc.

## Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

The production build outputs to:
- Frontend: `dist/` (static files)
- Backend: `dist/index.js`

### Environment Requirements
- Node.js 18+
- PostgreSQL database
- Port 5000 available (or configure via PORT env var)

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if PostgreSQL is running
- Ensure network access to database server

### Build Errors
- Run `npm run check` to see TypeScript errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Theme Not Applying
- Check browser console for CSS variable errors
- Verify theme settings are saved in database
- Refresh page after saving theme changes

## File References

### Logo Files
- Admin logo: `attached_assets/luxeleadlogo_1760490424761.png`
- Dark logo: `attached_assets/logo-dark_1759979815607.png`

### Key Configuration Files
- `tailwind.config.ts` - Tailwind customization
- `components.json` - shadcn/ui configuration
- `drizzle.config.ts` - Database ORM config
- `vite.config.ts` - Build tool config

---

## Notes for Cursor AI

When working with this codebase:

1. **Schema First**: Always modify `shared/schema.ts` before making database-related changes
2. **Type Safety**: Use the generated types from schema for API responses
3. **Component Library**: Prefer shadcn/ui components from `@/components/ui/`
4. **Styling**: Use Tailwind CSS classes, follow existing patterns
5. **API Pattern**: Routes are thin - business logic goes in storage.ts
6. **No Comments**: The codebase convention is minimal comments unless explicitly requested
