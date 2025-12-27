import {
  pgTable,
  text,
  timestamp,
  decimal,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { storkjokkenAgreements } from "./service-agreements";
import { customers } from "./customers";
import { users } from "./users";

const prefix = "myhrvold_";

export const visitStatusEnum = pgEnum("visit_status", [
  "planned",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "overdue",
]);

export const visitTypeEnum = pgEnum("visit_type", [
  "scheduled",
  "automatic",
  "emergency",
  "follow_up",
]);

export const serviceVisits = pgTable(`${prefix}service_visits`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasjoner
  agreementId: uuid("agreement_id").references(() => storkjokkenAgreements.id),
  customerId: uuid("customer_id").references(() => customers.id),
  technicianId: uuid("technician_id").references(() => users.id),
  createdById: uuid("created_by_id").references(() => users.id),

  // Type og status
  visitType: visitTypeEnum("visit_type").default("scheduled"),
  status: visitStatusEnum("status").default("planned"),

  // Planlegging
  plannedDate: timestamp("planned_date", { withTimezone: true }),
  plannedStartTime: text("planned_start_time"),
  plannedEndTime: text("planned_end_time"),

  // Faktisk gjennomføring
  actualDate: timestamp("actual_date", { withTimezone: true }),
  actualStartTime: text("actual_start_time"),
  actualEndTime: text("actual_end_time"),
  actualHours: decimal("actual_hours", { precision: 6, scale: 2 }),

  // Rapport
  technicianNotes: text("technician_notes"),
  workPerformed: text("work_performed"),
  partsUsed: text("parts_used"),
  equipmentEvaluated: text("equipment_evaluated"),
  recommendations: text("recommendations"),

  // Signatur
  customerSignature: text("customer_signature"),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  signedByName: text("signed_by_name"),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ServiceVisit = typeof serviceVisits.$inferSelect;
export type NewServiceVisit = typeof serviceVisits.$inferInsert;
