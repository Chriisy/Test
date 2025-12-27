// Database schema for Myhrvoldgruppen Service Portal
// Dette er en placeholder - full schema kommer i Fase 6-9

import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

// Prefix for alle tabeller
const prefix = "myhrvold_";

// Users tabell (26 felt - forenklet versjon)
export const users = pgTable(`${prefix}users`, {
  id: uuid("id").primaryKey().defaultRandom(),
  replitId: text("replit_id").unique(),
  email: varchar("email", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("user"),
  department: varchar("department", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customers tabell (20 felt - forenklet versjon)
export const customers = pgTable(`${prefix}customers`, {
  id: uuid("id").primaryKey().defaultRandom(),
  vismaId: varchar("visma_id", { length: 50 }),
  name: varchar("name", { length: 255 }).notNull(),
  orgNumber: varchar("org_number", { length: 20 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  postalCode: varchar("postal_code", { length: 10 }),
  county: varchar("county", { length: 100 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Claims tabell (forenklet - full versjon i Fase 7)
export const claims = pgTable(`${prefix}claims`, {
  id: uuid("id").primaryKey().defaultRandom(),
  claimNumber: varchar("claim_number", { length: 50 }).unique(),
  customerId: uuid("customer_id").references(() => customers.id),
  status: varchar("status", { length: 50 }).default("new"),
  priority: varchar("priority", { length: 20 }).default("medium"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  productName: varchar("product_name", { length: 255 }),
  serialNumber: varchar("serial_number", { length: 100 }),
  purchaseDate: timestamp("purchase_date"),
  reportedDate: timestamp("reported_date").defaultNow(),
  assignedTo: uuid("assigned_to").references(() => users.id),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API tokens for mobile auth
export const apiTokens = pgTable(`${prefix}api_tokens`, {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  token: text("token").unique().notNull(),
  name: varchar("name", { length: 100 }),
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Claim = typeof claims.$inferSelect;
export type NewClaim = typeof claims.$inferInsert;
