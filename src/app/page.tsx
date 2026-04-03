// Home Page
import type { Metadata } from "next";
import Herosection from "@/components/Herosection";
import ScrollingBanner from "@/components/ui/ScrollingBanner";
import SiteUnderDevelopment from "@/components/ui/SiteUnderDevelopment";
import CreativeToolbox from "@/components/CreativeToolbox";
import Footer from "@/components/Footer";
import BrandsSection from "@/components/BrandsSection";
import { getHeroContent, getHomeContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Abin Varghese",
  description:
    "Explore the work of Abin Varghese, a front-end developer specializing in React, Next.js, and modern UI/UX design. View projects, skills, and achievements.",
  openGraph: {
    title: "Abin Varghese",
    description:
      "Explore the work of Abin Varghese, a front-end developer specializing in React, Next.js, and modern UI/UX design.",
    url: "https://abinvarghese.me",
  },
};

export default async function Home() {
  const heroData = await getHeroContent();
  const homeData = await getHomeContent();
  
  const scrollingItems = homeData.scrollingBannerItems.split(',').map(item => item.trim()).filter(Boolean);

  return (
    <main className="min-h-screen relative">
      <Herosection data={heroData} />
      <ScrollingBanner
        items={scrollingItems}
        speed={30}
      />

      <CreativeToolbox />
      <BrandsSection />
    </main>
  );
}
