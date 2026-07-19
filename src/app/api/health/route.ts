import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const health: {
    status: string;
    timestamp: string;
    uptime: number;
    version: string;
    checks: {
      database: { status: string; message?: string };
      memory: { status: string; heapUsed?: string; heapTotal?: string };
    };
  } = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
    checks: {
      database: { status: "healthy" },
      memory: { status: "healthy" },
    },
  };

  try {
    await db.execute(sql`SELECT 1`);
  } catch {
    health.checks.database = {
      status: "unhealthy",
      message: "Database connection failed",
    };
    health.status = "degraded";
  }

  const memUsage = process.memoryUsage();
  health.checks.memory = {
    status: "healthy",
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + "MB",
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + "MB",
  };

  const statusCode = health.status === "healthy" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}