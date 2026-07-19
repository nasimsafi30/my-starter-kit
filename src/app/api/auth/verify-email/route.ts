import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const verificationRecord = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.token, token),
        gt(verificationTokens.expires, new Date())
      ),
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        emailVerified: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.email, verificationRecord.identifier));

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
