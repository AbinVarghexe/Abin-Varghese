import type { Metadata } from 'next';
import ServicesHero from '@/components/services/ServicesHero';
import BentoServices from '@/components/services/BentoServices';
import WhyChooseMe from '@/components/services/WhyChooseMe';
import FAQ from '@/components/services/FAQ';
import { getServicesContent } from '@/lib/services-content';
import { createPageMetadata } from '@/seo/page-metadata';

export const metadata: Metadata = createPageMetadata({
  title: "Services | Abin Varghese",
  description:
    "Explore web development, UI/UX design, mobile development, and consulting services offered by Abin Varghese.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServicesContent();

  return (
    <main className="min-h-screen bg-white relative">
      <ServicesHero />
      <div className="relative z-30">
        <BentoServices services={services} />
        <WhyChooseMe />
        <FAQ />
      </div>
    </main>
  );
}

