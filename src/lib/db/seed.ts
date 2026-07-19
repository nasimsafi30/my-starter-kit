import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const adminPasswordHash = await bcrypt.hash("admin123!", 12);
    await db
      .insert(users)
      .values({
        name: "Admin User",
        email: "admin@example.com",
        passwordHash: adminPasswordHash,
        role: "admin",
        emailVerified: new Date(),
        isActive: true,
      })
      .onConflictDoNothing();

    // Create regular user
    const userPasswordHash = await bcrypt.hash("user1234!", 12);
    await db
      .insert(users)
      .values({
        name: "Test User",
        email: "user@example.com",
        passwordHash: userPasswordHash,
        role: "user",
        isActive: true,
      })
      .onConflictDoNothing();

    // Create moderator
    const modPasswordHash = await bcrypt.hash("mod1234!", 12);
    await db
      .insert(users)
      .values({
        name: "Moderator",
        email: "mod@example.com",
        passwordHash: modPasswordHash,
        role: "moderator",
        isActive: true,
      })
      .onConflictDoNothing();

    console.log("✅ Database seeded successfully!");
    console.log("📧 Login Credentials:");
    console.log("   Admin: admin@example.com / admin123!");
    console.log("   User:  user@example.com / user1234!");
    console.log("   Mod:   mod@example.com / mod1234!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
