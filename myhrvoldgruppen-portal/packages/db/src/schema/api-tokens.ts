import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

const prefix = "myhrvold_";

export const apiTokens = pgTable(`${prefix}api_tokens`, {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relasjon
  userId: uuid("user_id").references(() => users.id).notNull(),

  // Token
  token: text("token").unique().notNull(),
  name: text("name"),

  // Datoer
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ApiToken = typeof apiTokens.$inferSelect;
export type NewApiToken = typeof apiTokens.$inferInsert;
