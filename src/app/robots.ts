import type { MetadataRoute } from "next";
import { siteUrl } from "@/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all crawlers on public pages
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/auth/",
          "/_next/",
          "/testing/",
        ],
      },
      // Prevent AI training scrapers from harvesting content
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "anthropic-ai",
        disallow: ["/"],
      },
      {
        userAgent: "Claude-Web",
        disallow: ["/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
