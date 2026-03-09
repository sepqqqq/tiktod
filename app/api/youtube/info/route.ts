import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_KEY = "Neipzyy";
const BASE_URL = "https://ytdlpyton.nvlgroup.my.id";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${BASE_URL}/info/?url=${encodeURIComponent(url)}&limit=50`, {
      headers: {
        "accept": "application/json",
        "X-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`External API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[YouTube Info API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
