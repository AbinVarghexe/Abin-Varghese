import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { deleteAchievement, upsertAchievement } from "@/lib/achievements";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().nullable(),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional().default(""),
  externalLink: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  orderIndex: z.number().optional().default(0),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const { id } = await params;

  try {
    const body = await request.json();
    const data = schema.parse(body);

    await upsertAchievement({
      ...data,
      id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Error updating achievement:", error);
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const { id } = await params;

  try {
    await deleteAchievement(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}
