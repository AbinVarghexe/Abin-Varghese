import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth-options";
import { getInstagramMediaUrl, isInstagramUrl, resolveInstagramPreview } from "@/lib/instagram";
import { getAboutContent, upsertAboutContent } from "@/lib/site-content";

const aboutContentSchema = z.object({
  aboutImage: z.string(),
  aboutInstagramImage1: z.string(),
  aboutInstagramImage2: z.string(),
  aboutInstagramImage3: z.string(),
  aboutInstagramImage4: z.string(),
  aboutInstagramLink1: z.string(),
  aboutInstagramLink2: z.string(),
  aboutInstagramLink3: z.string(),
  aboutInstagramLink4: z.string(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const about = await getAboutContent();
  return NextResponse.json({ about });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const about = aboutContentSchema.parse(body);
    const resolvedAbout = { ...about };
    const mappings = [
      ["aboutInstagramImage1", "aboutInstagramLink1"],
      ["aboutInstagramImage2", "aboutInstagramLink2"],
      ["aboutInstagramImage3", "aboutInstagramLink3"],
      ["aboutInstagramImage4", "aboutInstagramLink4"],
    ] as const;

    for (const [imageKey, linkKey] of mappings) {
      const imageValue = resolvedAbout[imageKey];
      const linkValue = resolvedAbout[linkKey];
      const instagramSource =
        (imageValue && isInstagramUrl(imageValue) && imageValue) ||
        (linkValue && isInstagramUrl(linkValue) && linkValue) ||
        "";

      if (!instagramSource) {
        continue;
      }

      const resolvedPreview = await resolveInstagramPreview(instagramSource);
      const mediaFallback = getInstagramMediaUrl(instagramSource);

      if (resolvedPreview || mediaFallback) {
        resolvedAbout[imageKey] = resolvedPreview || mediaFallback || resolvedAbout[imageKey];
        resolvedAbout[linkKey] = instagramSource;
      }
    }

    await upsertAboutContent(resolvedAbout);

    return NextResponse.json({ about: resolvedAbout });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update site content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
