import type { Metadata, Viewport } from "next";
import { defaultOgImage, siteConfig, siteUrl } from "@/seo/config";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // NOTE: userScalable:false is an accessibility violation (WCAG 1.4.4)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | Abin Varghese`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.siteName,
  manifest: "/manifest.json",
  keywords: [
    // Primary identity keywords
    "Abin Varghese",
    "Abin Varghese portfolio",
    "Front-End Developer",
    "UI/UX Designer",
    // Technology keywords
    "Next.js Developer",
    "React Developer",
    "Tailwind CSS Developer",
    "Figma Designer",
    "TypeScript Developer",
    // Location-based keywords
    "Web Developer India",
    "Front-End Developer Kerala",
    "Web Developer Kottayam",
    "Freelance Web Developer India",
    // Intent keywords
    "UI/UX Designer Portfolio",
    "Next.js Developer Portfolio",
    "React Developer Portfolio",
    "Hire Front-End Developer India",
    "Web Design Services Kerala",
    // Achievement keywords
    "Smart India Hackathon",
    "Amal Jyothi College of Engineering",
  ],
  authors: [{ name: siteConfig.creator, url: siteUrl }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  category: "portfolio",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  icons: {
    icon: [
      { url: "/Logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/Logo.svg",
    apple: [{ url: "/Logo.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.siteName,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Abin Varghese — Front-End Developer & UI/UX Designer",
        type: "image/jpeg",
      },
    ],
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: defaultOgImage,
        alt: "Abin Varghese — Front-End Developer & UI/UX Designer",
      },
    ],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: googleSiteVerification
    ? { google: googleSiteVerification }
    : undefined,
  other: {
    // AI-crawlers — explicit allow
    "Googlebot-News": "noindex",
    "X-Robots-Tag": "index, follow",
  },
};
