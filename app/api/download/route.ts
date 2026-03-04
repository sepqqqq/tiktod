import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  let filename = request.nextUrl.searchParams.get("filename") || "download.mp4";

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

    // 2. Improve Content-Type detection
    let contentType = response.headers.get("content-type") || "application/octet-stream";
    
    // STRICT OVERRIDE based on filename to prevent MP4 becoming MP3
    // AND apply custom names requested by user
    const lowerFilename = filename.toLowerCase();
    let finalFilename = filename;

    if (lowerFilename.includes("hd")) {
      finalFilename = "neipzyyhdvideo.mp4";
      contentType = "video/mp4";
    } else if (lowerFilename.includes("wm")) {
      finalFilename = "neipzyywithwm.mp4";
      contentType = "video/mp4";
    } else if (lowerFilename.includes("audio") || lowerFilename.endsWith(".mp3") || (contentType.includes("audio") && !lowerFilename.includes("video"))) {
      finalFilename = "neipzyymp3.mp3";
      contentType = "audio/mpeg";
    } else if (lowerFilename.includes("photo") || lowerFilename.includes("slide")) {
      finalFilename = `neipzyyslide-${Date.now()}.jpg`;
      contentType = "image/jpeg";
    }

    // Ensure the filename ends with the correct extension if missing
    if (contentType === "video/mp4" && !finalFilename.endsWith(".mp4")) {
      finalFilename += ".mp4";
    } else if (contentType === "audio/mpeg" && !finalFilename.endsWith(".mp3")) {
      finalFilename += ".mp3";
    }

    // 3. Set download headers
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${finalFilename}"`);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    
    // Helpful headers for better download experience
    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    // 4. Return the data as a stream
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
