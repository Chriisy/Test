import {
  pgTable,
  text,
  timestamp,
  integer,
  decimal,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

const prefix = "myhrvold_";

export const partnerTypeEnum = pgEnum("partner_type", [
  "partner",
  "employee",
]);

export const partnerStatusEnum = pgEnum("partner_status", [
  "active",
  "pause",
  "inactive",
]);

export const tradeAreaEnum = pgEnum("trade_area", [
  "elektriker",
  "kjoletekniker",
  "rorlegger",
  "montor",
  "vaktmester",
]);

export const servicePartners = pgTable(`${prefix}service_partners`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Info
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person"),
  organizationNumber: text("organization_number"),

  // Type og status
  type: partnerTypeEnum("type").default("partner"),
  status: partnerStatusEnum("status").default("active"),
  tradeArea: tradeAreaEnum("trade_area"),

  // Kontakt
  phone: text("phone"),
  email: text("email"),

  // Adresse
  address: text("address"),
  postalCode: text("postal_code"),
  city: text("city"),
  county: text("county"),

  // Dekningsområde
  serviceArea: text("service_area"),
  workRadius: integer("work_radius"),

  // GPS
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),

  // Koordinator
  serviceCoordinatorId: uuid("service_coordinator_id").references(() => users.id),

  // Annet
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ServicePartner = typeof servicePartners.$inferSelect;
export type NewServicePartner = typeof servicePartners.$inferInsert;
