import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
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
  lottieUrl: z.string().optional().default(""),
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

const navLinkSchema = z.object({
  name: z.string(),
  path: z.string(),
});

const siteCopySchema = z.object({
  heroStatusLine: z.string(),
  homeAboutHeading: z.string(),
  homeAboutBody: z.string(),
  homeAboutCtaLabel: z.string(),
  homeAboutCtaUrl: z.string(),
  homeToolboxHeading: z.string(),
  homeToolboxIntro: z.string(),
  homeToolCategories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    })
  ),
  homeTools: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      icon: z.string(),
      category: z.string(),
      url: z.string().optional().default(""),
    })
  ).default([]),
  homeRecentHeading: z.string(),
  homeRecentIntro: z.string(),
  homeRecentWebTitle: z.string(),
  homeRecentWebCopy: z.string(),
  homeRecentWebCtaLabel: z.string(),
  homeRecentWebProjectIds: z.array(z.string()).default([]),
  homeSlidingRoles: z.string(),
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
  aboutResumeUrl: z.string(),
  aboutDesignResumeUrl: z.string(),
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
  footerLocation: z.string(),
  footerLargeText: z.string(),
  navLinks: z.array(navLinkSchema),
  preloaderText: z.string(),
  homeBackgroundImage: z.string(),
  contactBackgroundImage: z.string(),
  contactInstagramLabel: z.string(),
  contactLinkedinLabel: z.string(),
  contactEmailLabel: z.string(),
  designerResumeLabel: z.string(),
  designerResumeDesc: z.string(),
  developerResumeLabel: z.string(),
  developerResumeDesc: z.string(),
  resumeDropdownTitle: z.string(),
  resumeButtonLabel: z.string(),
  heroMobileCtaLabel: z.string(),
  heroMobileResumeLabel: z.string(),
  seoSiteName: z.string(),
  seoDefaultTitle: z.string(),
  seoDescription: z.string(),
  seoTwitterHandle: z.string(),
  seoKeywords: z.array(z.string()),
  seoOgImageAlt: z.string(),
  seoJobTitle: z.string(),
  seoEmployer: z.string(),
  seoEducation: z.string(),
  seoPhone: z.string(),
  seoKnowsAbout: z.array(z.string()),
  seoKnowsLanguage: z.array(z.string()),
  seoProfileImage: z.string(),
});

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  const siteCopy = await getSiteCopyContent();
  return NextResponse.json({ siteCopy });
}

import { LRUCache } from "lru-cache";

// LRU cache-based rate limiting to prevent spam and accidental infinite loops
const RATE_LIMIT_WINDOW_MS = 1000 * 60; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 updates per minute

const ipRequestCache = new LRUCache<string, { count: number; timestamp: number }>({
  max: 1000,
  ttl: RATE_LIMIT_WINDOW_MS,
});

export async function PUT(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const record = ipRequestCache.get(ip);

  if (record) {
    if (now - record.timestamp < RATE_LIMIT_WINDOW_MS) {
      record.count += 1;
      if (record.count > MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
      }
    } else {
      ipRequestCache.set(ip, { count: 1, timestamp: now });
    }
  } else {
    ipRequestCache.set(ip, { count: 1, timestamp: now });
  }

  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const siteCopy = siteCopySchema.parse(normalizeSiteCopyContent(body.siteCopy ?? body));
    await upsertSiteCopyContent(siteCopy);
    revalidatePath("/");
    return NextResponse.json({ siteCopy });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation failed for site-copy:", error.format());
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update site copy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
