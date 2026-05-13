import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { getLinkedinSyncData, upsertLinkedinSyncData } from "@/lib/linkedin-content";

const schema = z.object({
  profileUrl: z.string(),
  connectionsCount: z.string(),
  currentRole: z.string(),
  company: z.string(),
  aboutText: z.string(),
  lastSyncDate: z.string(),
});

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  const data = await getLinkedinSyncData();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
    const body = await request.json();
    const data = schema.parse(body);

    await upsertLinkedinSyncData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Error saving linkedin sync data:", error);
    return NextResponse.json({ error: "Failed to save linkedin sync data" }, { status: 500 });
  }
}
