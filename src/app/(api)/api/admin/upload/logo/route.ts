import { requireAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/utils/supabase/admin";
import path from "node:path";
import { NextResponse } from "next/server";

function sanitizeBaseName(name: string) {
  return (
    name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "logo"
  );
}

export async function POST(request: Request) {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = path.extname(file.name) || ".png";
    const fileName = `logos/${Date.now()}-${sanitizeBaseName(file.name)}${extension}`;

    const supabase = createAdminClient();

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, buffer, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage logo upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Upload failed" },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: urlData.publicUrl,
      name: file.name,
    });
  } catch (error: any) {
    console.error("Logo upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
