import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  console.log("⏳ Running migrations...");

  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./drizzle" });
  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);
  await migrationClient.end();
}

runMigrations()
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
