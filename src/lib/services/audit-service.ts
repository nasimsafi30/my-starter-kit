import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { eq, gte, lte, desc, and, lt } from "drizzle-orm";

interface AuditEvent {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  static async log(event: AuditEvent) {
    const [auditLog] = await db
      .insert(auditLogs)
      .values({
        userId: event.userId,
        action: event.action,
        entity: event.entity,
        entityId: event.entityId,
        details: event.details,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
      })
      .returning();

    return auditLog;
  }

  static async getUserLogs(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    const { limit = 50, offset = 0, startDate, endDate } = options;

    const conditions = [eq(auditLogs.userId, userId)];

    if (startDate) {
      conditions.push(gte(auditLogs.createdAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(auditLogs.createdAt, endDate));
    }

    const logs = await db.query.auditLogs.findMany({
      where: and(...conditions),
      orderBy: desc(auditLogs.createdAt),
      limit,
      offset,
    });

    const total = await db.$count(auditLogs, and(...conditions));

    return { logs, total };
  }

  static async getAllLogs(
    options: {
      limit?: number;
      offset?: number;
      action?: string;
      entity?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    const { limit = 50, offset = 0, action, entity, startDate, endDate } = options;

    const conditions = [];

    if (action) conditions.push(eq(auditLogs.action, action));
    if (entity) conditions.push(eq(auditLogs.entity, entity));
    if (startDate) conditions.push(gte(auditLogs.createdAt, startDate));
    if (endDate) conditions.push(lte(auditLogs.createdAt, endDate));

    const logs = await db.query.auditLogs.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: desc(auditLogs.createdAt),
      limit,
      offset,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const total = await db.$count(
      auditLogs,
      conditions.length > 0 ? and(...conditions) : undefined
    );

    return { logs, total };
  }

  static async getStats(startDate?: Date, endDate?: Date) {
    const conditions = [];
    if (startDate) conditions.push(gte(auditLogs.createdAt, startDate));
    if (endDate) conditions.push(lte(auditLogs.createdAt, endDate));

    const total = await db.$count(
      auditLogs,
      conditions.length > 0 ? and(...conditions) : undefined
    );

    return { total };
  }

  static async cleanup(daysToKeep = 365) {
    const cutoffDate = new Date(
      Date.now() - daysToKeep * 24 * 60 * 60 * 1000
    );

    const result = await db
      .delete(auditLogs)
      .where(lt(auditLogs.createdAt, cutoffDate))
      .returning({ id: auditLogs.id });

    return result.length;
  }
}