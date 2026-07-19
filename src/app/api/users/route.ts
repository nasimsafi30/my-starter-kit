import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    const users = await sql.unsafe('SELECT id, name, email, image, bio, role, "isActive", "createdAt" FROM users ORDER BY "createdAt" DESC');
    await sql.end();

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ users: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, image, bio } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);
    const sql = postgres(DB, { ssl: "require", max: 1 });
    
    // Check if email already exists
    const existing = await sql.unsafe('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) {
      await sql.end();
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // Create new user with image and bio - does NOT affect admin user
    const result = await sql.unsafe(
      'INSERT INTO users (name, email, "passwordHash", role, image, bio, "isActive") VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id, name, email, image, bio, role, "isActive", "createdAt"',
      [name || null, email, hash, role || "user", image || null, bio || null]
    );
    await sql.end();

    return NextResponse.json({ 
      user: result[0], 
      message: "User created successfully" 
    }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}