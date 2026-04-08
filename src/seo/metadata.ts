import type { Metadata, Viewport } from "next";
import { defaultOgImage, siteConfig, siteUrl } from "@/seo/config";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0020d7",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  applicationName: siteConfig.siteName,
  manifest: "/manifest.json",
  keywords: [
    "Abin Varghese",
    "Front-End Developer",
    "UI/UX Designer",
    "Next.js Developer",
    "React Developer",
    "Web Developer India",
    "Figma Designer",
    "Tailwind CSS",
    "Smart India Hackathon",
    "Freelance Web Developer",
    "Front-End Developer Kerala",
    "UI/UX Designer Portfolio",
    "Next.js Developer Portfolio",
    "Freelance Web Developer India",
    "Tailwind CSS Developer",
    "Figma UI Designer",
    "React Developer",
    "Web Designer",
  ],
  authors: [{ name: siteConfig.creator, url: siteUrl }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  category: "portfolio",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.siteName,
    images: [
      {
        url: defaultOgImage,
        alt: "Abin Varghese portrait",
      },
    ],
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [defaultOgImage],
    creator: siteConfig.twitterHandle,
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
    ? {
        google: googleSiteVerification,
      }
    : undefined,
};

