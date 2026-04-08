import type { Metadata } from "next";
import { Poppins, Dancing_Script, Lora } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { PersonSchema, WebSiteSchema } from "@/seo/schema";
import { metadata as seoMetadata, viewport } from "@/seo/metadata";
import ClientLayoutWrapper from "@/components/common/ClientLayoutWrapper";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const vina = localFont({
  src: "../../public/fonts/vina.ttf",
  variable: "--font-vina",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = seoMetadata;
export { viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${vina.variable} ${dancingScript.variable} ${lora.variable} antialiased select-none`}
      >
        <WebSiteSchema />
        <PersonSchema />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem("theme");
                if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
