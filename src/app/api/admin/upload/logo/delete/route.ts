import { unlink } from "node:fs/promises";
import path from "node:path";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth-options";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // Security check: ensure URL starts with /uploads/logos/ and has no .. for traversal
    if (!url.startsWith("/uploads/logos/") || url.includes("..")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 403 });
    }

    const fileName = path.basename(url);
    const filePath = path.join(process.cwd(), "public", "uploads", "logos", fileName);

    try {
      await unlink(filePath);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      // If file doesn't exist, we still treat it as a success for the database cleanup
      if (err.code === 'ENOENT') {
         return NextResponse.json({ success: true, message: "File already gone" });
      }
      throw err;
    }
  } catch (error) {
    console.error("Logo deletion error:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
