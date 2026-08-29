import { createStaticClient } from "@/utils/supabase/static";
import { createAdminClient } from "@/utils/supabase/admin";
import type { HomeContent } from "@/lib/home-content-defaults";
import { 
  type SiteCopyReviewItem,
  type SiteCopyCreativeCategory,
  type SiteCopyTimelineEntry,
  type SiteCopyComparisonFeature,
  type SiteCopyFaqItem,
  type SiteCopyContent,
  siteCopyDefaults,
  type PublicSiteShellContent,
  type SiteCopyTool
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

  const normalized = value.reduce<SiteCopyCreativeCategory[]>((items, item) => {
      if (!isRecord(item)) return items;

      const normalizedItem: SiteCopyCreativeCategory = {
        title: normalizeString(item.title, ""),
        description: normalizeString(item.description, ""),
        image: normalizeString(item.image, ""),
        lottieUrl: normalizeString(item.lottieUrl, ""),
      };
      if (normalizedItem.title) items.push(normalizedItem);
      return items;
    }, []);

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

  const normalized = value
    .map((item) => {
      if (!isRecord(item)) return null;

      return {
        id: normalizeString(item.id, ""),
        name: normalizeString(item.name, ""),
        description: normalizeString(item.description, ""),
      };
    })
    .filter((item): item is { id: string; name: string; description: string } => Boolean(item && item.id && item.name));

  return normalized.length > 0 ? normalized : siteCopyDefaults.homeToolCategories;
}

function normalizeTools(value: unknown): SiteCopyTool[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.homeTools;
  }

  const normalized = value.reduce<SiteCopyTool[]>((items, item) => {
      if (!isRecord(item)) return items;

      const normalizedItem: SiteCopyTool = {
        id: normalizeString(item.id, ""),
        name: normalizeString(item.name, ""),
        description: normalizeString(item.description, ""),
        icon: normalizeString(item.icon, ""),
        category: normalizeString(item.category, "design"),
        url: normalizeString(item.url, ""),
      };
      if (normalizedItem.id && normalizedItem.name) items.push(normalizedItem);
      return items;
    }, []);

  return normalized.length > 0 ? normalized : siteCopyDefaults.homeTools;
}

