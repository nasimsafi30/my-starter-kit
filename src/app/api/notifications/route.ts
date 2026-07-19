import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    
    // Get notifications for user (create table if needed)
    await sql.unsafe('CREATE TABLE IF NOT EXISTS notifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, title TEXT NOT NULL, message TEXT NOT NULL, type TEXT DEFAULT $$info$$, read BOOLEAN DEFAULT false, link TEXT, "createdAt" TIMESTAMPTZ DEFAULT NOW())');
    
    const notifs = await sql.unsafe('SELECT * FROM notifications WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 50', [session.user.id]);
    
    // If no notifications exist, create some sample ones
    if (notifs.length === 0) {
      await sql.unsafe('INSERT INTO notifications ("userId", title, message, type) VALUES ($1, $2, $3, $4)', [session.user.id, 'Welcome! 🎉', 'Welcome to the platform. Explore your dashboard to get started.', 'info']);
      await sql.unsafe('INSERT INTO notifications ("userId", title, message, type) VALUES ($1, $2, $3, $4)', [session.user.id, 'Profile Tip 💡', 'Complete your profile to get the most out of the platform.', 'warning']);
      await sql.unsafe('INSERT INTO notifications ("userId", title, message, type) VALUES ($1, $2, $3, $4)', [session.user.id, 'Security Reminder 🔒', 'Enable two-factor authentication for extra security.', 'info']);
      
      const freshNotifs = await sql.unsafe('SELECT * FROM notifications WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 50', [session.user.id]);
      await sql.end();
      
      const unread = freshNotifs.filter((n: any) => !n.read).length;
      return NextResponse.json({ notifications: freshNotifs, unread });
    }
    
    await sql.end();
    const unread = notifs.filter((n: any) => !n.read).length;
    return NextResponse.json({ notifications: notifs, unread });
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json({ notifications: [], unread: 0 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id } = body;

    const sql = postgres(DB, { ssl: "require", max: 1 });
    
    if (id) {
      await sql.unsafe('UPDATE notifications SET read = true WHERE id = $1 AND "userId" = $2', [id, session.user.id]);
    } else {
      await sql.unsafe('UPDATE notifications SET read = true WHERE "userId" = $1', [session.user.id]);
    }
    
    await sql.end();
    return NextResponse.json({ message: "Marked as read" });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, message, type, link } = body;

    if (!title || !message) return NextResponse.json({ error: "Title and message required" }, { status: 400 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    const result = await sql.unsafe(
      'INSERT INTO notifications ("userId", title, message, type, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [session.user.id, title, message, type || 'info', link || null]
    );
    await sql.end();

    return NextResponse.json({ notification: result[0], message: "Notification created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}