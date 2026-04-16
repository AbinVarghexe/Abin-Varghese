import React from "react";
import PortfolioHighlightsSection from "@/components/projects/PortfolioHighlightsSection";
import { homePageShellClass, homePageContentClass } from "@/lib/home-page-design-system";

export const metadata = {
  title: "Portfolio highlights | Testing",
  description: "A selection of projects highlighting creativity and problem-solving.",
};

export default function TestingPage() {
  return (
    <main className={homePageShellClass("min-h-screen mb-24")}>
      <div className={homePageContentClass()}>
        <PortfolioHighlightsSection />
      </div>
    </main>
  );
}
