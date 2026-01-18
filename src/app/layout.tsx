import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MouseTrail from "@/components/ui/MouseTrail";
import { MobileNav } from "@/components/common/MobileNav";
import { MobileDock } from "@/components/common/MobileDock";
import { PersonSchema } from "@/seo/schema";
import { metadata as seoMetadata, viewport } from "@/seo/metadata";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const vina = localFont({
  src: "../../public/fonts/vina.ttf",
  variable: "--font-vina",
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
        className={`${poppins.variable} ${vina.variable} antialiased`}
      >
        <PersonSchema />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {/* WebGL mouse trail with custom Figma-like cursor */}
        <MouseTrail
          baseThickness={4}
          enableCustomCursor={true}
          enableFade={true}
        />
        {/* Desktop Navigation - Hidden on mobile (< md breakpoint) */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        {/* Mobile Navigation - Hidden on desktop (>= md breakpoint) */}
        <div className="block md:hidden">
          <MobileNav />
          <MobileDock />
        </div>
        <div className="">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
