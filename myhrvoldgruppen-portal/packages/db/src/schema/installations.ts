import {
  pgTable,
  text,
  timestamp,
  decimal,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { users } from "./users";

const prefix = "myhrvold_";

export const installationStatusEnum = pgEnum("installation_status", [
  "planned",
  "in_progress",
  "completed",
  "cancelled",
]);

export const installationPriorityEnum = pgEnum("installation_priority", [
  "low",
  "normal",
  "high",
  "urgent",
]);

export const installations = pgTable(`${prefix}installations`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identifikasjon
  installationNumber: text("installation_number").unique(),
  projectName: text("project_name"),

  // Relasjoner
  customerId: uuid("customer_id").references(() => customers.id),
  leadInstallerId: uuid("lead_installer_id").references(() => users.id),
  projectManagerId: uuid("project_manager_id").references(() => users.id),
  createdById: uuid("created_by_id").references(() => users.id),

  // Kundeinfo (denormalisert)
  customerName: text("customer_name"),
  customerNumber: text("customer_number"),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),

  // Leveringsadresse
  deliveryAddress: text("delivery_address"),
  postalCode: text("postal_code"),
  city: text("city"),

  // Status
  status: installationStatusEnum("status").default("planned"),
  priority: installationPriorityEnum("priority").default("normal"),
  projectType: text("project_type"),
  installationType: text("installation_type"),

  // Datoer
  plannedStartDate: timestamp("planned_start_date", { withTimezone: true }),
  plannedEndDate: timestamp("planned_end_date", { withTimezone: true }),
  actualStartDate: timestamp("actual_start_date", { withTimezone: true }),
  actualEndDate: timestamp("actual_end_date", { withTimezone: true }),

  // Timer og kostnader
  estimatedHours: decimal("estimated_hours", { precision: 8, scale: 2 }),
  actualHours: decimal("actual_hours", { precision: 8, scale: 2 }),
  estimatedCost: decimal("estimated_cost", { precision: 12, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 12, scale: 2 }),

  // Ordre
  orderNumber: text("order_number"),
  orderValue: decimal("order_value", { precision: 12, scale: 2 }),
  invoiceNumber: text("invoice_number"),

  // Notater
  notes: text("notes"),
  internalNotes: text("internal_notes"),

  // Signatur
  customerSignature: text("customer_signature"),
  signedAt: timestamp("signed_at", { withTimezone: true }),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Installation = typeof installations.$inferSelect;
export type NewInstallation = typeof installations.$inferInsert;
