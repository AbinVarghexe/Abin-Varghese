import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth-options";
import { getInstagramMediaUrl, isInstagramUrl, resolveInstagramPreview } from "@/lib/instagram";
import { getAboutContent, upsertAboutContent, getHeroContent, upsertHeroContent, getHomeContent, upsertHomeContent } from "@/lib/site-content";

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

const heroContentSchema = z.object({
  heroGreeting: z.string(),
  heroName: z.string(),
  heroSubcopy: z.string(),
  heroAudienceTags: z.string(),
  heroAvailabilityText: z.string(),
  heroCtaPrimaryLabel: z.string(),
  heroCtaPrimaryUrl: z.string(),
  heroCtaSecondaryLabel: z.string(),
  heroCtaSecondaryUrl: z.string(),
});

const homeContentSchema = z.object({
  scrollingBannerItems: z.string(),
  scrollingLogos: z.array(z.string()),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const about = await getAboutContent();
  const hero = await getHeroContent();
  const home = await getHomeContent();
  return NextResponse.json({ about, hero, home });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Legacy support: if type is missing, we assume it's about
    const type = body.type || 'about';
    const data = body.data || body; // Legacy body had data at root

    if (type === 'about') {
      const about = aboutContentSchema.parse(data);
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
    }

    if (type === 'hero') {
      const hero = heroContentSchema.parse(data);
      await upsertHeroContent(hero);
      return NextResponse.json({ hero });
    }

    if (type === 'home') {
      const home = homeContentSchema.parse(data);
      await upsertHomeContent(home);
      return NextResponse.json({ home });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
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
