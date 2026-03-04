import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import * as schema from "./schema";

// Initialize Turso database connection using environment variables
// Use a check to prevent build errors when environment variables are missing
const databaseUrl = process.env.TURSO_DATABASE_URL || "https://placeholder.turso.io";
const authToken = process.env.TURSO_AUTH_TOKEN;

const turso = createClient({
  url: databaseUrl,
  authToken: authToken,
});

// Export the drizzle instance for use throughout the application
export const db = drizzle(turso, { schema });

export type Database = typeof db;
