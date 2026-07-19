import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      user: session.user,
      authenticated: true,
      expires: session.expires,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}
