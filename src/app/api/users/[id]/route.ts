import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    const users = await sql.unsafe('SELECT id, name, email, image, bio, role, "isActive", "createdAt" FROM users WHERE id = $1', [id]);
    await sql.end();

    if (users.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user: users[0] });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const sql = postgres(DB, { ssl: "require", max: 1 });
    await sql.unsafe('UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), role = COALESCE($3, role), "isActive" = COALESCE($4, "isActive"), "updatedAt" = NOW() WHERE id = $5', [body.name || null, body.email || null, body.role || null, body.isActive ?? null, id]);
    await sql.end();
    return NextResponse.json({ message: "Updated" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    await sql.unsafe('DELETE FROM users WHERE id = $1', [id]);
    await sql.end();
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}