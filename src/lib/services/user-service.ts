import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, like, or, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export class UserService {
  static async findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  static async findById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "user" | "moderator";
  }) {
    const passwordHash = await bcrypt.hash(data.password, 12);

    const [user] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || "user",
      })
      .returning();

    return user;
  }

  static async updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() } as any)
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  static async deleteUser(id: string) {
    await db.delete(users).where(eq(users.id, id));
  }

  static async searchUsers(query: string, limit = 10) {
    return db.query.users.findMany({
      where: or(
        like(users.name, "%" + query + "%"),
        like(users.email, "%" + query + "%")
      ),
      limit,
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });
  }

  static async getUsersPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [allUsers, total] = await Promise.all([
      db.query.users.findMany({
        limit,
        offset,
        orderBy: desc(users.createdAt),
      }),
      db.$count(users),
    ]);

    return {
      users: allUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async verifyPassword(userId: string, password: string) {
    const user = await this.findById(userId);
    if (!user?.passwordHash) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  static async changePassword(userId: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    return this.updateUser(userId, { passwordHash } as any);
  }
}