import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { hasRole } from "@/lib/auth/rbac";

const systemSettings = {
  appName: "StarterKit",
  maintenanceMode: false,
  registrationOpen: true,
  maxUploadSize: 10485760,
  allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"],
  sessionTimeout: 3600,
  rateLimitEnabled: true,
  rateLimitMax: 100,
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !hasRole(session.user.role, "admin")) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ settings: systemSettings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || !hasRole(session.user.role, "admin")) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    Object.assign(systemSettings, body);

    return NextResponse.json({
      settings: systemSettings,
      message: "Settings updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
