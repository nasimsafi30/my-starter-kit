import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import postgres from "postgres";

const DB = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const sql = postgres(DB, { ssl: "require", max: 1 });
    
    // Check if user exists
    const users = await sql.unsafe("SELECT id FROM users WHERE email = $1", [email]);
    
    if (users.length > 0) {
      // Generate reset token
      const token = randomUUID();
      const expires = new Date(Date.now() + 3600000); // 1 hour
      
      // Delete old tokens for this email first
      await sql.unsafe('DELETE FROM "passwordResetTokens" WHERE identifier = $1', [email]);
      
      // Insert new token
      await sql.unsafe(
        'INSERT INTO "passwordResetTokens" (identifier, token, expires) VALUES ($1, $2, $3)',
        [email, token, expires]
      );
    }
    
    await sql.end();

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account exists, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    // Still return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account exists, a password reset link has been sent",
    });
  }
}