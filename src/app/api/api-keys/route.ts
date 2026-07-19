import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { randomBytes } from "crypto";

const apiKeys = [
  { id: "1", name: "Production", key: "sk_live_••••••••", created: "2024-01-15", status: "active" },
  { id: "2", name: "Development", key: "sk_test_••••••••", created: "2023-12-01", status: "active" },
];

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      apiKeys: apiKeys.map((k) => ({ ...k, key: `${k.key.slice(0, 10)}${"•".repeat(20)}` })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name } = await request.json();
    const key = `sk_${randomBytes(24).toString("hex")}`;

    const newKey = {
      id: Date.now().toString(),
      name,
      key,
      created: new Date().toISOString(),
      status: "active",
    };

    apiKeys.push(newKey);

    return NextResponse.json({
      apiKey: { ...newKey, key },
      message: "API key created. Store it safely!",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}
