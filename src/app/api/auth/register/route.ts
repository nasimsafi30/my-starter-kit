import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { registerSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validated.email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);

    const [newUser] = await db
      .insert(users)
      .values({
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: "user",
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    return NextResponse.json(
      {
        user: newUser,
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      // ZodError in newer versions uses 'issues' instead of 'errors'
      const details = (error as any).issues || (error as any).errors || [];
      return NextResponse.json(
        {
          error: "Validation failed",
          details: Array.isArray(details) ? details.map((e: any) => ({
            field: e.path?.join(".") || "unknown",
            message: e.message || "Invalid value",
          })) : [],
        },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}