import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let cached: NeonHttpDatabase<typeof schema> | null = null;

/**
 * Lazily create the Drizzle/Neon client. It only touches `DATABASE_URL` (and
 * only throws if it's missing) when first CALLED — importing this module is
 * always safe, so the marketing site keeps building/running before the database
 * is provisioned.
 */
export function getDb(): NeonHttpDatabase<typeof schema> {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set — the database isn't provisioned yet.");
  }
  cached = drizzle(neon(url), { schema });
  return cached;
}

/** True once a database connection string is configured. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export { schema };
