import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Signed out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    );
  }
}
