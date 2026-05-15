import type { Metadata } from "next";
import { Poppins, Dancing_Script, Lora } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { PersonSchema, WebSiteSchema } from "@/seo/schema";
import { metadata as seoMetadata, viewport } from "@/seo/metadata";
import { getSiteCopyContent } from "@/lib/site-copy-content";
import { Toaster } from "sonner";
import ClientLayoutWrapper from "@/components/common/ClientLayoutWrapper";
import { Analytics } from "@vercel/analytics/next";

// ── Typography ────────────────────────────────────────────────────
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

const vina = localFont({
  src: "../../public/fonts/vina.ttf",
  variable: "--font-vina",
  display: "swap",
  preload: false,
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  preload: false,
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = seoMetadata;
export { viewport };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteCopy = await getSiteCopyContent();
  const name = siteCopy.seoSiteName.replace(" Portfolio", "").trim();

  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://opengraph.githubassets.com" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://static.vecteezy.com" />

        <link rel="icon" href="/Logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/Logo.svg" />
        <link rel="apple-touch-icon" href="/Logo.svg" />
      </head>
      <body
        className={`${poppins.variable} ${vina.variable} ${dancingScript.variable} ${lora.variable} antialiased select-none`}
      >
        <WebSiteSchema
          name={siteCopy.seoSiteName}
          alternateName={[name, "Abin Varghese Dev"]}
          description={siteCopy.seoDescription}
        />
        <PersonSchema
          name={name}
          jobTitle={siteCopy.seoJobTitle}
          description={siteCopy.seoDescription}
          employer={siteCopy.seoEmployer}
          education={siteCopy.seoEducation}
          phone={siteCopy.seoPhone}
          email={siteCopy.footerEmail}
          knowsAbout={siteCopy.seoKnowsAbout}
          knowsLanguage={siteCopy.seoKnowsLanguage}
          profileImage={siteCopy.seoProfileImage}
          socialProfiles={[
            "https://www.linkedin.com/in/toabinvarghese",
            "https://github.com/AbinVarghexe",
            "https://www.behance.net/toabinvarghese",
          ]}
        />
        <Toaster position="top-right" richColors closeButton />

        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        <Analytics />
      </body>
    </html>
  );
}
