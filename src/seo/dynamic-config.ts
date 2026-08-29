import { getSiteCopyContent } from "@/lib/site-copy-content";
import { siteCopyDefaults } from "@/types/site-copy";

export async function getSeoConfig() {
  const siteCopy = await getSiteCopyContent();
  return {
    name: siteCopy.seoSiteName.replace(" Portfolio", "").trim(),
    siteName: siteCopy.seoSiteName,
    defaultTitle: siteCopy.seoDefaultTitle,
    description: siteCopy.seoDescription,
    locale: "en_IN",
    creator: siteCopy.seoSiteName.replace(" Portfolio", "").trim(),
    twitterHandle: siteCopy.seoTwitterHandle,
    keywords: siteCopy.seoKeywords,
    ogImageAlt: siteCopy.seoOgImageAlt,
    jobTitle: siteCopy.seoJobTitle,
    employer: siteCopy.seoEmployer,
    education: siteCopy.seoEducation,
    phone: siteCopy.seoPhone,
    knowsAbout: siteCopy.seoKnowsAbout,
    knowsLanguage: siteCopy.seoKnowsLanguage,
    profileImage: siteCopy.seoProfileImage,
    navLinks: siteCopy.navLinks,
  };
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = (
  configuredSiteUrl && configuredSiteUrl.length > 0
    ? configuredSiteUrl
    : "https://abinvarghese.app"
).replace(/\/+$/, "");

export const getAbsoluteUrl = (path = "/") => {
  return new URL(path.startsWith("/") ? path : `/${path}`, siteUrl).toString();
};
