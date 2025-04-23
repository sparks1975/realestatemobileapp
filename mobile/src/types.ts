// Define all the shared types for the mobile app
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
  description: string | null;
  mainImage: string;
  images: string[];
  features: string[] | null;
  listedById: number;
  createdAt: Date | null;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  realtorId: number;
  createdAt: Date | null;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean | null;
  createdAt: Date | null;
}

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

export interface Activity {
  id: number;
  userId: number;
  type: string;
  title: string;
  description: string;
  propertyId: number | null;
  createdAt: Date | null;
}

export type Conversation = {
  user: User | Client;
  lastMessage: Message;
}