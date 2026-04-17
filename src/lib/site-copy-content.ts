import { createClient } from "@/utils/supabase/server";
import type { HomeContent } from "@/lib/home-content-defaults";
import { 
  type SiteCopyReviewItem,
  type SiteCopyCreativeCategory,
  type SiteCopyTimelineEntry,
  type SiteCopyComparisonFeature,
  type SiteCopyFaqItem,
  type SiteCopyContent,
  siteCopyDefaults,
  type PublicSiteShellContent
} from "@/types/site-copy";
import { type ContactSectionSettings } from "@/types/contact";




const SITE_COPY_CONTENT_KEY = "site_copy_content_v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback: number) {
  return typeof value === "number" ? value : fallback;
}

function normalizeReviewItems(value: unknown): SiteCopyReviewItem[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.homeReviewsItems;
  }

  const normalized = value.reduce<SiteCopyReviewItem[]>((items, item, index) => {
    if (!isRecord(item)) {
      return items;
    }

    const normalizedItem: SiteCopyReviewItem = {
      id: normalizeString(item.id, `review-${index + 1}`),
      name: normalizeString(item.name, ""),
      content: normalizeString(item.content, ""),
      designation: normalizeString(item.designation, ""),
      rating: normalizeNumber(item.rating, 0),
    };

    if (normalizedItem.name && normalizedItem.content) {
      items.push(normalizedItem);
    }

    return items;
  }, []);

  return normalized.length > 0 ? normalized : siteCopyDefaults.homeReviewsItems;
}

function normalizeCreativeCategories(value: unknown): SiteCopyCreativeCategory[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.homeCreativeCategories;
  }

  const normalized = value
    .map((item) => {
      if (!isRecord(item)) return null;

      return {
        title: normalizeString(item.title, ""),
        description: normalizeString(item.description, ""),
        image: normalizeString(item.image, ""),
      };
    })
    .filter((item): item is SiteCopyCreativeCategory => Boolean(item && item.title));

  return normalized.length > 0 ? normalized : siteCopyDefaults.homeCreativeCategories;
}

function normalizeTimelineEntries(value: unknown): SiteCopyTimelineEntry[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.aboutTimelineEntries;
  }

  const normalized = value
    .map((item) => {
      if (!isRecord(item)) return null;

      return {
        role: normalizeString(item.role, ""),
        organization: normalizeString(item.organization, ""),
        duration: normalizeString(item.duration, ""),
        copy: normalizeString(item.copy, ""),
      };
    })
    .filter((item): item is SiteCopyTimelineEntry => Boolean(item && item.role));

  return normalized.length > 0 ? normalized : siteCopyDefaults.aboutTimelineEntries;
}

function normalizeComparisonFeatures(value: unknown): SiteCopyComparisonFeature[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.servicesWhyFeatures;
  }

  const normalized = value
    .map((item) => {
      if (!isRecord(item)) return null;

      return {
        label: normalizeString(item.label, ""),
        others: Boolean(item.others),
        me: Boolean(item.me),
      };
    })
    .filter((item): item is SiteCopyComparisonFeature => Boolean(item && item.label));

  return normalized.length > 0 ? normalized : siteCopyDefaults.servicesWhyFeatures;
}

function normalizeFaqItems(value: unknown): SiteCopyFaqItem[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.servicesFaqItems;
  }

  const normalized = value
    .map((item) => {
      if (!isRecord(item)) return null;

      return {
        question: normalizeString(item.question, ""),
        answer: normalizeString(item.answer, ""),
      };
    })
    .filter((item): item is SiteCopyFaqItem => Boolean(item && item.question));

  return normalized.length > 0 ? normalized : siteCopyDefaults.servicesFaqItems;
}

