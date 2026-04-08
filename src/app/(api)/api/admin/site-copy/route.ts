import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth-options";
import {
  getSiteCopyContent,
  normalizeSiteCopyContent,
  upsertSiteCopyContent,
} from "@/lib/site-copy-content";

const reviewSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  designation: z.string().optional().default(""),
  rating: z.number(),
});

const creativeCategorySchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
});

const timelineEntrySchema = z.object({
  role: z.string(),
  organization: z.string(),
  duration: z.string(),
  copy: z.string(),
});

const comparisonFeatureSchema = z.object({
  label: z.string(),
  others: z.boolean(),
  me: z.boolean(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const siteCopySchema = z.object({
  heroStatusLine: z.string(),
  homeAboutHeading: z.string(),
  homeAboutBody: z.string(),
  homeAboutCtaLabel: z.string(),
  homeToolboxHeading: z.string(),
  homeToolboxIntro: z.string(),
  homeToolCategories: z.array(
    z.object({
      id: z.enum(["design", "video", "development"]),
      name: z.string(),
      description: z.string(),
    })
  ),
  homeRecentHeading: z.string(),
  homeRecentIntro: z.string(),
  homeRecentWebTitle: z.string(),
  homeRecentWebCopy: z.string(),
  homeRecentWebCtaLabel: z.string(),
  homeCreativeTitle: z.string(),
  homeCreativeCopy: z.string(),
  homeCreativeCtaLabel: z.string(),
  homeCreativeCategories: z.array(creativeCategorySchema),
  homeServicesHeading: z.string(),
  homeServicesIntro: z.string(),
  homeReviewsHeading: z.string(),
  homeReviewsIntro: z.string(),
  homeReviewsItems: z.array(reviewSchema),
  aboutStickyNote: z.string(),
  aboutLowerRightNote: z.string(),
  aboutFooterTag: z.string(),
  aboutIntroTitle: z.string(),
  aboutIntroBody: z.string(),
  aboutBookImage: z.string(),
  aboutTimelineTitle: z.string(),
  aboutTimelineEntries: z.array(timelineEntrySchema),
  aboutTypewriterQuote: z.string(),
  servicesHeroTitle: z.string(),
  servicesWhyEyebrow: z.string(),
  servicesWhyHeading: z.string(),
  servicesWhyIntro: z.string(),
  servicesWhyCtaLabel: z.string(),
  servicesWhyCtaUrl: z.string(),
  servicesWhyFeatures: z.array(comparisonFeatureSchema),
  servicesFaqEyebrow: z.string(),
  servicesFaqHeading: z.string(),
  servicesFaqIntro: z.string(),
  servicesFaqItems: z.array(faqSchema),
  servicesFaqCtaText: z.string(),
  servicesFaqCtaLabel: z.string(),
  contactEyebrow: z.string(),
  contactHeading: z.string(),
  contactSupportLine: z.string(),
  contactGiantText: z.string(),
  footerBrandEyebrow: z.string(),
  footerSupportCopy: z.string(),
  footerEmail: z.string(),
  footerCtaHeading: z.string(),
  footerCtaCopy: z.string(),
  footerCopyright: z.string(),
  footerCredit: z.string(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteCopy = await getSiteCopyContent();
  return NextResponse.json({ siteCopy });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const siteCopy = siteCopySchema.parse(normalizeSiteCopyContent(body.siteCopy ?? body));
    await upsertSiteCopyContent(siteCopy);
    return NextResponse.json({ siteCopy });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update site copy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

