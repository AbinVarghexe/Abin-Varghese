import type { Metadata } from "next";
import { Poppins, Dancing_Script, Lora } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { PersonSchema, WebSiteSchema } from "@/seo/schema";
import { metadata as seoMetadata, viewport } from "@/seo/metadata";
import { Toaster } from "sonner";
import ClientLayoutWrapper from "@/components/common/ClientLayoutWrapper";

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
  preload: false, // decorative — defer load
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: false, // used sparingly — defer load
});

export const metadata: Metadata = seoMetadata;
export { viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        {/* ── DNS prefetch + preconnect for external resources ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://opengraph.githubassets.com" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://static.vecteezy.com" />

        {/* ── Favicon set ───────────────────────────────────────── */}
        <link rel="icon" href="/Logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/Logo.svg" />
        <link rel="apple-touch-icon" href="/Logo.svg" />

        {/* ── Canonical: handled per-page via metadata API ───────── */}
      </head>
      <body
        className={`${poppins.variable} ${vina.variable} ${dancingScript.variable} ${lora.variable} antialiased select-none`}
      >
        {/* Structured data injected at root for all pages */}
        <WebSiteSchema />
        <PersonSchema />

        <Toaster position="top-right" richColors closeButton />

        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
