import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { hasRole } from "@/lib/auth/rbac";
import { desc, gte, lte, and, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || !hasRole(session.user.role, "admin")) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const action = searchParams.get("action") || "";
    const entity = searchParams.get("entity") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const offset = (page - 1) * limit;

    let conditions = [];

    if (action) conditions.push(eq(auditLogs.action, action));
    if (entity) conditions.push(eq(auditLogs.entity, entity));
    if (startDate) conditions.push(gte(auditLogs.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(auditLogs.createdAt, new Date(endDate)));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [logs, total] = await Promise.all([
      db.query.auditLogs.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: desc(auditLogs.createdAt),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.$count(auditLogs, whereClause),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Audit logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
