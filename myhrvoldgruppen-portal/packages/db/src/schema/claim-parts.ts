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
import { claims } from "./claims";

const prefix = "myhrvold_";

export const claimPartStatusEnum = pgEnum("claim_part_status", [
  "requested",
  "approved",
  "rejected",
  "shipped",
  "received",
]);

export const claimParts = pgTable(`${prefix}claim_parts`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasjon
  claimId: uuid("claim_id").references(() => claims.id).notNull(),

  // Delinfo
  partNumber: text("part_number"),
  partName: text("part_name"),
  supplierPartNumber: text("supplier_part_number"),

  // Mengde og pris
  quantity: integer("quantity").default(1),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }),

  // Status
  status: claimPartStatusEnum("status").default("requested"),
  isWarranty: boolean("is_warranty").default(false),

  // Datoer
  orderedAt: timestamp("ordered_at", { withTimezone: true }),
  receivedAt: timestamp("received_at", { withTimezone: true }),

  // Notater
  notes: text("notes"),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ClaimPart = typeof claimParts.$inferSelect;
export type NewClaimPart = typeof claimParts.$inferInsert;
