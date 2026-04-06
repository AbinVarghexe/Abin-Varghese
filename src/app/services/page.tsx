import type { Metadata } from 'next';
import ServicesHero from '@/components/services/ServicesHero';
import BentoServices from '@/components/services/BentoServices';
import WhyChooseMe from '@/components/services/WhyChooseMe';
import FAQ from '@/components/services/FAQ';

export const metadata: Metadata = {
  title: "Services | Abin Varghese",
  description:
    "Explore web development, UI/UX design, mobile development, and consulting services offered by Abin Varghese.",
  openGraph: {
    title: "Services | Abin Varghese",
    description:
      "Explore web development, UI/UX design, mobile development, and consulting services.",
    url: "https://abinvarghese.me/services",
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white relative">
      <ServicesHero />
      <div className="relative z-30">
        <BentoServices />
        <WhyChooseMe />
        <FAQ />
      </div>
    </main>
  );
}

