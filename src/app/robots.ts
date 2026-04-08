import type { MetadataRoute } from "next";
import { getAbsoluteUrl, siteUrl } from "@/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: getAbsoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
