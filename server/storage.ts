import { 
  User, InsertUser, 
  Property, InsertProperty, 
  Client, InsertClient,
  Message, InsertMessage,
  Appointment, InsertAppointment,
  Activity, InsertActivity
} from "@shared/schema";

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
  
  private userIdCounter: number;
  private propertyIdCounter: number;
  private clientIdCounter: number;
  private messageIdCounter: number;
  private appointmentIdCounter: number;
  private activityIdCounter: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.clients = new Map();
    this.messages = new Map();
    this.appointments = new Map();
    this.activities = new Map();
    
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.clientIdCounter = 1;
    this.messageIdCounter = 1;
    this.appointmentIdCounter = 1;
    this.activityIdCounter = 1;
    
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
      newLeads: clients.filter(c => c.createdAt > oneWeekAgo).length
    };
  }
}

export const storage = new MemStorage();
