import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAchievements, upsertAchievement } from "@/lib/achievements";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z
    .union([z.string(), z.null()])
    .optional()
    .transform((value) => {
      const normalized = typeof value === "string" ? value.trim() : "";
      return normalized.length > 0 ? normalized : null;
    }),
  category: z.string().trim().min(1, "Category is required").default("Achievement"),
  imageUrl: z.string().optional().default(""),
  externalLink: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  orderIndex: z.number().optional().default(0),
});

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  const data = await getAchievements();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
    const body = await request.json();
    const data = schema.parse(body);

    await upsertAchievement({
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date ?? null,
      category: data.category,
      imageUrl: data.imageUrl,
      externalLink: data.externalLink,
      featured: data.featured,
      orderIndex: data.orderIndex,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Error creating achievement:", error);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}
