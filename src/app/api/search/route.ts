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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const results = [
      { type: "user", title: "John Doe", description: "john@example.com", url: "/dashboard/users/1" },
      { type: "document", title: "Project Plan", description: "PDF Document", url: "/dashboard/documents/1" },
      { type: "page", title: "Settings", description: "Account settings", url: "/dashboard/settings" },
    ];

    return NextResponse.json({
      query,
      results: results.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase())
      ),
      total: results.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
