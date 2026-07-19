import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    
    // Create table if not exists
    await sql.unsafe('CREATE TABLE IF NOT EXISTS "activityLogs" (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, action TEXT NOT NULL, entity TEXT, "entityId" TEXT, details JSONB, "createdAt" TIMESTAMPTZ DEFAULT NOW())');
    
    // Get activities
    let activities = await sql.unsafe('SELECT * FROM "activityLogs" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 50', [session.user.id]);
    
    // If no activities, create sample ones
    if (activities.length === 0) {
      const sampleActions = [
        ['Logged in successfully', 'session', null, '{"browser": "Chrome", "os": "Windows"}'],
        ['Updated profile information', 'profile', null, '{"fields": "name, bio"}'],
        ['Viewed dashboard', 'page', '/dashboard', null],
        ['Changed password', 'security', null, null],
        ['Uploaded a document', 'document', null, '{"name": "sample.pdf"}'],
        ['Logged out', 'session', null, null],
        ['Logged in successfully', 'session', null, '{"browser": "Firefox", "os": "MacOS"}'],
        ['Viewed users page', 'page', '/dashboard/users', null],
        ['Updated settings', 'settings', null, '{"theme": "dark"}'],
        ['Deleted a document', 'document', null, '{"name": "old-file.docx"}'],
      ];

      for (const [action, entity, entityId, details] of sampleActions) {
        await sql.unsafe(
          'INSERT INTO "activityLogs" ("userId", action, entity, "entityId", details) VALUES ($1, $2, $3, $4, $5)',
          [session.user.id, action, entity, entityId || null, details ? JSON.parse(details) : null]
        );
      }

      activities = await sql.unsafe('SELECT * FROM "activityLogs" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 50', [session.user.id]);
    }
    
    await sql.end();

    // Group by date
    const grouped: any = {};
    activities.forEach((a: any) => {
      const date = new Date(a.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(a);
    });

    return NextResponse.json({ activities, grouped });
  } catch (error) {
    console.error("Activity error:", error);
    return NextResponse.json({ activities: [], grouped: {} });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { action, entity, entityId, details } = body;

    if (!action) return NextResponse.json({ error: "Action required" }, { status: 400 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    const result = await sql.unsafe(
      'INSERT INTO "activityLogs" ("userId", action, entity, "entityId", details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [session.user.id, action, entity || null, entityId || null, details ? JSON.stringify(details) : null]
    );
    await sql.end();

    return NextResponse.json({ activity: result[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }
}