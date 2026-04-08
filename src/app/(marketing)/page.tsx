// Home Page
import type { Metadata } from "next";
import Herosection from "@/components/home/Herosection";
import ScrollingBanner from "@/components/ui/ScrollingBanner";
import CreativeToolbox from "@/components/home/CreativeToolbox";
import BrandsSection from "@/components/home/BrandsSection";
import AboutSection from "@/components/home/AboutSection";
import RecentProjects from "@/components/home/RecentProjects";
import ServicesSection from "@/components/services/ServicesSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import SlidingRoleBanner from "@/components/ui/SlidingRoleBanner";
import { getHeroContent, getHomeContent } from "@/lib/site-content";
import { homePageContentClass, homePageShellClass } from "@/lib/home-page-design-system";
import { createPageMetadata } from "@/seo/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Abin Varghese",
  description:
    "Explore the work of Abin Varghese, a front-end developer specializing in React, Next.js, and modern UI/UX design. View projects, skills, and achievements.",
  path: "/",
  keywords: [
    "Abin Varghese portfolio",
    "Next.js developer portfolio",
    "React front-end developer",
    "UI UX designer portfolio",
  ],
});

export default async function Home() {
  const heroData = await getHeroContent();
  const homeData = await getHomeContent();

  const scrollingItems = homeData.scrollingBannerItems
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <main className={homePageShellClass("relative")}>
      <Herosection
        data={heroData}
        homeLinks={{
          socialLinks: homeData.socialLinks,
          pageLinks: homeData.pageLinks,
        }}
      />

      <div className="relative w-full overflow-hidden">
        {/* ── Vertical Grid Background Layer (z-0) ────────── */}
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
        
        {/* All content below the hero section (Content Layer z-20) */}
        <div className={homePageContentClass("z-20")}>
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
