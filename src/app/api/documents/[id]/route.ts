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
    const docs = await sql.unsafe('SELECT * FROM documents WHERE id = $1', [id]);
    await sql.end();
    if (docs.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ document: docs[0] });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sql = postgres(DB, { ssl: "require", max: 1 });
    await sql.unsafe('DELETE FROM documents WHERE id = $1', [id]);
    await sql.end();
    return NextResponse.json({ message: "Deleted" });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}