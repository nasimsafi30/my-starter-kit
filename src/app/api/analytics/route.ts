import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const analytics = {
      pageViews: { total: 48295, change: 12.5 },
      uniqueVisitors: { total: 12345, change: 8.2 },
      avgTimeOnSite: { total: "4m 32s", change: 3.1 },
      bounceRate: { total: "32.1%", change: -2.4 },
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
