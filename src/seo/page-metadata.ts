import type { Metadata } from "next";
import { defaultOgImage, getAbsoluteUrl, siteConfig } from "@/seo/config";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  images?: string[];
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
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
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.twitterHandle,
      images: resolvedImages,
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
