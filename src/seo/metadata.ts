import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0020d7",
};

export const metadata: Metadata = {
  title: "Abin Varghese",
  description:
    "Portfolio of Abin Varghese, a passionate Front-End Developer and UI/UX Designer skilled in React, Next.js, Tailwind CSS, and Figma. Explore projects, design work, and achievements.",
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
  authors: [{ name: "Abin Varghese", url: "https://abinvarghese.me" }],
  creator: "Abin Varghese",
  publisher: "Abin Varghese",
  metadataBase: new URL("https://abinvarghese.me"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
  openGraph: {
    title: "Abin Varghese | Front-End Developer & UI/UX Designer",
    description:
      "Explore the portfolio of Abin Varghese — front-end developer and designer skilled in React, Next.js, and UI/UX design.",
    url: "https://abinvarghese.me",
    siteName: "Abin Varghese Portfolio",
    images: [
      {
        url: "https://abinvarghese.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abin Varghese Portfolio Preview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abin Varghese | Front-End Developer & UI/UX Designer",
    description:
      "Explore the portfolio of Abin Varghese — front-end developer and designer skilled in React, Next.js, and UI/UX design.",
    images: ["https://abinvarghese.me/og-image.png"],
    creator: "@abin_varghese",
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
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
};

