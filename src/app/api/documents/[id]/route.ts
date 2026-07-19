import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function GET(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    const docs = await sql.unsafe('SELECT * FROM documents WHERE id = $1 AND "userId" = $2', [id, session.user.id]);
    await sql.end();

    if (docs.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ document: docs[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, size, type, url } = body;

    const sql = postgres(DB, { ssl: "require", max: 1 });
    await sql.unsafe(
      'UPDATE documents SET name = $1, size = $2, type = $3, url = $4, "updatedAt" = NOW() WHERE id = $5 AND "userId" = $6',
      [name, size, type, url, id, session.user.id]
    );
    const updated = await sql.unsafe('SELECT * FROM documents WHERE id = $1', [id]);
    await sql.end();

    return NextResponse.json({ document: updated[0], message: "Updated" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    await sql.unsafe('DELETE FROM documents WHERE id = $1 AND "userId" = $2', [id, session.user.id]);
    await sql.end();

    return NextResponse.json({ message: "Document deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}