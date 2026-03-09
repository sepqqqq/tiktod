import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_KEY = "Neipzyy";
const BASE_URL = "https://ytdlpyton.nvlgroup.my.id";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const resolution = searchParams.get("resolution");
  const mode = searchParams.get("mode") || "url";
  const type = searchParams.get("type") || "video"; // video or audio

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    let endpoint = "";
    if (type === "audio") {
      endpoint = `${BASE_URL}/download/audio?url=${encodeURIComponent(url)}&mode=${mode}&bitrate=128k`;
    } else {
      if (!resolution) {
        return NextResponse.json({ error: "Resolution is required for video" }, { status: 400 });
      }
      endpoint = `${BASE_URL}/download/?url=${encodeURIComponent(url)}&resolution=${resolution}&mode=${mode}`;
    }

    const response = await fetch(endpoint, {
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
    console.error("[YouTube Download API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
