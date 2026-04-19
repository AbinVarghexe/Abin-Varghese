import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { requireAdminSession } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

function sanitizeBaseName(name: string) {
  return name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "image";
}

export async function POST(request: Request) {
  const { session, response } = await requireAdminSession();
  if (response) return response;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = path.extname(file.name) || ".png";
    const fileName = `${Date.now()}-${sanitizeBaseName(file.name)}${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "about");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    return NextResponse.json({
      url: `/uploads/about/${fileName}`,
      name: file.name,
    });
  } catch (error) {
    console.error("About image upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
