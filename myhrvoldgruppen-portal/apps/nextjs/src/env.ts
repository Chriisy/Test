import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * Disse er kun tilgjengelige på serveren.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Client-side environment variables schema.
   * Må starte med NEXT_PUBLIC_.
   */
  client: {
    // NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },

  /**
   * Runtime environment variables.
   * Kobler skjema til faktiske verdier.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  /**
   * Hopp over validering i CI/edge environments.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Gjør tomme strenger undefined så Zod kan validere.
   */
  emptyStringAsUndefined: true,
});
