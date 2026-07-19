import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    const docs = await sql.unsafe('SELECT * FROM documents WHERE "userId" = $1 ORDER BY "createdAt" DESC', [session.user.id]);
    await sql.end();

    return NextResponse.json({ documents: docs });
  } catch (error) {
    console.error("GET docs error:", error);
    return NextResponse.json({ documents: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, size, type, url } = body;

    if (!name) return NextResponse.json({ error: "Document name required" }, { status: 400 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    const result = await sql.unsafe(
      'INSERT INTO documents ("userId", name, size, type, url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [session.user.id, name, size || null, type || null, url || null]
    );
    await sql.end();

    return NextResponse.json({ document: result[0], message: "Document created" }, { status: 201 });
  } catch (error) {
    console.error("POST doc error:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}