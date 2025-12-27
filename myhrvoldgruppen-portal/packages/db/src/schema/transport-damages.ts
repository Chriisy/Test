import {
  pgTable,
  text,
  timestamp,
  decimal,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { customers } from "./customers";
import { suppliers } from "./suppliers";
import { products } from "./products";
import { installations } from "./installations";

const prefix = "myhrvold_";

export const damageTypeEnum = pgEnum("damage_type", [
  "collision",
  "scratch",
  "dent",
  "water",
  "other",
]);

export const damageSeverityEnum = pgEnum("damage_severity", [
  "minor",
  "medium",
  "major",
  "critical",
]);

export const damageStatusEnum = pgEnum("damage_status", [
  "reported",
  "under_review",
  "confirmed",
  "rejected",
  "resolved",
]);

export const transportDamages = pgTable(`${prefix}transport_damages`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identifikasjon
  damageNumber: text("damage_number").unique(),
  reportedBy: uuid("reported_by").references(() => users.id),

  // Skadeinfo
  damageType: damageTypeEnum("damage_type"),
  severity: damageSeverityEnum("severity"),
  description: text("description"),

  // Transport
  carrier: text("carrier"),
  waybillNumber: text("waybill_number"),
  trackingNumber: text("tracking_number"),
  loadReference: text("load_reference"),
  driverName: text("driver_name"),

  // Relasjoner
  orderId: text("order_id"),
  deliveryNumber: text("delivery_number"),
  customerId: uuid("customer_id").references(() => customers.id),
  supplierId: uuid("supplier_id").references(() => suppliers.id),
  productId: uuid("product_id").references(() => products.id),
  installationId: uuid("installation_id").references(() => installations.id),

  // Lokasjon
  location: text("location"),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),

  // Status
  status: damageStatusEnum("status").default("reported"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  resolvedBy: uuid("resolved_by").references(() => users.id),

  // Økonomi
  estimatedCost: decimal("estimated_cost", { precision: 12, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 12, scale: 2 }),
  insuranceClaim: boolean("insurance_claim").default(false),
  insuranceClaimNumber: text("insurance_claim_number"),

  // Tidspunkt
  reportedAt: timestamp("reported_at", { withTimezone: true }),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type TransportDamage = typeof transportDamages.$inferSelect;
export type NewTransportDamage = typeof transportDamages.$inferInsert;
