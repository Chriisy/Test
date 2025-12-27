import {
  pgTable,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { users } from "./users";

const prefix = "myhrvold_";

export const agreementStatusEnum = pgEnum("agreement_status", [
  "lead",
  "draft",
  "sent",
  "signed",
  "active",
  "expired",
  "cancelled",
]);

// Storkjøkken Agreements (40+ felt)
export const storkjokkenAgreements = pgTable(`${prefix}storkjokken_agreements`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identifikasjon
  agreementNumber: text("agreement_number").unique(),
  sourceContractId: text("source_contract_id"),

  // Relasjoner
  customerId: uuid("customer_id").references(() => customers.id),
  createdById: uuid("created_by_id").references(() => users.id),
  departmentId: integer("department_id"),

  // Status
  status: agreementStatusEnum("status").default("draft"),

  // Kundeinfo (leveringsadresse)
  customerName: text("customer_name"),
  customerNumber: text("customer_number"),
  deliveryAddress: text("delivery_address"),
  deliveryPostcode: text("delivery_postcode"),
  deliveryCity: text("delivery_city"),

  // Fakturainfo
  invoiceCustomerNumber: text("invoice_customer_number"),
  invoiceCustomerName: text("invoice_customer_name"),
  invoiceAddress: text("invoice_address"),
  invoicePostcode: text("invoice_postcode"),
  invoiceCity: text("invoice_city"),

  // Kontaktinfo
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  kitchenManagerName: text("kitchen_manager_name"),
  kitchenManagerPhone: text("kitchen_manager_phone"),

  // Priser
  visitsPerYear: integer("visits_per_year"),
  pricePerYear: decimal("price_per_year", { precision: 12, scale: 2 }),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  hourlyRateCooling: decimal("hourly_rate_cooling", { precision: 10, scale: 2 }),
  zone1Rate: decimal("zone_1_rate", { precision: 10, scale: 2 }),
  zone2Rate: decimal("zone_2_rate", { precision: 10, scale: 2 }),
  callOutFee: decimal("call_out_fee", { precision: 10, scale: 2 }),

  // Gyldighet
  validFrom: timestamp("valid_from", { withTimezone: true }),
  validTo: timestamp("valid_to", { withTimezone: true }),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  signedBy: text("signed_by"),

  // Dokumenter
  documentUrl: text("document_url"),
  notes: text("notes"),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Dagligvare Agreements (~25 felt)
export const dagligvareAgreements = pgTable(`${prefix}dagligvare_agreements`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identifikasjon
  agreementNumber: text("agreement_number").unique(),

  // Relasjoner
  customerId: uuid("customer_id").references(() => customers.id),
  createdById: uuid("created_by_id").references(() => users.id),

  // Status
  status: agreementStatusEnum("status").default("draft"),

  // Kundeinfo
  customerName: text("customer_name"),
  customerNumber: text("customer_number"),
  storeAddress: text("store_address"),
  storePostcode: text("store_postcode"),
  storeCity: text("store_city"),

  // Kontakt
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  storeManagerName: text("store_manager_name"),

  // Utstyr
  equipmentCount: integer("equipment_count"),
  equipmentDescription: text("equipment_description"),

  // Priser
  visitsPerYear: integer("visits_per_year"),
  pricePerVisit: decimal("price_per_visit", { precision: 10, scale: 2 }),
  pricePerYear: decimal("price_per_year", { precision: 12, scale: 2 }),
  includesEmergency: boolean("includes_emergency").default(false),

  // Gyldighet
  validFrom: timestamp("valid_from", { withTimezone: true }),
  validTo: timestamp("valid_to", { withTimezone: true }),

  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type StorkjokkenAgreement = typeof storkjokkenAgreements.$inferSelect;
export type NewStorkjokkenAgreement = typeof storkjokkenAgreements.$inferInsert;
export type DagligvareAgreement = typeof dagligvareAgreements.$inferSelect;
export type NewDagligvareAgreement = typeof dagligvareAgreements.$inferInsert;
