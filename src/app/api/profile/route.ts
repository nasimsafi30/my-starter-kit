import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    const users = await sql.unsafe('SELECT id, name, email, image, bio, role FROM users WHERE id = $1', [session.user.id]);
    await sql.end();

    if (users.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user: users[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, email, image, bio } = body;

    const sql = postgres(DB, { ssl: "require", max: 1 });
    
    // Only update the CURRENT logged-in user, never anyone else
    await sql.unsafe(
      'UPDATE users SET name = $1, image = $2, bio = $3, "updatedAt" = NOW() WHERE id = $4',
      [name || null, image || null, bio || null, session.user.id]
    );
    
    const updated = await sql.unsafe('SELECT id, name, email, image, bio, role FROM users WHERE id = $1', [session.user.id]);
    await sql.end();

    return NextResponse.json({ user: updated[0], message: "Profile updated" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}