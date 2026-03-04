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
    // 1. Database logic - Use as Fallback, NOT early return
    let existing = null;
    const isDbConfigured = !!process.env.TURSO_DATABASE_URL && process.env.TURSO_DATABASE_URL !== "https://placeholder.turso.io";

    // 2. Fetch Fresh Data First (Always)
    console.log("[TikTok API] Fetching fresh data for:", url);
    
    let data: any = null;
    let fetchError: string | null = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

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
        }
      }
    } catch (e: any) {
      console.warn("[TikTok API] Primary API Failed:", e.message);
      fetchError = e.message;
    }

    // Attempt Fallback API
    if (!data) {
      try {
        console.log("[TikTok API] Trying Fallback API...");
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const result = await response.json();
        
        if (result.code === 0 && result.data) {
          const resData = result.data;
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
                  author: resData.music_info?.author || "Author",
                },
                author: {
                  nickname: resData.author?.nickname || "User",
                  avatar: resData.author?.avatar || "",
                  unique_id: resData.author?.unique_id || "",
                },
                images: resData.images || [],
                cover: resData.cover || resData.origin_cover || "",
              }
            }
          };
        }
      } catch (fallbackError) {
        console.error("[TikTok API] Fallback API Failed:", fallbackError);
      }
    }

    // 3. Fallback to Database if both APIs failed
    if (!data && isDbConfigured) {
      try {
        console.log("[TikTok API] APIs failed, checking DB for fallback...");
        existing = await db.query.downloads.findFirst({
          where: eq(downloads.url, url),
        });
        if (existing) {
          data = JSON.parse(existing.data);
          console.log("[TikTok API] Found fallback data in DB.");
        }
      } catch (dbReadError) {
        console.warn("[TikTok API] DB Fallback Error:", dbReadError);
      }
    }

    if (!data) {
      throw new Error(fetchError || "Failed to fetch content from all sources.");
    }

    // Robust Image/Cover Handling
    const apiData = data.result.data;
    if (apiData.images && apiData.images.length > 0) {
      apiData.cover = apiData.images[0]; // Force first image as cover for slides
    } else if (!apiData.cover || apiData.cover.includes("avatar") || apiData.cover.includes("musically")) {
      apiData.cover = apiData.origin_cover || apiData.play || apiData.cover || "";
    }

    // 4. Update Database with FRESH data (Cache Write)
    if (isDbConfigured) {
      try {
        await db.insert(downloads).values({
          id: nanoid(),
          url: url,
          title: apiData.title || "No Title",
          cover: apiData.cover || "",
          author: apiData.author?.nickname || "Unknown",
          data: JSON.stringify(data),
        }).onConflictDoUpdate({
          target: downloads.url,
          set: {
            title: apiData.title || "No Title",
            cover: apiData.cover || "",
            data: JSON.stringify(data),
            createdAt: new Date(),
          },
        });
      } catch (dbError) {
        console.error("[TikTok API] Database Update Error:", dbError);
      }
    }

    return new NextResponse(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "Pragma": "no-cache",
      },
    });

  } catch (error: any) {
    console.error("[TikTok API] Final Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content", details: error.message },
      { status: 500 }
    );
  }
}
