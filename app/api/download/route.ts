import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  let filename = request.nextUrl.searchParams.get("filename") || "download";

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // 1. Fetch from source URL
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });

    if (!response.ok) {
      throw new Error(`Source returned status ${response.status}`);
    }

    // 2. Content-Type determination
    let contentType = response.headers.get("content-type") || "application/octet-stream";
    
    // STRICT OVERRIDE FOR FILENAMES
    const lowerFilename = filename.toLowerCase();
    let finalFilename = filename;

    if (lowerFilename.includes("hdvideo")) {
      finalFilename = "neipzyyhdvideo.mp4";
      contentType = "video/mp4";
    } else if (lowerFilename.includes("withwm")) {
      finalFilename = "neipzyywithwm.mp4";
      contentType = "video/mp4";
    } else if (lowerFilename.includes("mp3")) {
      finalFilename = "neipzyymp3.mp3";
      contentType = "audio/mpeg";
    } else if (lowerFilename.includes("slide")) {
      finalFilename = `neipzyyslide-${Date.now()}.jpg`;
      contentType = "image/jpeg";
    } else {
      // Fallback
      if (contentType.includes("video")) finalFilename = `${filename}.mp4`;
      else if (contentType.includes("audio")) finalFilename = `${filename}.mp3`;
      else if (contentType.includes("image")) finalFilename = `${filename}.jpg`;
    }

    // Ensure extensions are present
    if (contentType === "video/mp4" && !finalFilename.endsWith(".mp4")) finalFilename += ".mp4";
    if (contentType === "audio/mpeg" && !finalFilename.endsWith(".mp3")) finalFilename += ".mp3";
    if (contentType === "image/jpeg" && !finalFilename.endsWith(".jpg")) finalFilename += ".jpg";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${finalFilename}"`);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    
    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("[Download API] Source Error:", error);
    return NextResponse.json(
      { error: "Failed to pipe download source", details: error.message },
      { status: 500 }
    );
  }
}
