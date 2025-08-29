import { 
  User, InsertUser, 
  Property, InsertProperty, 
  Client, InsertClient,
  Message, InsertMessage,
  Appointment, InsertAppointment,
  Activity, InsertActivity,
  ThemeSettings, InsertThemeSettings,
  PageContent, InsertPageContent,
  Community, InsertCommunity,
  WebsiteTheme, InsertWebsiteTheme,
  // Import all the schema tables
  users, properties, clients, messages, appointments, activities, themeSettings, pageContent, communities, websiteThemes
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, gte, lte } from "drizzle-orm";
import { startOfDay, endOfDay } from "date-fns";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(realtorId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getClients(realtorId: number): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getConversation(senderId: number, receiverId: number): Promise<Message[]>;
  getUserConversations(userId: number): Promise<{ user: User, lastMessage: Message }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByRealtor(realtorId: number): Promise<Appointment[]>;
  getAppointmentsByDate(realtorId: number, date: Date): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getActivitiesByUser(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Theme settings operations
  getThemeSettings(userId: number): Promise<ThemeSettings | undefined>;
  createThemeSettings(themeSettings: InsertThemeSettings): Promise<ThemeSettings>;
  updateThemeSettings(userId: number, themeSettings: Partial<ThemeSettings>): Promise<ThemeSettings | undefined>;
  
  // Page content operations
  getPageContent(pageName: string): Promise<PageContent[]>;
  upsertPageContent(pageContent: InsertPageContent): Promise<PageContent>;
  
  // Community operations
  getCommunities(): Promise<Community[]>;
  
  // Website theme operations
  getWebsiteThemes(): Promise<WebsiteTheme[]>;
  getActiveWebsiteTheme(): Promise<WebsiteTheme | undefined>;
  createWebsiteTheme(theme: InsertWebsiteTheme): Promise<WebsiteTheme>;
  setActiveWebsiteTheme(themeId: number): Promise<WebsiteTheme | undefined>;
  
  // Dashboard operations
  getPortfolioValue(realtorId: number): Promise<number>;
  getStatistics(realtorId: number): Promise<{
    activeListings: number;
    pendingSales: number;
    closedSales: number;
    newLeads: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private clients: Map<number, Client>;
  private messages: Map<number, Message>;
  private appointments: Map<number, Appointment>;
  private activities: Map<number, Activity>;
  private themeSettings: Map<number, ThemeSettings>;
  
  private userIdCounter: number;
  private propertyIdCounter: number;
  private clientIdCounter: number;
  private messageIdCounter: number;
  private appointmentIdCounter: number;
  private activityIdCounter: number;
  private themeIdCounter: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.clients = new Map();
    this.messages = new Map();
    this.appointments = new Map();
    this.activities = new Map();
    this.themeSettings = new Map();
    
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.clientIdCounter = 1;
    this.messageIdCounter = 1;
    this.appointmentIdCounter = 1;
    this.activityIdCounter = 1;
    this.themeIdCounter = 1;
    
    // Initialize with a default user
    this.createUser({
      username: "alexmorgan",
      password: "password",
      name: "Alex Morgan",
      email: "alex@example.com",
      role: "realtor",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&h=500"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(realtorId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.listedById === realtorId
    );
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const createdAt = new Date();
    const property: Property = { ...insertProperty, id, createdAt };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...updates };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClients(realtorId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.realtorId === realtorId
    );
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.clientIdCounter++;
    const createdAt = new Date();
    const client: Client = { ...insertClient, id, createdAt };
    this.clients.set(id, client);
    return client;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getConversation(senderId: number, receiverId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.senderId === senderId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === senderId)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getUserConversations(userId: number): Promise<{ user: User, lastMessage: Message }[]> {
    // Get all unique users this user has conversations with
    const userMessages = Array.from(this.messages.values()).filter(
      (message) => message.senderId === userId || message.receiverId === userId
    );
    
    const conversationParticipants = new Map<number, Message[]>();
    
    userMessages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!conversationParticipants.has(otherUserId)) {
        conversationParticipants.set(otherUserId, []);
      }
      
      conversationParticipants.get(otherUserId)?.push(message);
    });
    
    const conversations = [];
    
    for (const [participantId, messages] of conversationParticipants.entries()) {
      const user = await this.getUser(participantId);
      if (!user) continue;
      
      // Sort messages by date and get the last one
      messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const lastMessage = messages[0];
      
      conversations.push({ user, lastMessage });
    }
    
    // Sort conversations by the last message date
    return conversations.sort((a, b) => 
      b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const createdAt = new Date();
    const message: Message = { ...insertMessage, id, createdAt };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByRealtor(realtorId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.realtorId === realtorId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getAppointmentsByDate(realtorId: number, date: Date): Promise<Appointment[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return Array.from(this.appointments.values())
      .filter(appointment => {
        return appointment.realtorId === realtorId &&
               appointment.date >= targetDate &&
               appointment.date < nextDay;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const createdAt = new Date();
    const appointment: Appointment = { ...insertAppointment, id, createdAt };
    this.appointments.set(id, appointment);
    return appointment;
  }

  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getActivitiesByUser(userId: number, limit?: number): Promise<Activity[]> {
    const userActivities = Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? userActivities.slice(0, limit) : userActivities;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const createdAt = new Date();
    const activity: Activity = { ...insertActivity, id, createdAt };
    this.activities.set(id, activity);
    return activity;
  }

  // Dashboard operations
  async getPortfolioValue(realtorId: number): Promise<number> {
    const properties = await this.getProperties(realtorId);
    return properties.reduce((sum, property) => sum + property.price, 0);
  }

  async getStatistics(realtorId: number): Promise<{
    activeListings: number;
    pendingSales: number;
    closedSales: number;
    newLeads: number;
  }> {
    const properties = await this.getProperties(realtorId);
    const clients = await this.getClients(realtorId);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return {
      activeListings: properties.filter(p => p.status === "Active").length,
      pendingSales: properties.filter(p => p.status === "Pending").length,
      closedSales: properties.filter(p => p.status === "Sold").length,
      newLeads: clients.filter(c => c.createdAt! > oneWeekAgo).length
    };
  }

  // Theme settings operations (stub implementations)
  async getThemeSettings(userId: number): Promise<ThemeSettings | undefined> {
    return undefined;
  }

  async createThemeSettings(themeSettings: InsertThemeSettings): Promise<ThemeSettings> {
    throw new Error("Theme settings not implemented in MemStorage");
  }

  async updateThemeSettings(userId: number, themeSettings: Partial<ThemeSettings>): Promise<ThemeSettings | undefined> {
    return undefined;
  }

  // Page content operations (stub implementations)
  async getPageContent(pageName: string): Promise<PageContent[]> {
    return [];
  }

  async upsertPageContent(pageContent: InsertPageContent): Promise<PageContent> {
    throw new Error("Page content not implemented in MemStorage");
  }

  // Community operations (stub implementations)
  async getCommunities(): Promise<Community[]> {
    return [];
  }

  // Website theme operations (stub implementations)
  async getWebsiteThemes(): Promise<WebsiteTheme[]> {
    return [];
  }

  async getActiveWebsiteTheme(): Promise<WebsiteTheme | undefined> {
    return undefined;
  }

  async createWebsiteTheme(theme: InsertWebsiteTheme): Promise<WebsiteTheme> {
    throw new Error("Website themes not implemented in MemStorage");
  }

  async setActiveWebsiteTheme(themeId: number): Promise<WebsiteTheme | undefined> {
    throw new Error("Website themes not implemented in MemStorage");
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async getProperties(realtorId: number): Promise<Property[]> {
    return db.select().from(properties)
      .where(eq(properties.listedById, realtorId))
      .orderBy(properties.id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return true;
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    // Get the existing property first to ensure all fields are preserved
    const existingProperty = await this.getProperty(id);
    if (!existingProperty) {
      return undefined;
    }

    // Merge updates with existing data, ensuring no fields are lost
    const mergedUpdates = {
      // Start with existing property data
      ...existingProperty,
      // Apply updates on top, filtering out undefined values
      ...Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      ),
      // Ensure critical fields are never undefined
      yearBuilt: updates.yearBuilt ?? existingProperty.yearBuilt ?? 0,
      parkingSpaces: updates.parkingSpaces ?? existingProperty.parkingSpaces ?? '',
      features: updates.features ?? existingProperty.features ?? [],
      images: updates.images ?? existingProperty.images ?? [],
      mainImage: updates.mainImage ?? existingProperty.mainImage ?? '',
      lotSize: updates.lotSize ?? existingProperty.lotSize ?? 0
    };

    console.log('🔧 Storage Update - Existing:', JSON.stringify(existingProperty, null, 2));
    console.log('🔧 Storage Update - Updates:', JSON.stringify(updates, null, 2));
    console.log('🔧 Storage Update - Final merged:', JSON.stringify(mergedUpdates, null, 2));

    const [property] = await db
      .update(properties)
      .set(mergedUpdates)
      .where(eq(properties.id, id))
      .returning();
    return property;
  }

  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async getClients(realtorId: number): Promise<Client[]> {
    return db.select().from(clients).where(eq(clients.realtorId, realtorId));
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getConversation(senderId: number, receiverId: number): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, senderId),
            eq(messages.receiverId, receiverId)
          ),
          and(
            eq(messages.senderId, receiverId),
            eq(messages.receiverId, senderId)
          )
        )
      )
      .orderBy(messages.createdAt);
  }

  async getUserConversations(userId: number): Promise<{ user: User, lastMessage: Message }[]> {
    // For demo purposes, provide a simpler implementation that works with a new database
    // Get all messages for this user
    const allMessages = await db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
      .orderBy(desc(messages.createdAt));
    
    // Find unique conversation partners
    const conversationPartners = new Set<number>();
    const conversations: { user: User, lastMessage: Message }[] = [];
    
    for (const message of allMessages) {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      
      // Skip if we've already processed this partner
      if (conversationPartners.has(partnerId)) continue;
      conversationPartners.add(partnerId);
      
      // Get partner user
      const [partner] = await db
        .select()
        .from(users)
        .where(eq(users.id, partnerId));
      
      if (partner) {
        conversations.push({
          user: partner,
          lastMessage: message
        });
      }
    }
    
    return conversations;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentsByRealtor(realtorId: number): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.realtorId, realtorId))
      .orderBy(appointments.date);
  }

  async getAppointmentsByDate(realtorId: number, date: Date): Promise<Appointment[]> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    return db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.realtorId, realtorId),
          gte(appointments.date, dayStart),
          lte(appointments.date, dayEnd)
        )
      )
      .orderBy(appointments.date);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(insertAppointment)
      .returning();
    return appointment;
  }

  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }

  async getActivitiesByUser(userId: number, limit?: number): Promise<Activity[]> {
    const baseQuery = db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
    
    if (limit) {
      return baseQuery.limit(limit);
    }
    
    return baseQuery;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  // Theme settings operations
  async getThemeSettings(userId: number): Promise<ThemeSettings | undefined> {
    const [settings] = await db.select().from(themeSettings).where(eq(themeSettings.userId, userId));
    return settings;
  }

  async createThemeSettings(insertThemeSettings: InsertThemeSettings): Promise<ThemeSettings> {
    const [settings] = await db.insert(themeSettings).values(insertThemeSettings).returning();
    return settings;
  }

  async updateThemeSettings(userId: number, updates: Partial<ThemeSettings>): Promise<ThemeSettings | undefined> {
    const [settings] = await db
      .update(themeSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(themeSettings.userId, userId))
      .returning();
    return settings;
  }

  // Page content operations
  async getPageContent(pageName: string): Promise<PageContent[]> {
    return await db.select().from(pageContent).where(eq(pageContent.pageName, pageName));
  }

  async upsertPageContent(insertPageContent: InsertPageContent): Promise<PageContent> {
    // Try to find existing content first
    const existing = await db
      .select()
      .from(pageContent)
      .where(
        and(
          eq(pageContent.pageName, insertPageContent.pageName),
          eq(pageContent.sectionName, insertPageContent.sectionName),
          eq(pageContent.contentKey, insertPageContent.contentKey)
        )
      );

    if (existing.length > 0) {
      // Update existing content
      const [updated] = await db
        .update(pageContent)
        .set({ 
          contentValue: insertPageContent.contentValue,
          contentType: insertPageContent.contentType,
          updatedAt: new Date()
        })
        .where(eq(pageContent.id, existing[0].id))
        .returning();
      return updated;
    } else {
      // Create new content
      const [created] = await db
        .insert(pageContent)
        .values(insertPageContent)
        .returning();
      return created;
    }
  }

  // Community operations
  async getCommunities(): Promise<Community[]> {
    return await db.select().from(communities);
  }

  // Website theme operations
  async getWebsiteThemes(): Promise<WebsiteTheme[]> {
    return await db.select().from(websiteThemes).orderBy(websiteThemes.id);
  }

  async getActiveWebsiteTheme(): Promise<WebsiteTheme | undefined> {
    const [theme] = await db.select().from(websiteThemes).where(eq(websiteThemes.isActive, true));
    return theme;
  }

  async createWebsiteTheme(insertTheme: InsertWebsiteTheme): Promise<WebsiteTheme> {
    const [theme] = await db.insert(websiteThemes).values(insertTheme).returning();
    return theme;
  }

  async setActiveWebsiteTheme(themeId: number): Promise<WebsiteTheme | undefined> {
    // First, set all themes to inactive
    await db.update(websiteThemes).set({ isActive: false });
    
    // Then set the specified theme as active
    const [theme] = await db
      .update(websiteThemes)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(websiteThemes.id, themeId))
      .returning();
    
    return theme;
  }

  // Dashboard operations
  async getPortfolioValue(realtorId: number): Promise<number> {
    // Use Drizzle query builder for better type safety
    const props = await db
      .select({ price: properties.price })
      .from(properties)
      .where(eq(properties.listedById, realtorId));
    
    // Calculate total manually
    return props.reduce((sum, prop) => sum + prop.price, 0);
  }

  async getStatistics(realtorId: number): Promise<{
    activeListings: number;
    pendingSales: number;
    closedSales: number;
    newLeads: number;
  }> {
    // Get all properties for this realtor
    const props = await db
      .select()
      .from(properties)
      .where(eq(properties.listedById, realtorId));
    
    // Count by status
    const activeListings = props.filter(p => p.status === 'Active').length;
    const pendingSales = props.filter(p => p.status === 'Pending').length;
    const closedSales = props.filter(p => p.status === 'Sold').length;
    
    // Get recent clients (last week)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentClients = await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.realtorId, realtorId),
          gte(clients.createdAt as any, lastWeek)
        )
      );
    
    return {
      activeListings,
      pendingSales,
      closedSales,
      newLeads: recentClients.length
    };
  }
}

// Use database storage implementation
export const storage = new DatabaseStorage();
