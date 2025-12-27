import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  real,
  uuid,
} from "drizzle-orm/pg-core";

const prefix = "myhrvold_";

export const suppliers = pgTable(`${prefix}suppliers`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identifikasjon
  supplierCode: text("supplier_code").unique(),
  shortCode: text("short_code"),
  name: text("name").notNull(),

  // Kontaktinfo
  email: text("email"),
  phone: text("phone"),
  contactPerson: text("contact_person"),
  contactEmail: text("contact_email"),

  // Adresse
  address: text("address"),
  postalCode: text("postal_code"),
  city: text("city"),
  country: text("country").default("Norge"),
  website: text("website"),

  // Garanti og SLA
  warrantyDays: integer("warranty_days").default(365),
  warrantyText: text("warranty_text"),
  warrantyType: text("warranty_type"),
  slaResponseDays: integer("sla_response_days").default(14),

  // Kategorisering
  productSegment: text("product_segment"),
  countryOfOrigin: text("country_of_origin"),

  // Rabatt
  discountText: text("discount_text"),
  discountPercent: real("discount_percent"),

  // Import
  importedAt: timestamp("imported_at", { withTimezone: true }),
  importSource: text("import_source"),

  // Status
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
