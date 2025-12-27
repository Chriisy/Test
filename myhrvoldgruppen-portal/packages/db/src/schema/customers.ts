import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

const prefix = "myhrvold_";

export const customers = pgTable(`${prefix}customers`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identifikasjon
  customerNumber: text("customer_number").unique(),
  name: text("name").notNull(),
  orgNumber: text("org_number"),
  externalId: text("external_id"),

  // Kontaktinfo
  email: text("email"),
  phone: text("phone"),
  contactPerson: text("contact_person"),

  // Adresse
  address: text("address"),
  postalCode: text("postal_code"),
  city: text("city"),
  country: text("country").default("Norge"),

  // Kategorisering (Visma-felter)
  category: text("category"),
  customerSegment: text("customer_segment"),
  customerGroup: text("customer_group"),
  customerChain: text("customer_chain"),
  department: text("department"),

  // Import
  dataSource: text("data_source"),

  // Status
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