function normalizeToolCategories(
  value: unknown
): SiteCopyContent["homeToolCategories"] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.homeToolCategories;
  }

  const expectedIds = ["design", "video", "development"] as const;

  return expectedIds.map((id, index) => {
    const item = value[index];
    if (!isRecord(item)) {
      return siteCopyDefaults.homeToolCategories[index];
    }

    return {
      id,
      name: normalizeString(item.name, siteCopyDefaults.homeToolCategories[index].name),
      description: normalizeString(
        item.description,
        siteCopyDefaults.homeToolCategories[index].description
      ),
    };
  });
}

export function normalizeSiteCopyContent(value: unknown): SiteCopyContent {
  if (!isRecord(value)) {
    return siteCopyDefaults;
  }

  return {
    heroStatusLine: normalizeString(value.heroStatusLine, siteCopyDefaults.heroStatusLine),
    homeAboutHeading: normalizeString(value.homeAboutHeading, siteCopyDefaults.homeAboutHeading),
    homeAboutBody: normalizeString(value.homeAboutBody, siteCopyDefaults.homeAboutBody),
    homeAboutCtaLabel: normalizeString(value.homeAboutCtaLabel, siteCopyDefaults.homeAboutCtaLabel),
    homeToolboxHeading: normalizeString(value.homeToolboxHeading, siteCopyDefaults.homeToolboxHeading),
    homeToolboxIntro: normalizeString(value.homeToolboxIntro, siteCopyDefaults.homeToolboxIntro),
    homeToolCategories: normalizeToolCategories(value.homeToolCategories),
    homeRecentHeading: normalizeString(value.homeRecentHeading, siteCopyDefaults.homeRecentHeading),
    homeRecentIntro: normalizeString(value.homeRecentIntro, siteCopyDefaults.homeRecentIntro),
    homeRecentWebTitle: normalizeString(value.homeRecentWebTitle, siteCopyDefaults.homeRecentWebTitle),
    homeRecentWebCopy: normalizeString(value.homeRecentWebCopy, siteCopyDefaults.homeRecentWebCopy),
    homeRecentWebCtaLabel: normalizeString(
      value.homeRecentWebCtaLabel,
      siteCopyDefaults.homeRecentWebCtaLabel
    ),
    homeCreativeTitle: normalizeString(value.homeCreativeTitle, siteCopyDefaults.homeCreativeTitle),
    homeCreativeCopy: normalizeString(value.homeCreativeCopy, siteCopyDefaults.homeCreativeCopy),
    homeCreativeCtaLabel: normalizeString(
      value.homeCreativeCtaLabel,
      siteCopyDefaults.homeCreativeCtaLabel
    ),
    homeCreativeCategories: normalizeCreativeCategories(value.homeCreativeCategories),
    homeServicesHeading: normalizeString(value.homeServicesHeading, siteCopyDefaults.homeServicesHeading),
    homeServicesIntro: normalizeString(value.homeServicesIntro, siteCopyDefaults.homeServicesIntro),
    homeReviewsHeading: normalizeString(value.homeReviewsHeading, siteCopyDefaults.homeReviewsHeading),
    homeReviewsIntro: normalizeString(value.homeReviewsIntro, siteCopyDefaults.homeReviewsIntro),
    homeReviewsItems: normalizeReviewItems(value.homeReviewsItems),
    aboutStickyNote: normalizeString(value.aboutStickyNote, siteCopyDefaults.aboutStickyNote),
    aboutLowerRightNote: normalizeString(
      value.aboutLowerRightNote,
      siteCopyDefaults.aboutLowerRightNote
    ),
    aboutFooterTag: normalizeString(value.aboutFooterTag, siteCopyDefaults.aboutFooterTag),
    aboutIntroTitle: normalizeString(value.aboutIntroTitle, siteCopyDefaults.aboutIntroTitle),
    aboutIntroBody: normalizeString(value.aboutIntroBody, siteCopyDefaults.aboutIntroBody),
    aboutBookImage: normalizeString(value.aboutBookImage, siteCopyDefaults.aboutBookImage),
    aboutTimelineTitle: normalizeString(value.aboutTimelineTitle, siteCopyDefaults.aboutTimelineTitle),
    aboutTimelineEntries: normalizeTimelineEntries(value.aboutTimelineEntries),
    aboutTypewriterQuote: normalizeString(
      value.aboutTypewriterQuote,
      siteCopyDefaults.aboutTypewriterQuote
    ),
    servicesHeroTitle: normalizeString(value.servicesHeroTitle, siteCopyDefaults.servicesHeroTitle),
    servicesWhyEyebrow: normalizeString(value.servicesWhyEyebrow, siteCopyDefaults.servicesWhyEyebrow),
    servicesWhyHeading: normalizeString(value.servicesWhyHeading, siteCopyDefaults.servicesWhyHeading),
    servicesWhyIntro: normalizeString(value.servicesWhyIntro, siteCopyDefaults.servicesWhyIntro),
    servicesWhyCtaLabel: normalizeString(value.servicesWhyCtaLabel, siteCopyDefaults.servicesWhyCtaLabel),
    servicesWhyCtaUrl: normalizeString(value.servicesWhyCtaUrl, siteCopyDefaults.servicesWhyCtaUrl),
    servicesWhyFeatures: normalizeComparisonFeatures(value.servicesWhyFeatures),
    servicesFaqEyebrow: normalizeString(value.servicesFaqEyebrow, siteCopyDefaults.servicesFaqEyebrow),
    servicesFaqHeading: normalizeString(value.servicesFaqHeading, siteCopyDefaults.servicesFaqHeading),
    servicesFaqIntro: normalizeString(value.servicesFaqIntro, siteCopyDefaults.servicesFaqIntro),
    servicesFaqItems: normalizeFaqItems(value.servicesFaqItems),
    servicesFaqCtaText: normalizeString(value.servicesFaqCtaText, siteCopyDefaults.servicesFaqCtaText),
    servicesFaqCtaLabel: normalizeString(
      value.servicesFaqCtaLabel,
      siteCopyDefaults.servicesFaqCtaLabel
    ),
    contactEyebrow: normalizeString(value.contactEyebrow, siteCopyDefaults.contactEyebrow),
    contactHeading: normalizeString(value.contactHeading, siteCopyDefaults.contactHeading),
    contactSupportLine: normalizeString(
      value.contactSupportLine,
      siteCopyDefaults.contactSupportLine
    ),
    contactGiantText: normalizeString(value.contactGiantText, siteCopyDefaults.contactGiantText),
    footerBrandEyebrow: normalizeString(
      value.footerBrandEyebrow,
      siteCopyDefaults.footerBrandEyebrow
    ),
    footerSupportCopy: normalizeString(value.footerSupportCopy, siteCopyDefaults.footerSupportCopy),
    footerEmail: normalizeString(value.footerEmail, siteCopyDefaults.footerEmail),
    footerCtaHeading: normalizeString(value.footerCtaHeading, siteCopyDefaults.footerCtaHeading),
    footerCtaCopy: normalizeString(value.footerCtaCopy, siteCopyDefaults.footerCtaCopy),
    footerCopyright: normalizeString(value.footerCopyright, siteCopyDefaults.footerCopyright),
    footerCredit: normalizeString(value.footerCredit, siteCopyDefaults.footerCredit),
  };
}

export async function getSiteCopyContent(): Promise<SiteCopyContent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", SITE_COPY_CONTENT_KEY)
    .single();

  if (error || !data?.value) {
    return siteCopyDefaults;
  }

  try {
    const parsed = JSON.parse(data.value);
    return normalizeSiteCopyContent(parsed);
  } catch {
    return siteCopyDefaults;
  }
}

export async function upsertSiteCopyContent(content: SiteCopyContent) {
  const supabase = await createClient();
  await supabase
    .from("site_content")
    .upsert({ 
      key: SITE_COPY_CONTENT_KEY, 
      value: JSON.stringify(content),
      updated_at: new Date().toISOString()
    }, { onConflict: "key" });
}


