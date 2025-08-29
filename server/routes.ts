import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { log } from "./vite";
import { insertPropertySchema, insertAppointmentSchema, insertClientSchema, insertMessageSchema, insertActivitySchema, insertThemeSettingsSchema, insertPageContentSchema, insertWebsiteThemeSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test endpoint to verify JSON parsing
  app.put('/api/test-json', (req, res) => {
    console.log('🔧 TEST - Content-Type:', req.headers['content-type']);
    console.log('🔧 TEST - Body:', req.body);
    console.log('🔧 TEST - Body type:', typeof req.body);
    res.json({ received: req.body, success: true });
  });
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

  // Communities
  app.get("/api/communities", async (req, res) => {
    try {
      const communities = await storage.getCommunities();
      res.json(communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
      res.status(500).json({ message: "Failed to fetch communities" });
    }
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

      console.log('🔧 PATCH - Request body:', JSON.stringify(req.body, null, 2));
      console.log('🔧 PATCH - Existing property images:', existingProperty.images);
      console.log('🔧 PATCH - Existing property mainImage:', existingProperty.mainImage);
      
      // Validate the update data but allow partial updates
      // Only validate fields that are actually present in the request
      const updates = { ...req.body };
      
      // Ensure arrays are properly handled
      if (updates.features && typeof updates.features === 'string') {
        updates.features = updates.features.split(',').map((f: string) => f.trim());
      }
      
      // Update the property
      const updatedProperty = await storage.updateProperty(id, updates);
      if (!updatedProperty) {
        return res.status(500).json({ message: "Failed to update property" });
      }
      
      console.log('🔧 PATCH - Final updated property:', JSON.stringify(updatedProperty, null, 2));
      
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
      console.error('🚨 PATCH error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  // Raw body PUT endpoint to bypass middleware parsing issues
  app.put("/api/properties/:id/raw", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    let rawData = '';
    req.on('data', chunk => {
      rawData += chunk.toString();
    });

    req.on('end', async () => {
      try {
        console.log('🔥 RAW PUT - Received data:', rawData);
        const requestBody = JSON.parse(rawData);
        console.log('🔥 RAW PUT - Parsed squareFeet:', requestBody.squareFeet);
        console.log('🔥 RAW PUT - Features in request:', requestBody.features);
        console.log('🔥 RAW PUT - Features type:', typeof requestBody.features);
        console.log('🔥 RAW PUT - Features length:', requestBody.features?.length);

        const user = await storage.getUserByUsername("alexmorgan");
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const existingProperty = await storage.getProperty(id);
        if (!existingProperty) {
          return res.status(404).json({ message: "Property not found" });
        }

        const updateData = insertPropertySchema.parse({
          ...existingProperty,
          ...requestBody,
          id: id,
          listedById: existingProperty.listedById
        });

        const updatedProperty = await storage.updateProperty(id, updateData);
        console.log('🔥 RAW PUT - Updated squareFeet:', updatedProperty?.squareFeet);
        console.log('🔥 RAW PUT - Updated features:', updatedProperty?.features);
        console.log('🔥 RAW PUT - Full updated property:', updatedProperty);

        res.json(updatedProperty);
      } catch (error: any) {
        console.error('❌ RAW PUT - Error:', error);
        res.status(400).json({ message: error.message });
      }
    });
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      console.log('🔄 PUT /api/properties/' + id + ' - Request body:', req.body);
      console.log('🔍 Request headers:', req.headers['content-type']);
      console.log('🔍 Raw body type:', typeof req.body);
      console.log('🔍 Body keys:', Object.keys(req.body || {}));
      console.log('🎯 Incoming squareFeet value:', req.body.squareFeet);
      
      const user = await storage.getUserByUsername("alexmorgan");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const existingProperty = await storage.getProperty(id);
      if (!existingProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      console.log('📊 Before update - existing squareFeet:', existingProperty.squareFeet);
      
      const updatedProperty = await storage.updateProperty(id, req.body);
      if (!updatedProperty) {
        return res.status(500).json({ message: "Failed to update property" });
      }
      
      console.log('✅ After update - updated squareFeet:', updatedProperty.squareFeet);
      
      await storage.createActivity({
        type: "property_update",
        title: "Property updated",
        description: updatedProperty.title,
        userId: user.id,
        propertyId: updatedProperty.id
      });
      
      res.json(updatedProperty);
    } catch (error) {
      console.error('❌ PUT error:', error);
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
  
  // Theme settings routes
  app.get("/api/theme-settings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.getThemeSettings(userId);
      
      if (!settings) {
        // Create default theme settings if none exist
        const defaultSettings = await storage.createThemeSettings({
          primaryColor: '#CBA328',
          secondaryColor: '#1a1a1a',
          tertiaryColor: '#f5f5f5',
          textColor: '#333333',
          linkColor: '#CBA328',
          linkHoverColor: '#b8951f',
          navigationColor: '#1a1a1a',
          subNavigationColor: '#2a2a2a',
          headerBackgroundColor: '#ffffff',
          sectionBackgroundColor: '#f8f8f8',
          headingFont: 'Inter',
          bodyFont: 'Inter',
          buttonFont: 'Inter',
          headingFontWeight: '600',
          bodyFontWeight: '400',
          buttonFontWeight: '500',
          userId: userId
        });
        return res.json(defaultSettings);
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Failed to get theme settings:", error);
      res.status(500).json({ message: "Failed to get theme settings" });
    }
  });

  app.put("/api/theme-settings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      console.log("🎨 PUT /api/theme-settings/" + userId);
      console.log("🎨 Request body:", req.body);
      
      const themeData = insertThemeSettingsSchema.parse({
        ...req.body,
        userId: userId
      });
      
      console.log("🎨 Parsed theme data:", themeData);
      
      // Try to update first
      let settings = await storage.updateThemeSettings(userId, themeData);
      
      // If no settings exist, create new ones
      if (!settings) {
        console.log("🎨 No existing settings, creating new ones");
        settings = await storage.createThemeSettings(themeData);
      }
      
      console.log("🎨 Final settings result:", settings);
      res.json(settings);
    } catch (error) {
      console.error("Failed to update theme settings:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid theme settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update theme settings" });
    }
  });

  // Website theme routes
  app.get("/api/website-themes", async (req, res) => {
    try {
      const themes = await storage.getWebsiteThemes();
      res.json(themes);
    } catch (error) {
      console.error('Error fetching website themes:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/website-themes/active", async (req, res) => {
    try {
      const theme = await storage.getActiveWebsiteTheme();
      if (!theme) {
        return res.status(404).json({ error: "No active theme found" });
      }
      res.json(theme);
    } catch (error) {
      console.error('Error fetching active theme:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/website-themes", async (req, res) => {
    try {
      const insertTheme = insertWebsiteThemeSchema.parse(req.body);
      const theme = await storage.createWebsiteTheme(insertTheme);
      res.status(201).json(theme);
    } catch (error) {
      console.error('Error creating website theme:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/website-themes/:id/activate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const theme = await storage.setActiveWebsiteTheme(id);
      if (!theme) {
        return res.status(404).json({ error: "Theme not found" });
      }
      res.json(theme);
    } catch (error) {
      console.error('Error activating theme:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Page content routes for CMS functionality
  app.get("/api/page-content/:pageName", async (req, res) => {
    try {
      const pageName = req.params.pageName;
      const content = await storage.getPageContent(pageName);
      res.json(content);
    } catch (error) {
      console.error("Failed to get page content:", error);
      res.status(500).json({ message: "Failed to get page content" });
    }
  });

  app.put("/api/page-content", async (req, res) => {
    try {
      const contentUpdates = req.body; // Array of content updates
      
      if (!Array.isArray(contentUpdates)) {
        return res.status(400).json({ message: "Content updates must be an array" });
      }

      const results = [];
      for (const update of contentUpdates) {
        const contentData = insertPageContentSchema.parse(update);
        const content = await storage.upsertPageContent(contentData);
        results.push(content);
      }
      
      res.json(results);
    } catch (error) {
      console.error("Failed to update page content:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid page content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update page content" });
    }
  });

  // Initialize some data for demo purposes (only if there's none)
  initializeDemoData();

  // Object storage routes for file uploads
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Page content routes
  app.get("/api/pages/:pageName/content", async (req, res) => {
    try {
      const { pageName } = req.params;
      const content = await storage.getPageContent(pageName);
      res.json(content);
    } catch (error) {
      console.error('Error fetching page content:', error);
      res.status(500).json({ error: "Failed to fetch page content" });
    }
  });

  app.post("/api/pages/content", async (req, res) => {
    try {
      const validatedContent = insertPageContentSchema.parse(req.body);
      const content = await storage.upsertPageContent(validatedContent);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid page content data", details: error.errors });
      }
      console.error('Error saving page content:', error);
      res.status(500).json({ error: "Failed to save page content" });
    }
  });

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
