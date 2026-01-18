// Home Page
import type { Metadata } from 'next';
import Herosection from '@/components/Herosection';
import ScrollingBanner from '@/components/ui/ScrollingBanner';
import SiteUnderDevelopment from '@/components/ui/SiteUnderDevelopment';
import CreativeToolbox from '@/components/CreativeToolbox';
import Footer from '@/components/Footer';

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

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Hero section with overlapping scrolling banner */}
      <div className="relative">
        <Herosection />

        {/* Scrolling Banner - overlaps at bottom of hero grid */}
        <ScrollingBanner
          items={[
            'Web Developer',
            'Graphic Designer',
            'Video Editor',
            'VFX Artist',
          ]}
          speed={30}
        />
      </div>

      <CreativeToolbox />
    </main>
  );
}
