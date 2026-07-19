import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// For Neon, we need SSL
const client = postgres(connectionString, {
  max: 10,
  ssl: "require",
  idle_timeout: 20,
  connect_timeout: 30,
});

export const db = drizzle(client, { schema });