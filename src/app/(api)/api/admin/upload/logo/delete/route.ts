import { unlink } from "node:fs/promises";
import path from "node:path";
import { requireAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // If it's a Supabase storage URL
    if (url.includes("/storage/v1/object/public/uploads/")) {
      const storagePath = url.split("/storage/v1/object/public/uploads/")[1];
      if (storagePath) {
        const supabase = createAdminClient();
        await supabase.storage.from("uploads").remove([storagePath]);
      }
      return NextResponse.json({ success: true });
    }

    // Legacy local path handling
    if (url.startsWith("/uploads/logos/") && !url.includes("..")) {
      const fileName = path.basename(url);
      const filePath = path.join(process.cwd(), "public", "uploads", "logos", fileName);
      try {
        await unlink(filePath);
      } catch (err: any) {
        if (err.code !== "ENOENT") {
          console.warn("Could not remove local file:", err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logo deletion error:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
