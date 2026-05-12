import type { Metadata } from "next";
import { defaultOgImage, getAbsoluteUrl, siteConfig, siteUrl } from "@/seo/config";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  images?: string[];
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
  /** ISO date string for article published date */
  publishedTime?: string;
  /** ISO date string for article modified date */
  modifiedTime?: string;
};

function normalizeImageUrl(url: string) {
  return url.startsWith("/") ? getAbsoluteUrl(url) : url;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Removes brand suffix/prefix patterns so we don't end up with
 * e.g. "Services | Abin Varghese | Abin Varghese" via the root title template.
 */
function normalizePageTitle(rawTitle: string) {
  const original = rawTitle.trim();
  if (!original) return original;

  const brand = siteConfig.name?.trim();
  if (!brand) return original;

  const brandRe = escapeRegExp(brand);
  const sep = "(?:\\||-|–|—)";

  // Remove brand at the ends only (keeps cases where name is part of the actual phrase).
  let title = original
    .replace(new RegExp(`\\s*${sep}\\s*${brandRe}\\s*$`, "i"), "")
    .replace(new RegExp(`^${brandRe}\\s*${sep}\\s*`, "i"), "")
    .trim();

  // Collapse accidental double-separators after other edits.
  title = title.replace(new RegExp(`\\s*${sep}\\s*${sep}\\s*`, "g"), " | ");

  return title.length > 0 ? title : original;
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
  images,
  keywords,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const normalizedTitle = normalizePageTitle(title);
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = getAbsoluteUrl(canonicalPath);

  const resolvedImages = (images && images.length > 0 ? images : [image ?? defaultOgImage]).map(
    normalizeImageUrl
  );

  return {
    title: normalizedTitle,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "en-IN": canonicalPath,
        "x-default": canonicalPath,
      },
    },
    openGraph: {
      title: normalizedTitle,
      description,
      url,
      siteName: siteConfig.siteName,
      locale: siteConfig.locale,
      type,
      images: resolvedImages.map((resolvedImage) => ({
        url: resolvedImage,
        width: 1200,
        height: 630,
        alt: normalizedTitle,
      })),
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: [siteUrl],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: normalizedTitle,
      description,
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
      images: resolvedImages.map((resolvedImage) => ({
        url: resolvedImage,
        alt: normalizedTitle,
      })),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : undefined,
  };
}
