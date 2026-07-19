import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hasRole } from "@/lib/auth/rbac";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !hasRole(session.user.role, "admin")) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const [totalUsers, adminCount, userCount, moderatorCount] = await Promise.all([
      db.$count(users),
      db.$count(users, eq(users.role, "admin")),
      db.$count(users, eq(users.role, "user")),
      db.$count(users, eq(users.role, "moderator")),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        adminCount,
        userCount,
        moderatorCount,
        activeUsers: totalUsers,
        storageUsed: "1.2 GB",
        apiCalls: "45,892",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

import { eq } from "drizzle-orm";
