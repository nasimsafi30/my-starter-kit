import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { eq, lt } from "drizzle-orm";
import { randomBytes } from "crypto";

export class SessionService {
  /**
   * Create a new session
   */
  static async createSession(userId: string, rememberMe = false) {
    const token = randomBytes(48).toString("hex");
    const expiresAt = new Date(
      Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000
    );

    const [session] = await db
      .insert(sessions)
      .values({
        userId,
        sessionToken: token,
        expires: expiresAt,
      })
      .returning();

    return session;
  }

  /**
   * Get session by token
   */
  static async getSession(token: string) {
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, token),
      with: {
        user: true,
      },
    });

    if (!session) return null;

    // Check if expired
    if (new Date(session.expires) < new Date()) {
      await this.deleteSession(session.id);
      return null;
    }

    return session;
  }

  /**
   * Delete a session
   */
  static async deleteSession(sessionId: string) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  /**
   * Delete all sessions for a user
   */
  static async deleteAllUserSessions(userId: string) {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions() {
    const result = await db
      .delete(sessions)
      .where(lt(sessions.expires, new Date()))
      .returning({ id: sessions.id });

    return result.length;
  }

  /**
   * Get active session count for a user
   */
  static async getActiveSessionCount(userId: string) {
    return db.$count(sessions, eq(sessions.userId, userId));
  }

  /**
   * Check if a session is valid
   */
  static async isValidSession(token: string): Promise<boolean> {
    const session = await this.getSession(token);
    return !!session;
  }
}
