// User types
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: string | null;
  createdAt: Date | null;
}

// Property types
export interface Property {
  id: number;
  type: string;
  status: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number | null;
  yearBuilt: number | null;
  parkingSpaces: string;
  description: string | null;
  mainImage: string;
  images: string[];
  features: string[] | null;
  listedById: number;
  createdAt: Date | null;
}

// Client types
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  realtorId: number;
  createdAt: Date | null;
}

// Message types
export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean | null;
  createdAt: Date | null;
}

// Appointment types
export interface Appointment {
  id: number;
  date: Date;
  realtorId: number;
  title: string;
  location: string;
  clientId: number | null;
  propertyId: number | null;
  notes: string | null;
  createdAt: Date | null;
}

// Activity types
export interface Activity {
  id: number;
  userId: number;
  type: string;
  title: string;
  description: string;
  propertyId: number | null;
  createdAt: Date | null;
}

// Conversation type for messages view
export type Conversation = {
  user: User | Client;
  lastMessage: Message;
}

// Statistics types for dashboard
export interface PropertyStatistics {
  activeListings: number;
  pendingSales: number;
  closedSales: number;
  newLeads: number;
}

export interface WebsiteStatistics {
  views: number[];
  inquiries: number[];
  dates: string[];
}

export interface FinancialStatistics {
  commissions: number[];
  sales: number[];
  dates: string[];
}

export interface DashboardData {
  portfolioValue: number;
  portfolioValueChange: number;
  statistics: PropertyStatistics;
  websiteStatistics: WebsiteStatistics;
  financialStatistics: FinancialStatistics;
  activities: Activity[];
  todayAppointments: Appointment[];
}