import { Property, User, Client, Message, Appointment, Activity } from "@shared/schema";
import { startOfDay, addMinutes, addDays } from "date-fns";

// Current user
export const currentUser: User = {
  id: 1,
  username: "alexmorgan",
  password: "password",
  name: "Alex Morgan",
  email: "alex@example.com",
  phone: "555-987-6543",
  role: "realtor",
  profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&h=500",
  createdAt: new Date()
};

// Clients
export const clients: Client[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "555-123-4567",
    realtorId: 1,
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=500",
    createdAt: new Date()
  },
  {
    id: 2,
    name: "David Miller",
    email: "david@example.com",
    phone: "555-234-5678",
    realtorId: 1,
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&h=500",
    createdAt: new Date()
  },
  {
    id: 3,
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    phone: "555-345-6789",
    realtorId: 1,
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&h=500",
    createdAt: new Date()
  },
  {
    id: 4,
    name: "Michael Chang",
    email: "michael@example.com",
    phone: "555-456-7890",
    realtorId: 1,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=500",
    createdAt: new Date()
  }
];

// Properties
export const properties: Property[] = [
  {
    id: 1,
    title: "Luxury Villa",
    address: "123 Luxury Ave",
    city: "Beverly Hills",
    state: "CA",
    zipCode: "90210",
    price: 4500000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 6200,
    description: "This stunning luxury villa offers the perfect blend of elegant design and modern convenience. Featuring high ceilings, an open floor plan, and floor-to-ceiling windows that provide abundant natural light and panoramic views. The gourmet kitchen is equipped with top-of-the-line appliances and custom cabinetry. The primary suite includes a spa-like bathroom and spacious walk-in closet. The beautifully landscaped backyard features a swimming pool, outdoor kitchen, and entertainment area.",
    type: "For Sale",
    status: "Active",
    mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=800"
    ],
    features: ["Swimming Pool", "Smart Home System", "Home Theater", "Wine Cellar", "Outdoor Kitchen", "3-Car Garage"],
    listedById: 1,
    createdAt: new Date()
  },
  {
    id: 2,
    title: "Modern House",
    address: "456 Contemporary Dr",
    city: "Bel Air",
    state: "CA",
    zipCode: "90077",
    price: 2800000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3800,
    description: "A modern architectural masterpiece with clean lines and open spaces. This home features floor-to-ceiling windows, smart home technology, and a seamless indoor-outdoor living experience.",
    type: "For Sale",
    status: "Active",
    mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=800",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=800"
    ],
    features: ["Smart Home", "Wine Cellar", "Home Office", "Media Room"],
    listedById: 1,
    createdAt: new Date()
  },
  {
    id: 3,
    title: "Luxury Penthouse",
    address: "789 Skyline Blvd",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    price: 180000, // Monthly rent
    bedrooms: 3,
    bathrooms: 3.5,
    squareFeet: 3200,
    description: "Stunning penthouse with panoramic city views. This luxury unit features high-end finishes, a gourmet kitchen, and a private rooftop terrace for entertaining.",
    type: "For Rent",
    status: "Active",
    mainImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&h=800",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&h=800"
    ],
    features: ["City Views", "Concierge", "Fitness Center", "Spa"],
    listedById: 1,
    createdAt: new Date()
  },
  {
    id: 4,
    title: "Elegant Villa",
    address: "321 Ocean View Dr",
    city: "Malibu",
    state: "CA",
    zipCode: "90265",
    price: 5200000,
    bedrooms: 6,
    bathrooms: 5,
    squareFeet: 7500,
    description: "Breathtaking oceanfront villa with private beach access. This elegant home features expansive living areas, a chef's kitchen, and magnificent outdoor spaces for entertaining.",
    type: "For Sale",
    status: "Active",
    mainImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800"
    ],
    features: ["Ocean Views", "Private Beach", "Pool", "Tennis Court"],
    listedById: 1,
    createdAt: new Date()
  }
];

// Messages
export const messages: Message[] = [
  {
    id: 1,
    senderId: 2,
    receiverId: 1,
    content: "I'm interested in the Beverly Hills property. When can I schedule a viewing?",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
  },
  {
    id: 2,
    senderId: 3,
    receiverId: 1,
    content: "Hey, are we still meeting today at 3pm?",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 25) // 25 minutes ago
  },
  {
    id: 3,
    senderId: 4,
    receiverId: 1,
    content: "Thank you for showing me the property yesterday. I'd like to make an offer.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  },
  {
    id: 4,
    senderId: 5,
    receiverId: 1,
    content: "Could you send me the floor plans for the penthouse?",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
  }
];

// Appointments
export const appointments: Appointment[] = [
  {
    id: 1,
    title: "Property Viewing",
    location: "123 Luxury Ave, Beverly Hills, CA",
    date: addMinutes(startOfDay(new Date()), 10 * 60 + 30), // 10:30 AM today
    clientId: 1,
    realtorId: 1,
    propertyId: 1,
    notes: "Client is very interested in this property",
    createdAt: new Date()
  },
  {
    id: 2,
    title: "Listing Presentation",
    location: "321 Ocean View Dr, Malibu, CA",
    date: addMinutes(startOfDay(new Date()), 14 * 60), // 2:00 PM today
    clientId: 2,
    realtorId: 1,
    propertyId: 4,
    notes: "Prepare listing presentation materials",
    createdAt: new Date()
  },
  {
    id: 3,
    title: "Client Meeting",
    location: "Office - Conference Room B",
    date: addMinutes(startOfDay(addDays(new Date(), 1)), 11 * 60), // 11:00 AM tomorrow
    clientId: 3,
    realtorId: 1,
    propertyId: null,
    notes: "Discuss property requirements",
    createdAt: new Date()
  },
  {
    id: 4,
    title: "Property Viewing",
    location: "789 Skyline Blvd, Los Angeles, CA",
    date: addMinutes(startOfDay(addDays(new Date(), 1)), 15 * 60 + 30), // 3:30 PM tomorrow
    clientId: 4,
    realtorId: 1,
    propertyId: 3,
    notes: "Client interested in penthouse option",
    createdAt: new Date()
  }
];

// Activities
export const activities: Activity[] = [
  {
    id: 1,
    type: "message",
    title: "New message from David Miller",
    description: "Hey, are we still meeting today at 3pm?",
    userId: 1,
    propertyId: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
  },
  {
    id: 2,
    type: "offer",
    title: "Offer accepted",
    description: "Luxury Penthouse on 123 Skyline Blvd",
    userId: 1,
    propertyId: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  },
  {
    id: 3,
    type: "listing",
    title: "New listing added",
    description: "5 Bed Villa on 789 Sunset Dr",
    userId: 1,
    propertyId: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  }
];

// Financial Statistics
export const financialStatistics = {
  activeListings: 24,
  pendingSales: 8,
  closedSales: 15,
  newLeads: 38,
  activeListingsChange: 3,
  pendingSalesChange: 2,
  closedSalesChange: 5,
  newLeadsChange: 12
};

// Website Statistics
export const websiteStatistics = {
  pageViews: 12467,
  pageViewsChange: 8.3,
  visitors: 4832,
  visitorsChange: 12.1,
  inquiries: 127,
  inquiriesChange: 15.4,
  bounceRate: 32.4,
  bounceRateChange: -3.6
};

// Portfolio value
export const portfolioValue = 8200000; // $8.2M
export const portfolioValueChange = 2.4; // 2.4%
