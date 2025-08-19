import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { log } from "./vite";
import { insertPropertySchema, insertAppointmentSchema, insertClientSchema, insertMessageSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.get("/api/users/me", async (req, res) => {
    // For demo purposes, always return the default user
    const user = await storage.getUserByUsername("alexmorgan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Properties
  app.get("/api/properties", async (req, res) => {
    const user = await storage.getUserByUsername("alexmorgan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const properties = await storage.getProperties(user.id);
    res.json(properties);
  });

  app.get("/api/properties/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    const property = await storage.getProperty(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    res.json(property);
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("alexmorgan");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        listedById: user.id
      });
      
      const property = await storage.createProperty(propertyData);
      
      // Create activity for new property
      await storage.createActivity({
        type: "listing",
        title: "New listing added",
        description: property.title,
        userId: user.id,
        propertyId: property.id
      });
      
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.patch("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const user = await storage.getUserByUsername("alexmorgan");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // First verify the property exists
      const existingProperty = await storage.getProperty(id);
      if (!existingProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Verify the property belongs to this user
      if (existingProperty.listedById !== user.id) {
        return res.status(403).json({ message: "You don't have permission to update this property" });
      }
      
      // Update the property
      const updatedProperty = await storage.updateProperty(id, req.body);
      if (!updatedProperty) {
        return res.status(500).json({ message: "Failed to update property" });
      }
      
      // Create activity for property update
      await storage.createActivity({
        type: "property_update",
        title: "Property updated",
        description: updatedProperty.title,
        userId: user.id,
        propertyId: updatedProperty.id
      });
      
      res.json(updatedProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const user = await storage.getUserByUsername("alexmorgan");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const existingProperty = await storage.getProperty(id);
      if (!existingProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const updatedProperty = await storage.updateProperty(id, req.body);
      if (!updatedProperty) {
        return res.status(500).json({ message: "Failed to update property" });
      }
      
      await storage.createActivity({
        type: "property_update",
        title: "Property updated",
        description: updatedProperty.title,
        userId: user.id,
        propertyId: updatedProperty.id
      });
      
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const user = await storage.getUserByUsername("alexmorgan");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const existingProperty = await storage.getProperty(id);
      if (!existingProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Add delete method to storage interface
      const deleted = await storage.deleteProperty(id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete property" });
      }
      
      await storage.createActivity({
        type: "property_delete",
        title: "Property deleted",
        description: existingProperty.title,
        userId: user.id,
        propertyId: null
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Clients
  app.get("/api/clients", async (req, res) => {
    const user = await storage.getUserByUsername("alexmorgan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const clients = await storage.getClients(user.id);
    res.json(clients);
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("alexmorgan");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const clientData = insertClientSchema.parse({
        ...req.body,
        realtorId: user.id
      });
      
      const client = await storage.createClient(clientData);
      
      // Create activity for new client
      await storage.createActivity({
        type: "lead",
        title: "New lead added",
        description: client.name,
        userId: user.id,
        propertyId: null
      });
      
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  // Messages
  app.get("/api/messages/conversations", async (req, res) => {
    const user = await storage.getUserByUsername("alexmorgan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const conversations = await storage.getUserConversations(user.id);
    res.json(conversations);
  });

  app.get("/api/messages/:userId", async (req, res) => {
    const user = await storage.getUserByUsername("alexmorgan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const otherUserId = parseInt(req.params.userId);
    if (isNaN(otherUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const messages = await storage.getConversation(user.id, otherUserId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("alexmorgan");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: user.id
      });
      
      const message = await storage.createMessage(messageData);
      
      // Create activity for new message
      await storage.createActivity({
        type: "message",
        title: "New message sent",
        description: message.content.substring(0, 50) + (message.content.length > 50 ? "..." : ""),
        userId: user.id,
        propertyId: null
      });
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Appointments
  app.get("/api/appointments", async (req, res) => {
    const user = await storage.getUserByUsername("alexmorgan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const appointments = await storage.getAppointmentsByRealtor(user.id);
    res.json(appointments);
  });

  app.get("/api/appointments/today", async (req, res) => {
    const user = await storage.getUserByUsername("alexmorgan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const today = new Date();
    const appointments = await storage.getAppointmentsByDate(user.id, today);
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("alexmorgan");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        realtorId: user.id
      });
      
      const appointment = await storage.createAppointment(appointmentData);
      
      // Create activity for new appointment
      await storage.createActivity({
        type: "appointment",
        title: "New appointment scheduled",
        description: appointment.title,
        userId: user.id,
        propertyId: appointment.propertyId
      });
      
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    const user = await storage.getUserByUsername("alexmorgan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const activities = await storage.getActivitiesByUser(user.id, limit);
    res.json(activities);
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("alexmorgan");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const activityData = insertActivitySchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Dashboard
  app.get("/api/dashboard", async (req, res) => {
    const user = await storage.getUserByUsername("alexmorgan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const portfolioValue = await storage.getPortfolioValue(user.id);
    const statistics = await storage.getStatistics(user.id);
    const activities = await storage.getActivitiesByUser(user.id, 5);
    const todayAppointments = await storage.getAppointmentsByDate(user.id, new Date());
    
    res.json({
      portfolioValue,
      statistics,
      activities,
      todayAppointments
    });
  });
  
  // Initialize some data for demo purposes (only if there's none)
  initializeDemoData();

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeDemoData() {
  // Create default user if it doesn't exist
  let user = await storage.getUserByUsername("alexmorgan");
  if (!user) {
    log("Creating default user", "db-init");
    user = await storage.createUser({
      username: "alexmorgan",
      password: "password",
      name: "Alex Morgan",
      email: "alex@example.com",
      phone: "555-987-6543",
      role: "realtor",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&h=500"
    });
  }
  
  // Create clients if none exist
  const clients = await storage.getClients(user.id);
  if (clients.length === 0) {
    const sarahClient = await storage.createClient({
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "555-123-4567",
      realtorId: user.id,
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=500"
    });
    
    const davidClient = await storage.createClient({
      name: "David Miller",
      email: "david@example.com",
      phone: "555-234-5678",
      realtorId: user.id,
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&h=500"
    });
    
    const jenniferClient = await storage.createClient({
      name: "Jennifer Lee",
      email: "jennifer@example.com",
      phone: "555-345-6789",
      realtorId: user.id,
      profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&h=500"
    });
    
    const michaelClient = await storage.createClient({
      name: "Michael Chang",
      email: "michael@example.com",
      phone: "555-456-7890",
      realtorId: user.id,
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=500"
    });
  }
  
  // Create properties if none exist
  const properties = await storage.getProperties(user.id);
  if (properties.length === 0) {
    await storage.createProperty({
      title: "Luxury Villa",
      address: "123 Luxury Ave",
      city: "Beverly Hills",
      state: "CA",
      zipCode: "90210",
      price: 4500000,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 6200,
      description: "This stunning luxury villa offers the perfect blend of elegant design and modern convenience. Featuring high ceilings, an open floor plan, and floor-to-ceiling windows that provide abundant natural light and panoramic views.",
      type: "For Sale",
      status: "Active",
      mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=800"
      ],
      features: ["Swimming Pool", "Smart Home System", "Home Theater", "Wine Cellar", "Outdoor Kitchen", "3-Car Garage"],
      listedById: user.id
    });
    
    await storage.createProperty({
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
      listedById: user.id
    });
    
    await storage.createProperty({
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
      listedById: user.id
    });
    
    await storage.createProperty({
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
      listedById: user.id
    });
  }
  
  // Create appointments if none exist
  const appointments = await storage.getAppointmentsByRealtor(user.id);
  if (appointments.length === 0) {
    const clients = await storage.getClients(user.id);
    const properties = await storage.getProperties(user.id);
    
    if (clients.length > 0 && properties.length > 0) {
      // Today's appointments
      const today = new Date();
      
      // First appointment at 10:30 AM
      const appt1 = new Date(today);
      appt1.setHours(10, 30, 0, 0);
      
      await storage.createAppointment({
        title: "Property Viewing",
        location: properties[0].address + ", " + properties[0].city + ", " + properties[0].state,
        date: appt1,
        clientId: clients[0].id,
        realtorId: user.id,
        propertyId: properties[0].id,
        notes: "Client is very interested in this property"
      });
      
      // Second appointment at 2:00 PM
      const appt2 = new Date(today);
      appt2.setHours(14, 0, 0, 0);
      
      await storage.createAppointment({
        title: "Listing Presentation",
        location: properties[3].address + ", " + properties[3].city + ", " + properties[3].state,
        date: appt2,
        clientId: clients[1].id,
        realtorId: user.id,
        propertyId: properties[3].id,
        notes: "Prepare listing presentation materials"
      });
      
      // Tomorrow's appointments
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const appt3 = new Date(tomorrow);
      appt3.setHours(11, 0, 0, 0);
      
      await storage.createAppointment({
        title: "Client Meeting",
        location: "Office - Conference Room B",
        date: appt3,
        clientId: clients[2].id,
        realtorId: user.id,
        propertyId: null,
        notes: "Discuss property requirements"
      });
      
      const appt4 = new Date(tomorrow);
      appt4.setHours(15, 30, 0, 0);
      
      await storage.createAppointment({
        title: "Property Viewing",
        location: properties[2].address + ", " + properties[2].city + ", " + properties[2].state,
        date: appt4,
        clientId: clients[3].id,
        realtorId: user.id,
        propertyId: properties[2].id,
        notes: "Client interested in penthouse option"
      });
    }
  }
  
  // Skip creating messages since they require client users to exist in the users table
  // and we don't want to modify the schema at this point
  log("Skipping message creation for demo database", "db-init");
  
  // Create activities if none exist
  const activities = await storage.getActivitiesByUser(user.id);
  if (activities.length === 0) {
    const properties = await storage.getProperties(user.id);
    
    // Message activity
    await storage.createActivity({
      type: "message",
      title: "New message from David Miller",
      description: "Hey, are we still meeting today at 3pm?",
      userId: user.id,
      propertyId: null
    });
    
    // Offer activity
    if (properties.length > 0) {
      await storage.createActivity({
        type: "offer",
        title: "Offer accepted",
        description: "Luxury Penthouse on 123 Skyline Blvd",
        userId: user.id,
        propertyId: properties[2].id
      });
    }
    
    // Listing activity
    if (properties.length > 1) {
      await storage.createActivity({
        type: "listing",
        title: "New listing added",
        description: "5 Bed Villa on 789 Sunset Dr",
        userId: user.id,
        propertyId: properties[3].id
      });
    }
  }
}
