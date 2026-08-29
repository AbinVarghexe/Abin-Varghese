import { requireAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

function sanitizeBaseName(name: string) {
  return (
    name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "resume"
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

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF uploads are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${sanitizeBaseName(file.name)}.pdf`;

    const supabase = createAdminClient();

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage resume upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Upload to storage failed" },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: urlData.publicUrl,
      name: file.name,
    });
  } catch (error: any) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
