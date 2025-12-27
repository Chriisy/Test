import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { suppliers } from "./suppliers";

const prefix = "myhrvold_";

export const products = pgTable(`${prefix}products`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identifikasjon
  sku: text("sku"),
  externalId: text("external_id"),
  name: text("name").notNull(),
  description: text("description"),

  // Kategorisering
  category: text("category"),
  categoryId: integer("category_id"),

  // Leverandør
  supplierId: uuid("supplier_id").references(() => suppliers.id),
  supplierName: text("supplier_name"),

  // Priser
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),
  sellingPrice: decimal("selling_price", { precision: 12, scale: 2 }),

  // Garanti
  warrantyMonths: integer("warranty_months").default(24),

  // Media
  imageUrl: text("image_url"),
  documentationUrl: text("documentation_url"),
  sourceUrl: text("source_url"),

  // Spesifikasjoner
  specifications: jsonb("specifications"),
  dimensions: text("dimensions"),
  weight: text("weight"),
  voltage: text("voltage"),
  capacity: text("capacity"),

  // Synkronisering
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),

  // Status
  isActive: boolean("is_active").default(true).notNull(),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
