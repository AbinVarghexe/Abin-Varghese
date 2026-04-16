import React from "react";
import ProjectGallerySection from "@/components/projects/ProjectGallerySection";
import { homePageShellClass, homePageContentClass } from "@/lib/home-page-design-system";

export const metadata = {
  title: "Our Recent Projects | Portfolio Gallery",
  description: "A premium project gallery collection based on Shadcn Studio Portfolio-03.",
};

/**
 * Testing page for the Portfolio-03 design variant.
 * Located at /testing/page2
 */
export default function PortfolioPage2() {
  return (
    <main className={homePageShellClass("min-h-screen bg-white")}>
      <div className={homePageContentClass()}>
        <ProjectGallerySection />
      </div>
    </main>
  );
}
