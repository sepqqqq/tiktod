import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { downloads } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  // Status check for database connection
  if (searchParams.get("check") === "db") {
    const isDbConfigured = !!process.env.TURSO_DATABASE_URL && process.env.TURSO_DATABASE_URL !== "https://placeholder.turso.io";
    return NextResponse.json({ enabled: isDbConfigured });
  }

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // 1. Check database first (cache/history) - Wrap in safety
    let existing = null;
    const isDbConfigured = !!process.env.TURSO_DATABASE_URL && process.env.TURSO_DATABASE_URL !== "https://placeholder.turso.io";

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
        const cachedData = JSON.parse(existing.data);
        // Ensure images/slideshow detection even in cache
        if (cachedData.result?.data?.images?.length > 0 && !cachedData.result.data.cover?.includes("http")) {
           cachedData.result.data.cover = cachedData.result.data.images[0];
        }
        return NextResponse.json(cachedData);
      } catch (parseError) {
        console.error("[TikTok API] Cache Parse Error:", parseError);
      }
    }

    // 2. Fetch from External API with Timeout
    console.log("[TikTok API] Fetching fresh data for:", url);
    
    // Attempt 1: Primary API with 5s timeout
    let data: any = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(
        `https://api.fikmydomainsz.xyz/download/tiktok-v2?url=${encodeURIComponent(url)}`,
        { 
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.status && result.result?.data) {
          data = result;
          // Robust Cover Selection
          const apiData = data.result.data;
          // If images exist (slideshow), prioritize the first image as thumbnail
          if (apiData.images?.length > 0) {
            apiData.cover = apiData.images[0];
          } 
          // If no images, check if current cover is an avatar or missing
          else if (!apiData.cover || apiData.cover.includes("avatar") || apiData.cover.includes("musically")) {
            // Try to find a real video cover
            apiData.cover = apiData.origin_cover || apiData.cover || "";
          }
        }
      }
    } catch (e) {
      console.warn("[TikTok API] Primary API Failed or Timed out:", e);
    }

    // Attempt 2: Fallback API (TikWM) if Primary failed
    if (!data) {
      try {
        console.log("[TikTok API] Trying Fallback API (TikWM)...");
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const result = await response.json();
        
        if (result.code === 0 && result.data) {
          const resData = result.data;
          // Normalize TikWM data
          data = {
            status: true,
            result: {
              data: {
                id: resData.id,
                title: resData.title,
                hdplay: resData.hdplay || resData.play || "",
                wmplay: resData.wmplay || resData.play || "",
                play: resData.play || "",
                music: resData.music || resData.music_info?.play || "",
                music_info: {
                  title: resData.music_info?.title || resData.title || "Music",
                  play: resData.music_info?.play || resData.music || "",
                  cover: resData.music_info?.cover || resData.cover || "",
                  author: resData.music_info?.author || resData.author?.nickname || "Author",
                },
                author: {
                  nickname: resData.author?.nickname || "User",
                  avatar: resData.author?.avatar || "",
                  unique_id: resData.author?.unique_id || "",
                },
                images: resData.images || [],
                // Ensure cover is correct for TikWM too
                cover: resData.images?.length > 0 ? resData.images[0] : (resData.cover || resData.origin_cover || ""),
              }
            }
          };
        }
      } catch (fallbackError) {
        console.error("[TikTok API] Fallback API Failed:", fallbackError);
      }
    }

    if (!data) {
      throw new Error("TikTok API is currently unstable. Please try another link or wait a moment.");
    }

    if (data.result.data.images?.length > 0) {
      // Force the first image as the cover for slideshows
      data.result.data.cover = data.result.data.images[0];
    } else if (!data.result.data.cover || data.result.data.cover.includes("avatar")) {
      // For videos, if cover is still an avatar, try to find the video cover
      data.result.data.cover = data.result.data.origin_cover || data.result.data.play || "";
    }

    // 3. Store in database if successful
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
            createdAt: new Date(),
          },
        });
      } catch (dbError) {
        console.error("[TikTok API] Database Insert Error:", dbError);
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[TikTok API] Final Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content", details: error.message },
      { status: 500 }
    );
  }
}
