import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

const prefix = "myhrvold_";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "manager",
  "coordinator",
  "technician",
  "sales",
  "partner",
  "user",
]);

export const users = pgTable(`${prefix}users`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Innlogging
  username: text("username").unique(),
  email: text("email").unique(),
  password: text("password"),

  // Personinfo
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  avatar: text("avatar"),

  // Rolle og avdeling
  role: userRoleEnum("role").default("user").notNull(),
  functionalRole: text("functional_role"),
  department: text("department"),
  departmentId: integer("department_id"),

  // Status
  isActive: boolean("is_active").default(true).notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  approvedBy: uuid("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),

  // Replit Auth
  replitId: text("replit_id").unique(),
  oauthProvider: text("oauth_provider"),
  oauthId: text("oauth_id"),

  // Aktivitet
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }),

  // GDPR
  gdprConsentAt: timestamp("gdpr_consent_at", { withTimezone: true }),
  gdprConsentVersion: text("gdpr_consent_version"),

  // UI
  welcomeMessageDismissed: boolean("welcome_message_dismissed").default(false),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
