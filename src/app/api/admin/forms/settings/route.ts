import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import {
  getContactSectionSettings,
  upsertContactSectionSettings,
} from "@/lib/contact-content";

const settingsSchema = z.object({
  introText: z.string(),
  instagramUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  contactEmail: z.string().email(),
  formEnabled: z.boolean(),
});

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  const settings = await getContactSectionSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const data = settingsSchema.parse(body);

    await upsertContactSectionSettings(data);
    return NextResponse.json({ settings: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid settings payload", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
