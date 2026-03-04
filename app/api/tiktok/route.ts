import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { downloads } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // 1. Check database first (cache/history) - Wrap in safety
    let existing = null;
    const isDbConfigured = process.env.TURSO_DATABASE_URL && process.env.TURSO_DATABASE_URL !== "https://placeholder.turso.io";

    if (isDbConfigured) {
      try {
        existing = await db.query.downloads.findFirst({
          where: eq(downloads.url, url),
        });
      } catch (dbReadError) {
        console.warn("[TikTok API] Database Read Error (skipping cache):", dbReadError);
      }
    }

    if (existing) {
      console.log("[TikTok API] Returning cached data for:", url);
      try {
        return NextResponse.json(JSON.parse(existing.data));
      } catch (parseError) {
        console.error("[TikTok API] Cache Parse Error:", parseError);
        // If parse fails, continue to fresh fetch
      }
    }

    // 2. Fetch from External API
    console.log("[TikTok API] Fetching fresh data for:", url);
    
    // Attempt 1: Primary API
    let data: any = null;
    try {
      const response = await fetch(
        `https://api.fikmydomainsz.xyz/download/tiktok-v2?url=${encodeURIComponent(url)}`,
        { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } }
      );
      if (response.ok) {
        const result = await response.json();
        if (result.status && result.result?.data) {
          data = result;
        }
      }
    } catch (e) {
      console.warn("[TikTok API] Primary API Failed:", e);
    }

    // Attempt 2: Fallback API (TikWM) if Primary failed
    if (!data) {
      try {
        console.log("[TikTok API] Trying Fallback API (TikWM)...");
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const result = await response.json();
        
        if (result.code === 0 && result.data) {
          // Normalize TikWM data to match our expected structure
          data = {
            status: true,
            result: {
              data: {
                id: result.data.id,
                title: result.data.title,
                hdplay: result.data.hdplay || result.data.play || "",
                wmplay: result.data.wmplay || result.data.play || "",
                play: result.data.play || "",
                music: result.data.music || result.data.music_info?.play || "",
                music_info: {
                  title: result.data.music_info?.title || result.data.title || "Music",
                  play: result.data.music_info?.play || result.data.music || "",
                  cover: result.data.music_info?.cover || result.data.cover || "",
                  author: result.data.music_info?.author || result.data.author?.nickname || "Author",
                },
                author: {
                  nickname: result.data.author?.nickname || "User",
                  avatar: result.data.author?.avatar || "",
                  unique_id: result.data.author?.unique_id || "",
                },
                images: result.data.images || [],
                cover: result.data.cover || "",
              }
            }
          };
        }
      } catch (fallbackError) {
        console.error("[TikTok API] Fallback API Failed:", fallbackError);
      }
    }

    if (!data) {
      throw new Error("All TikTok APIs failed to fetch data. Please try again later.");
    }

    // 3. Store in database if successful and DB is configured
    if (data.status && data.result?.data && isDbConfigured) {
      try {
        await db.insert(downloads).values({
          id: nanoid(),
          url: url,
          title: data.result.data.title || "No Title",
          cover: data.result.data.cover || "",
          author: data.result.data.author?.nickname || "Unknown",
          data: JSON.stringify(data),
        }).onConflictDoUpdate({
          target: downloads.url,
          set: {
            data: JSON.stringify(data),
          },
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
