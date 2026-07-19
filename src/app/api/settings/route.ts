import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      settings: {
        darkMode: false,
        emailNotifications: true,
        twoFactorEnabled: false,
      },
    });
  } catch (error) {
    return NextResponse.json({ settings: {} });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    return NextResponse.json({ settings: body, message: "Saved" });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}