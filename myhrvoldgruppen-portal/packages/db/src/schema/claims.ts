import {
  pgTable,
  text,
  timestamp,
  integer,
  decimal,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { products } from "./products";
import { suppliers } from "./suppliers";
import { users } from "./users";

const prefix = "myhrvold_";

export const claimStatusEnum = pgEnum("claim_status", [
  "draft",
  "new",
  "in_progress",
  "pending_supplier",
  "resolved",
  "closed",
]);

export const claimPriorityEnum = pgEnum("claim_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const warrantyStatusEnum = pgEnum("warranty_status", [
  "in_warranty",
  "out_of_warranty",
]);

export const claims = pgTable(`${prefix}claims`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Identifikasjon
  claimNumber: text("claim_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),

  // Relasjoner
  customerId: uuid("customer_id").references(() => customers.id),
  productId: uuid("product_id").references(() => products.id),
  supplierId: uuid("supplier_id").references(() => suppliers.id),
  assignedUserId: uuid("assigned_user_id").references(() => users.id),
  createdBy: uuid("created_by").references(() => users.id),

  // Status
  status: claimStatusEnum("status").default("new").notNull(),
  priority: claimPriorityEnum("priority").default("medium"),
  category: text("category"),
  defectCategory: text("defect_category"),

  // Datoer
  purchaseDate: timestamp("purchase_date", { withTimezone: true }),
  installationDate: timestamp("installation_date", { withTimezone: true }),
  reportedDate: timestamp("reported_date", { withTimezone: true }).defaultNow(),
  warrantyExpires: timestamp("warranty_expires", { withTimezone: true }),

  // Garanti
  warrantyStatus: warrantyStatusEnum("warranty_status"),

  // Produktinfo (denormalisert)
  productCode: text("product_code"),
  productName: text("product_name"),
  serialNumber: text("serial_number"),
  batchNumber: text("batch_number"),
  referenceNumber: text("reference_number"),
  orderReferenceNumber: text("order_reference_number"),
  invoiceNumber: text("invoice_number"),
  invoiceDate: timestamp("invoice_date", { withTimezone: true }),

  // Kundeinfo (denormalisert)
  customerContactName: text("customer_contact_name"),
  customerContactPhone: text("customer_contact_phone"),
  customerContactEmail: text("customer_contact_email"),
  customerCompanyName: text("customer_company_name"),
  customerReferenceNumber: text("customer_reference_number"),

  // Leverandør
  supplierNameText: text("supplier_name_text"),
  supplierVerificationCode: text("supplier_verification_code"),

  // Adresse
  installationAddress: text("installation_address"),

  // Beskrivelser
  partsDescription: text("parts_description"),
  problemDescription: text("problem_description"),
  diagnosisDescription: text("diagnosis_description"),
  internalNotes: text("internal_notes"),

  // Kostnader
  estimatedPartsCost: decimal("estimated_parts_cost", { precision: 12, scale: 2 }),
  estimatedLaborCost: decimal("estimated_labor_cost", { precision: 12, scale: 2 }),
  estimatedLaborHours: decimal("estimated_labor_hours", { precision: 6, scale: 2 }),

  // Leverandørsvar
  supplierResponse: text("supplier_response"),
  supplierResponseType: text("supplier_response_type"),
  supplierCreditNote: text("supplier_credit_note"),
  supplierResolutionDate: timestamp("supplier_resolution_date", { withTimezone: true }),
  supplierRepairOption: text("supplier_repair_option"),
  supplierCompensationOffer: decimal("supplier_compensation_offer", { precision: 12, scale: 2 }),
  supplierShippingInstructions: text("supplier_shipping_instructions"),

  // Shipping & PO
  supplierShippingDocsUrl: text("supplier_shipping_docs_url"),
  supplierPoNumber: text("supplier_po_number"),
  supplierPoDocUrl: text("supplier_po_doc_url"),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Claim = typeof claims.$inferSelect;
export type NewClaim = typeof claims.$inferInsert;
