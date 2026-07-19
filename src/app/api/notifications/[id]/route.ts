import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import postgres from "postgres";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function PUT(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    await sql.unsafe('UPDATE notifications SET read = true WHERE id = $1 AND "userId" = $2', [id, session.user.id]);
    await sql.end();

    return NextResponse.json({ message: "Marked as read" });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sql = postgres(DB, { ssl: "require", max: 1 });
    await sql.unsafe('DELETE FROM notifications WHERE id = $1 AND "userId" = $2', [id, session.user.id]);
    await sql.end();

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}