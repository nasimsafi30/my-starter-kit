import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    
    const [userCount, docCount, notifCount, recentActivity] = await Promise.all([
      sql.unsafe('SELECT COUNT(*)::int as count FROM users'),
      sql.unsafe('SELECT COUNT(*)::int as count FROM documents WHERE "userId" = $1', [session.user.id]),
      sql.unsafe('SELECT COUNT(*)::int as count FROM notifications WHERE "userId" = $1 AND read = false', [session.user.id]),
      sql.unsafe('SELECT * FROM "activityLogs" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 5', [session.user.id]),
    ]);

    await sql.end();

    return NextResponse.json({
      stats: {
        totalUsers: userCount[0]?.count || 0,
        totalDocuments: docCount[0]?.count || 0,
        unreadNotifications: notifCount[0]?.count || 0,
        activeSessions: 1,
      },
      recentActivity: recentActivity || [],
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({
      stats: { totalUsers: 0, totalDocuments: 0, unreadNotifications: 0, activeSessions: 0 },
      recentActivity: [],
    });
  }
}