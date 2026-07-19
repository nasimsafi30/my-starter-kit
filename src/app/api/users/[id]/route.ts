import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function GET(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    const users = await sql.unsafe('SELECT id, name, email, image, bio, role, "isActive", "createdAt", "updatedAt" FROM users WHERE id = $1', [id]);
    await sql.end();

    if (users.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, role, isActive, password } = body;

    const sql = postgres(DB, { ssl: "require", max: 1 });

    if (password) {
      const hash = await bcrypt.hash(password, 12);
      await sql.unsafe('UPDATE users SET "passwordHash" = $1, "updatedAt" = NOW() WHERE id = $2', [hash, id]);
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) { updates.push('name = $' + paramCount); values.push(name); paramCount++; }
    if (email !== undefined) { updates.push('email = $' + paramCount); values.push(email); paramCount++; }
    if (role !== undefined) { updates.push('role = $' + paramCount); values.push(role); paramCount++; }
    if (isActive !== undefined) { updates.push('"isActive" = $' + paramCount); values.push(isActive); paramCount++; }

    if (updates.length > 0) {
      updates.push('"updatedAt" = NOW()');
      values.push(id);
      await sql.unsafe('UPDATE users SET ' + updates.join(', ') + ' WHERE id = $' + paramCount, values);
    }

    const result = await sql.unsafe('SELECT id, name, email, role, "isActive", "createdAt" FROM users WHERE id = $1', [id]);
    await sql.end();

    if (result.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user: result[0], message: "Updated" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sql = postgres(DB, { ssl: "require", max: 1 });
    await sql.unsafe('DELETE FROM users WHERE id = $1', [id]);
    await sql.end();

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}