import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, uniqueIndex, varchar } from "drizzle-orm/pg-core";
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
  yearBuilt: integer("year_built").default(0),
  parkingSpaces: text("parking_spaces").default(""),
  stories: text("stories").default(""),
  garageSpaces: text("garage_spaces").default(""),
  waterSource: text("water_source").default(""),
  utilities: text("utilities").default(""),
  pool: text("pool").default(""),
  roof: text("roof").default(""),
  lotFeatures: text("lot_features").default(""),
  parking: text("parking").default(""),
  airConditioning: text("air_conditioning").default(""),
  latitude: doublePrecision("latitude").default(0),
  longitude: doublePrecision("longitude").default(0),
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
  yearBuilt: true,
  parkingSpaces: true,
  stories: true,
  garageSpaces: true,
  waterSource: true,
  utilities: true,
  pool: true,
  roof: true,
  lotFeatures: true,
  parking: true,
  airConditioning: true,
  latitude: true,
  longitude: true,
  description: true,
  type: true,
  status: true,
  mainImage: true,
  images: true,
  features: true,
  listedById: true,
});

// Communities schema
export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  priceRange: text("price_range").notNull(),
  image: text("image").notNull(),
  features: text("features").array(),
  propertyCount: integer("properties_count").default(0),
  averagePrice: doublePrecision("average_price").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommunitySchema = createInsertSchema(communities).pick({
  name: true,
  description: true,
  location: true,
  priceRange: true,
  image: true,
  features: true,
  propertyCount: true,
  averagePrice: true,
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

// Page content schema for CMS functionality
export const pageContent = pgTable("page_content", {
  id: serial("id").primaryKey(),
  pageName: text("page_name").notNull(), // 'home', 'about', etc.
  sectionName: text("section_name").notNull(), // 'hero', 'featured-properties', etc.
  contentKey: text("content_key").notNull(), // 'title', 'description', 'image-url'
  contentValue: text("content_value").notNull(),
  contentType: text("content_type").notNull().default('text'), // 'text', 'image', 'link'
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniquePageSectionContent: uniqueIndex('unique_page_section_content').on(table.pageName, table.sectionName, table.contentKey),
}));

export const insertPageContentSchema = createInsertSchema(pageContent).pick({
  pageName: true,
  sectionName: true,
  contentKey: true,
  contentValue: true,
  contentType: true,
});

// Theme settings schema
export const themeSettings = pgTable('theme_settings', {
  id: serial('id').primaryKey(),
  primaryColor: varchar('primary_color', { length: 7 }).notNull().default('#CBA328'),
  secondaryColor: varchar('secondary_color', { length: 7 }).notNull().default('#1a1a1a'),
  tertiaryColor: varchar('tertiary_color', { length: 7 }).notNull().default('#f5f5f5'),
  textColor: varchar('text_color', { length: 7 }).notNull().default('#333333'),
  linkColor: varchar('link_color', { length: 7 }).notNull().default('#CBA328'),
  linkHoverColor: varchar('link_hover_color', { length: 7 }).notNull().default('#b8951f'),
  navigationColor: varchar('navigation_color', { length: 7 }).notNull().default('#1a1a1a'),
  subNavigationColor: varchar('sub_navigation_color', { length: 7 }).notNull().default('#2a2a2a'),
  headerBackgroundColor: varchar('header_background_color', { length: 7 }).notNull().default('#ffffff'),
  sectionBackgroundColor: varchar('section_background_color', { length: 7 }).notNull().default('#f8f8f8'),
  headingFont: varchar('heading_font', { length: 100 }).notNull().default('Inter'),
  bodyFont: varchar('body_font', { length: 100 }).notNull().default('Inter'),
  buttonFont: varchar('button_font', { length: 100 }).notNull().default('Inter'),
  headingFontWeight: varchar('heading_font_weight', { length: 3 }).notNull().default('600'),
  bodyFontWeight: varchar('body_font_weight', { length: 3 }).notNull().default('400'),
  buttonFontWeight: varchar('button_font_weight', { length: 3 }).notNull().default('500'),
  // Logo settings
  darkLogo: text('dark_logo'),
  lightLogo: text('light_logo'),
  colorLogo: text('color_logo'),
  headerLogo: varchar('header_logo', { length: 10 }).default('color'),
  footerLogo: varchar('footer_logo', { length: 10 }).default('light'),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertThemeSettingsSchema = createInsertSchema(themeSettings).pick({
  primaryColor: true,
  secondaryColor: true,
  tertiaryColor: true,
  textColor: true,
  linkColor: true,
  linkHoverColor: true,
  navigationColor: true,
  subNavigationColor: true,
  headerBackgroundColor: true,
  sectionBackgroundColor: true,
  headingFont: true,
  bodyFont: true,
  buttonFont: true,
  headingFontWeight: true,
  bodyFontWeight: true,
  buttonFontWeight: true,
  darkLogo: true,
  lightLogo: true,
  colorLogo: true,
  headerLogo: true,
  footerLogo: true,
  userId: true,
});

// Website themes schema
export const websiteThemes = pgTable("website_themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(false),
  previewImageUrl: text("preview_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertWebsiteThemeSchema = createInsertSchema(websiteThemes).pick({
  name: true,
  description: true,
  isActive: true,
  previewImageUrl: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  clients: many(clients),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  appointments: many(appointments, { relationName: "realtor" }),
  activities: many(activities),
  themeSettings: many(themeSettings)
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

export const themeSettingsRelations = relations(themeSettings, ({ one }) => ({
  user: one(users, {
    fields: [themeSettings.userId],
    references: [users.id]
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

export type ThemeSettings = typeof themeSettings.$inferSelect;
export type InsertThemeSettings = z.infer<typeof insertThemeSettingsSchema>;

export type PageContent = typeof pageContent.$inferSelect;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;

export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
