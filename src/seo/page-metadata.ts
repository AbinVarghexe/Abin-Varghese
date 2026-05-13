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
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = getAbsoluteUrl(canonicalPath);

  const resolvedImages = (images && images.length > 0 ? images : [image ?? defaultOgImage]).map(
    normalizeImageUrl
  );

  return {
    title,
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
      title,
      description,
      url,
      siteName: siteConfig.siteName,
      locale: siteConfig.locale,
      type,
      images: resolvedImages.map((resolvedImage) => ({
        url: resolvedImage,
        width: 1200,
        height: 630,
        alt: title,
      })),
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: [siteUrl],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
      images: resolvedImages.map((resolvedImage) => ({
        url: resolvedImage,
        alt: title,
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
