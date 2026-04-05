"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MouseTrail from "@/components/ui/MouseTrail";
import { MobileNav } from "@/components/common/MobileNav";
import { MobileDock } from "@/components/common/MobileDock";
import Preloader from "@/components/Preloader";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { PreviewProvider } from "@/lib/contexts/PreviewContext";

const Hero3DLayer = dynamic(() => import("@/components/ui/Hero3DLayer"), {
  ssr: false,
});
const JarvisAssistant = dynamic(() => import("@/components/ui/JarvisAssistant"), {
  ssr: false,
});

const FONT = {
  A: [[0, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1]],
  B: [[1, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 0]],
  I: [[1, 1, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [1, 1, 1]],
  N: [[1, 0, 0, 0, 1], [1, 1, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 1, 1], [1, 0, 0, 0, 1]],
  V: [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0]],
  R: [[1, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 0], [1, 0, 1, 0], [1, 0, 0, 1]],
  G: [[0, 1, 1, 1], [1, 0, 0, 0], [1, 0, 1, 1], [1, 0, 0, 1], [0, 1, 1, 1]],
  H: [[1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1]],
  E: [[1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [1, 1, 1, 1]],
  S: [[0, 1, 1, 1], [1, 0, 0, 0], [0, 1, 1, 0], [0, 0, 0, 1], [1, 1, 1, 0]],
  " ": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
} as const;

const consoleMetaStyle = [
  "font-family: Menlo, Monaco, Consolas, 'Courier New', monospace",
  "font-size: 14px",
  "line-height: 1.35",
  "color: #f3f4f6",
].join(";");

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 5000], [0, -200]);

  useEffect(() => {
    if (isAdminPath) {
      return;
    }

    const cellStyle = (background: string) => [
      `background: ${background}`,
      "padding: 1px 3px",
      "margin: 1px 0",
    ].join(";");

    const spacerStyle = "background: transparent; padding: 1px 1px;";

    const getPixelWidth = (text: string) => {
      return text
        .toUpperCase()
        .split("")
        .reduce((width, char) => width + (FONT[char as keyof typeof FONT] ?? FONT[" "])[0].length + 1, 0);
    };

    const appendCells = (count: number, style: string, formatParts: string[], styles: string[]) => {
      for (let index = 0; index < count; index += 1) {
        formatParts.push("%c  ");
        styles.push(style);
      }
    };

    const buildPixelLine = (text: string, color: string, targetWidth: number) => {
      let format = "";
      const styles: string[] = [];
      const chars = text.toUpperCase().split("");
      const textWidth = getPixelWidth(text);
      const horizontalPadding = Math.max(0, targetWidth - textWidth);
      const rightPadding = horizontalPadding;

      for (let row = 0; row < 5; row += 1) {
        const rowFormatParts: string[] = [];

        for (const char of chars) {
          const bitmap = FONT[char as keyof typeof FONT] ?? FONT[" "];

          for (const cell of bitmap[row]) {
            rowFormatParts.push("%c  ");
            styles.push([
              `background: ${cell ? color : "transparent"}`,
              "padding: 1px 3px",
              "margin: 1px 0",
            ].join(";"));
          }

          rowFormatParts.push("%c  ");
          styles.push(spacerStyle);
        }

        appendCells(rightPadding, spacerStyle, rowFormatParts, styles);
        format += `${rowFormatParts.join("")}\n`;
      }

      return { format, styles };
    };

    const printAll = (...lines: Array<{ text: string; color: string }>) => {
      let finalFormat = "";
      const finalStyles: string[] = [];
      const targetWidth = Math.max(...lines.map(({ text }) => getPixelWidth(text)));

      for (const { text, color } of lines) {
        const { format, styles } = buildPixelLine(text, color, targetWidth);
        finalFormat += `${format}\n`;
        finalStyles.push(...styles);
      }

      console.log(finalFormat, ...finalStyles);
    };

    const printConsoleBanner = () => {
      const pageName = pathname === "/" ? "home" : pathname.replace("/", "") || "home";

      console.log("%cStarting initial load...", consoleMetaStyle);
      console.log("%cStarting basic initialization...", consoleMetaStyle);
      console.log(`%cInitializing page: ${pageName}`, consoleMetaStyle);
      console.log("%cPage enter started", consoleMetaStyle);
      console.log("%cPage enter completed", consoleMetaStyle);
      console.log("%c ", consoleMetaStyle);
      printAll(
        { text: "ABIN", color: "#0020d7" },
        { text: "VARGHESE", color: "#ffffff" }
      );
      console.log("%c ", consoleMetaStyle);
      console.log("%cresize issue prevention", consoleMetaStyle);
    };

    if (document.readyState === "complete") {
      requestAnimationFrame(printConsoleBanner);
      return;
    }

    window.addEventListener("load", printConsoleBanner, { once: true });

    return () => {
      window.removeEventListener("load", printConsoleBanner);
    };
  }, [isAdminPath, pathname, isAdminPath]);

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <>
      <Preloader />
      <MouseTrail baseThickness={4} enableCustomCursor={true} enableFade={true} />
      
      {/* ── Global Neural Stage (3-Layer Architecture) ────────── */}
      {pathname === "/" && (
        <>
          {/* Layer 1: Global Atmospheric BG (z-0) */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute inset-0 w-full h-[120%]"
              style={{
                y
              }}
            >
              <Image
                src="/Home/cloud.jpg"
                alt="Atmospheric background"
                fill
                priority
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-b from-white/20 via-transparent to-white/20" />
            </motion.div>
          </div>

          {/* Layer 2: 3D Interaction Layer (z-10) */}
          <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden h-screen w-screen">
            <JarvisAssistant />
            <div className="hidden lg:block h-full w-full">
              <Hero3DLayer />
            </div>
          </div>
        </>
      )}

      <div className="hidden md:block select-none">
        <Navbar />
      </div>
      <div className="block md:hidden select-none">
        <MobileNav />
        <MobileDock />
      </div>
      
      <PreviewProvider>
        <main className="relative w-full">
          {children}
        </main>
      </PreviewProvider>
      
      <Footer />
    </>
  );
}