export function normalizeSiteCopyContent(value: unknown): SiteCopyContent {
  if (!isRecord(value)) {
    return siteCopyDefaults;
  }

  // Handle potential nested structure from previous save bug
  const target = isRecord(value.siteCopy) ? value.siteCopy : value;

  return {
    heroStatusLine: normalizeString(target.heroStatusLine, siteCopyDefaults.heroStatusLine),
    homeAboutHeading: normalizeString(target.homeAboutHeading, siteCopyDefaults.homeAboutHeading),
    homeAboutBody: normalizeString(target.homeAboutBody, siteCopyDefaults.homeAboutBody),
    homeAboutCtaLabel: normalizeString(target.homeAboutCtaLabel, siteCopyDefaults.homeAboutCtaLabel),
    homeAboutCtaUrl: normalizeString(target.homeAboutCtaUrl, siteCopyDefaults.homeAboutCtaUrl),
    homeToolboxHeading: normalizeString(target.homeToolboxHeading, siteCopyDefaults.homeToolboxHeading),
    homeToolboxIntro: normalizeString(target.homeToolboxIntro, siteCopyDefaults.homeToolboxIntro),
    homeToolCategories: normalizeToolCategories(target.homeToolCategories),
    homeTools: normalizeTools(target.homeTools),
    homeRecentHeading: normalizeString(target.homeRecentHeading, siteCopyDefaults.homeRecentHeading),
    homeRecentIntro: normalizeString(target.homeRecentIntro, siteCopyDefaults.homeRecentIntro),
    homeRecentWebTitle: normalizeString(target.homeRecentWebTitle, siteCopyDefaults.homeRecentWebTitle),
    homeRecentWebCopy: normalizeString(target.homeRecentWebCopy, siteCopyDefaults.homeRecentWebCopy),
    homeRecentWebCtaLabel: normalizeString(
      target.homeRecentWebCtaLabel,
      siteCopyDefaults.homeRecentWebCtaLabel
    ),
    homeRecentWebProjectIds: Array.isArray(target.homeRecentWebProjectIds) ? target.homeRecentWebProjectIds : siteCopyDefaults.homeRecentWebProjectIds,
    homeSlidingRoles: normalizeString(target.homeSlidingRoles, siteCopyDefaults.homeSlidingRoles),
    homeCreativeTitle: normalizeString(target.homeCreativeTitle, siteCopyDefaults.homeCreativeTitle),
    homeCreativeCopy: normalizeString(target.homeCreativeCopy, siteCopyDefaults.homeCreativeCopy),
    homeCreativeCtaLabel: normalizeString(
      target.homeCreativeCtaLabel,
      siteCopyDefaults.homeCreativeCtaLabel
    ),
    homeCreativeCategories: normalizeCreativeCategories(target.homeCreativeCategories),
    homeServicesHeading: normalizeString(target.homeServicesHeading, siteCopyDefaults.homeServicesHeading),
    homeServicesIntro: normalizeString(target.homeServicesIntro, siteCopyDefaults.homeServicesIntro),
    homeReviewsHeading: normalizeString(target.homeReviewsHeading, siteCopyDefaults.homeReviewsHeading),
    homeReviewsIntro: normalizeString(target.homeReviewsIntro, siteCopyDefaults.homeReviewsIntro),
    homeReviewsItems: normalizeReviewItems(target.homeReviewsItems),
    aboutStickyNote: normalizeString(target.aboutStickyNote, siteCopyDefaults.aboutStickyNote),
    aboutLowerRightNote: normalizeString(
      target.aboutLowerRightNote,
      siteCopyDefaults.aboutLowerRightNote
    ),
    aboutFooterTag: normalizeString(target.aboutFooterTag, siteCopyDefaults.aboutFooterTag),
    aboutIntroTitle: normalizeString(target.aboutIntroTitle, siteCopyDefaults.aboutIntroTitle),
    aboutIntroBody: normalizeString(target.aboutIntroBody, siteCopyDefaults.aboutIntroBody),
    aboutBookImage: normalizeString(target.aboutBookImage, siteCopyDefaults.aboutBookImage),
    aboutTimelineTitle: normalizeString(target.aboutTimelineTitle, siteCopyDefaults.aboutTimelineTitle),
    aboutTimelineEntries: normalizeTimelineEntries(target.aboutTimelineEntries),
    aboutTypewriterQuote: normalizeString(
      target.aboutTypewriterQuote,
      siteCopyDefaults.aboutTypewriterQuote
    ),
    servicesHeroTitle: normalizeString(target.servicesHeroTitle, siteCopyDefaults.servicesHeroTitle),
    servicesWhyEyebrow: normalizeString(target.servicesWhyEyebrow, siteCopyDefaults.servicesWhyEyebrow),
    servicesWhyHeading: normalizeString(target.servicesWhyHeading, siteCopyDefaults.servicesWhyHeading),
    servicesWhyIntro: normalizeString(target.servicesWhyIntro, siteCopyDefaults.servicesWhyIntro),
    servicesWhyCtaLabel: normalizeString(target.servicesWhyCtaLabel, siteCopyDefaults.servicesWhyCtaLabel),
    servicesWhyCtaUrl: normalizeString(target.servicesWhyCtaUrl, siteCopyDefaults.servicesWhyCtaUrl),
    servicesWhyFeatures: normalizeComparisonFeatures(target.servicesWhyFeatures),
    servicesFaqEyebrow: normalizeString(target.servicesFaqEyebrow, siteCopyDefaults.servicesFaqEyebrow),
    servicesFaqHeading: normalizeString(target.servicesFaqHeading, siteCopyDefaults.servicesFaqHeading),
    servicesFaqIntro: normalizeString(target.servicesFaqIntro, siteCopyDefaults.servicesFaqIntro),
    servicesFaqItems: normalizeFaqItems(target.servicesFaqItems),
    servicesFaqCtaText: normalizeString(target.servicesFaqCtaText, siteCopyDefaults.servicesFaqCtaText),
    servicesFaqCtaLabel: normalizeString(
      target.servicesFaqCtaLabel,
      siteCopyDefaults.servicesFaqCtaLabel
    ),
    contactEyebrow: normalizeString(target.contactEyebrow, siteCopyDefaults.contactEyebrow),
    contactHeading: normalizeString(target.contactHeading, siteCopyDefaults.contactHeading),
    contactSupportLine: normalizeString(
      target.contactSupportLine,
      siteCopyDefaults.contactSupportLine
    ),
    contactGiantText: normalizeString(target.contactGiantText, siteCopyDefaults.contactGiantText),
    footerBrandEyebrow: normalizeString(
      target.footerBrandEyebrow,
      siteCopyDefaults.footerBrandEyebrow
    ),
    footerSupportCopy: normalizeString(target.footerSupportCopy, siteCopyDefaults.footerSupportCopy),
    footerEmail: normalizeString(target.footerEmail, siteCopyDefaults.footerEmail),
    footerCtaHeading: normalizeString(target.footerCtaHeading, siteCopyDefaults.footerCtaHeading),
    footerCtaCopy: normalizeString(target.footerCtaCopy, siteCopyDefaults.footerCtaCopy),
    footerCopyright: normalizeString(target.footerCopyright, siteCopyDefaults.footerCopyright),
    footerCredit: normalizeString(target.footerCredit, siteCopyDefaults.footerCredit),
    footerLocation: normalizeString(target.footerLocation, siteCopyDefaults.footerLocation),
    footerLargeText: normalizeString(target.footerLargeText, siteCopyDefaults.footerLargeText),
    aboutResumeUrl: normalizeString(target.aboutResumeUrl, siteCopyDefaults.aboutResumeUrl),
    aboutDesignResumeUrl: normalizeString(target.aboutDesignResumeUrl, siteCopyDefaults.aboutDesignResumeUrl),
    navLinks: Array.isArray(target.navLinks) && target.navLinks.length > 0
      ? target.navLinks.map((item: any) => ({
          name: normalizeString(item.name, ""),
          path: normalizeString(item.path, "/"),
        })).filter((item: any) => item.name && item.path)
      : siteCopyDefaults.navLinks,
    preloaderText: normalizeString(target.preloaderText, siteCopyDefaults.preloaderText),
    homeBackgroundImage: normalizeString(target.homeBackgroundImage, siteCopyDefaults.homeBackgroundImage),
    contactBackgroundImage: normalizeString(target.contactBackgroundImage, siteCopyDefaults.contactBackgroundImage),
    contactInstagramLabel: normalizeString(target.contactInstagramLabel, siteCopyDefaults.contactInstagramLabel),
    contactLinkedinLabel: normalizeString(target.contactLinkedinLabel, siteCopyDefaults.contactLinkedinLabel),
    contactEmailLabel: normalizeString(target.contactEmailLabel, siteCopyDefaults.contactEmailLabel),
    designerResumeLabel: normalizeString(target.designerResumeLabel, siteCopyDefaults.designerResumeLabel),
    designerResumeDesc: normalizeString(target.designerResumeDesc, siteCopyDefaults.designerResumeDesc),
    developerResumeLabel: normalizeString(target.developerResumeLabel, siteCopyDefaults.developerResumeLabel),
    developerResumeDesc: normalizeString(target.developerResumeDesc, siteCopyDefaults.developerResumeDesc),
    resumeDropdownTitle: normalizeString(target.resumeDropdownTitle, siteCopyDefaults.resumeDropdownTitle),
    resumeButtonLabel: normalizeString(target.resumeButtonLabel, siteCopyDefaults.resumeButtonLabel),
    heroMobileCtaLabel: normalizeString(target.heroMobileCtaLabel, siteCopyDefaults.heroMobileCtaLabel),
    heroMobileResumeLabel: normalizeString(target.heroMobileResumeLabel, siteCopyDefaults.heroMobileResumeLabel),
    seoSiteName: normalizeString(target.seoSiteName, siteCopyDefaults.seoSiteName),
    seoDefaultTitle: normalizeString(target.seoDefaultTitle, siteCopyDefaults.seoDefaultTitle),
    seoDescription: normalizeString(target.seoDescription, siteCopyDefaults.seoDescription),
    seoTwitterHandle: normalizeString(target.seoTwitterHandle, siteCopyDefaults.seoTwitterHandle),
    seoKeywords: Array.isArray(target.seoKeywords) && target.seoKeywords.length > 0
      ? target.seoKeywords.map((k: any) => normalizeString(k, ""))
      : siteCopyDefaults.seoKeywords,
    seoOgImageAlt: normalizeString(target.seoOgImageAlt, siteCopyDefaults.seoOgImageAlt),
    seoJobTitle: normalizeString(target.seoJobTitle, siteCopyDefaults.seoJobTitle),
    seoEmployer: normalizeString(target.seoEmployer, siteCopyDefaults.seoEmployer),
    seoEducation: normalizeString(target.seoEducation, siteCopyDefaults.seoEducation),
    seoPhone: normalizeString(target.seoPhone, siteCopyDefaults.seoPhone),
    seoKnowsAbout: Array.isArray(target.seoKnowsAbout) && target.seoKnowsAbout.length > 0
      ? target.seoKnowsAbout.map((k: any) => normalizeString(k, ""))
      : siteCopyDefaults.seoKnowsAbout,
    seoKnowsLanguage: Array.isArray(target.seoKnowsLanguage) && target.seoKnowsLanguage.length > 0
      ? target.seoKnowsLanguage.map((k: any) => normalizeString(k, ""))
      : siteCopyDefaults.seoKnowsLanguage,
    seoProfileImage: normalizeString(target.seoProfileImage, siteCopyDefaults.seoProfileImage),
  };
}

export async function getSiteCopyContent(): Promise<SiteCopyContent> {
  try {
    const supabase = createStaticClient();
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
  } catch (err) {
    console.error("Failed to load site copy content, using defaults:", err);
    return siteCopyDefaults;
  }
}

export async function upsertSiteCopyContent(content: SiteCopyContent) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ 
      key: SITE_COPY_CONTENT_KEY, 
      value: JSON.stringify(content)
    }, { onConflict: "key" });

  if (error) {
    console.error("Supabase upsert error (site_copy):", error);
    throw error;
  }
}


