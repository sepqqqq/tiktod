import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { downloads } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // 1. Check database first (cache/history)
    const existing = await db.query.downloads.findFirst({
      where: eq(downloads.url, url),
    });

    if (existing) {
      console.log("[TikTok API] Returning cached data for:", url);
      // Update timestamp to keep it fresh
      return NextResponse.json(JSON.parse(existing.data));
    }

    // 2. Fetch from External API
    const response = await fetch(
      `https://api.fikmydomainsz.xyz/download/tiktok-v2?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const data = await response.json();

    // 3. Store in database if successful
    if (data.status && data.result?.data) {
      try {
        await db.insert(downloads).values({
          id: nanoid(),
          url: url,
          title: data.result.data.title || "No Title",
          cover: data.result.data.cover || "",
          author: data.result.data.author?.nickname || "Unknown",
          data: JSON.stringify(data),
        });
      } catch (dbError) {
        console.error("[TikTok API] Database Insert Error:", dbError);
        // Continue anyway, don't block the response
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[TikTok API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch TikTok content", details: error.message },
      { status: 500 }
    );
  }
}
