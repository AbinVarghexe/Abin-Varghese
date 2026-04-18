import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";

/**
 * GET /api/admin/image-proxy?url=<encoded-image-url>
 *
 * Server-side proxy for external images that block direct browser hotlinking
 * (e.g. Pinterest's i.pinimg.com CDN). The request originates from the Next.js
 * server, which has no Referer header, so the CDN allows the fetch.
 */
export async function GET(request: NextRequest) {
  const { response: adminResponse } = await requireAdminSession();
  if (adminResponse) return adminResponse;

  const imageUrl = request.nextUrl.searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Only allow known-safe image CDNs to prevent open-proxy abuse
  const ALLOWED_HOSTS = [
    "i.pinimg.com",
    "pinimg.com",
    "images.unsplash.com",
    "cdn.behance.net",
    "mir-s3-cdn-cf.behance.net",
    "live.staticflickr.com",
  ];

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const isAllowed = ALLOWED_HOSTS.some(
    (host) => parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
  );

  if (!isAllowed) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const imageRes = await fetch(imageUrl, {
      headers: {
        // Mimic a browser accept header for images
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        // No Referer — this is the key that bypasses Pinterest's hotlink protection
      },
    });

    if (!imageRes.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${imageRes.status}` },
        { status: 502 }
      );
    }

    const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
    const buffer = await imageRes.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache aggressively — the image won't change once pinned
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error) {
    console.error("[image-proxy] fetch failed:", error);
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
  }
}
