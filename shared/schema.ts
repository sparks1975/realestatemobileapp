import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  profileImage: text("profile_image"),
  role: text("role").default("realtor"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  phone: true,
  profileImage: true,
  role: true,
});

// Property schema
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  price: doublePrecision("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: doublePrecision("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  lotSize: doublePrecision("lot_size").default(0), // Lot size in acres
  description: text("description"),
  type: text("type").notNull(), // For Sale, For Rent
  status: text("status").notNull(), // Active, Pending, Sold
  mainImage: text("main_image"),
  images: text("images").array(),
  features: text("features").array(),
  listedById: integer("listed_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).pick({
  title: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  price: true,
  bedrooms: true,
  bathrooms: true,
  squareFeet: true,
  lotSize: true,
  description: true,
  type: true,
  status: true,
  mainImage: true,
  images: true,
  features: true,
  listedById: true,
});

// Client schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  realtorId: integer("realtor_id").notNull().references(() => users.id),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  email: true,
  phone: true,
  realtorId: true,
  profileImage: true,
});

// Message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  content: true,
  read: true,
});

// Appointment schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  clientId: integer("client_id").references(() => clients.id),
  realtorId: integer("realtor_id").notNull().references(() => users.id),
  propertyId: integer("property_id").references(() => properties.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  title: true,
  location: true,
  date: true,
  clientId: true,
  realtorId: true,
  propertyId: true,
  notes: true,
});

// Activity schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // message, offer, listing
  title: text("title").notNull(),
  description: text("description").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  propertyId: integer("property_id").references(() => properties.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  title: true,
  description: true,
  userId: true,
  propertyId: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  clients: many(clients),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  appointments: many(appointments, { relationName: "realtor" }),
  activities: many(activities)
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  listedBy: one(users, {
    fields: [properties.listedById],
    references: [users.id]
  }),
  appointments: many(appointments),
  activities: many(activities)
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  realtor: one(users, {
    fields: [clients.realtorId],
    references: [users.id]
  }),
  appointments: many(appointments)
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender"
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver"
  })
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  client: one(clients, {
    fields: [appointments.clientId],
    references: [clients.id]
  }),
  realtor: one(users, {
    fields: [appointments.realtorId],
    references: [users.id],
    relationName: "realtor"
  }),
  property: one(properties, {
    fields: [appointments.propertyId],
    references: [properties.id]
  })
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id]
  }),
  property: one(properties, {
    fields: [activities.propertyId],
    references: [properties.id]
  })
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
