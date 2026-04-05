// Home Page
import type { Metadata } from "next";
import Herosection from "@/components/Herosection";
import ScrollingBanner from "@/components/ui/ScrollingBanner";
import SiteUnderDevelopment from "@/components/ui/SiteUnderDevelopment";
import CreativeToolbox from "@/components/CreativeToolbox";
import Footer from "@/components/Footer";
import BrandsSection from "@/components/BrandsSection";
import AboutSection from "@/components/AboutSection";
import RecentProjects from "@/components/RecentProjects";
import ServicesSection from "@/components/services/ServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import SlidingRoleBanner from "@/components/ui/SlidingRoleBanner";
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

      <div className="relative w-full z-0 overflow-hidden">
        {/* ── Vertical Grid Background Layer ────────────────── */}
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.12) 1px, transparent 1px)',
            backgroundSize: '100px 100%',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent), linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskComposite: 'destination-in',
            maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent), linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            maskComposite: 'intersect'
          }} 
        />
        
        {/* All content below the hero section */}
        <div className="relative z-10">
          <ScrollingBanner
            items={scrollingItems}
            speed={30}
          />

          <CreativeToolbox />
          <BrandsSection logos={homeData.scrollingLogos} />

          {/* Sliding role banner — section separator between Brands and About Me */}
          <SlidingRoleBanner direction="left" rotation={5.52} className="mt-16" />

          {/* About Me Section */}
          <AboutSection />

          {/* Sliding role banner — section separator below About Me */}
          <SlidingRoleBanner direction="right" rotation={-4.88} />

          <RecentProjects />
          <ServicesSection />
          <ReviewsSection />
        </div>
      </div>
    </main>
  );
}
