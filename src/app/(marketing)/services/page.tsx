import type { Metadata } from 'next';
import ServicesHero from '@/components/services/ServicesHero';
import BentoServices from '@/components/services/BentoServices';
import WhyChooseMe from '@/components/services/WhyChooseMe';
import FAQ from '@/components/services/FAQ';
import { getServicesContent } from '@/lib/services-content';
import { getSiteCopyContent } from '@/lib/site-copy-content';
import { createPageMetadata } from '@/seo/page-metadata';

export const metadata: Metadata = createPageMetadata({
  title: "Services | Abin Varghese",
  description:
    "Hire Abin Varghese for web development, UI/UX design, React & Next.js development, and mobile-first consulting. Premium digital services for startups and agencies.",
  path: "/services",
  keywords: [
    "Hire web developer India",
    "Freelance UI/UX designer",
    "Next.js development services",
    "React web development India",
    "Web design services Kerala",
    "Frontend development consulting",
    "Mobile-first web development",
    "Figma to code services",
  ],
});

export default async function ServicesPage() {
  const services = await getServicesContent();
  const siteCopy = await getSiteCopyContent();

  return (
    <main className="min-h-screen bg-white relative">
      <ServicesHero title={siteCopy.servicesHeroTitle} />
      <div className="relative z-30">
        <BentoServices services={services} />
        <WhyChooseMe
          eyebrow={siteCopy.servicesWhyEyebrow}
          heading={siteCopy.servicesWhyHeading}
          intro={siteCopy.servicesWhyIntro}
          ctaLabel={siteCopy.servicesWhyCtaLabel}
          ctaUrl={siteCopy.servicesWhyCtaUrl}
          features={siteCopy.servicesWhyFeatures}
        />
        <FAQ
          eyebrow={siteCopy.servicesFaqEyebrow}
          heading={siteCopy.servicesFaqHeading}
          intro={siteCopy.servicesFaqIntro}
          items={siteCopy.servicesFaqItems}
          ctaText={siteCopy.servicesFaqCtaText}
          ctaLabel={siteCopy.servicesFaqCtaLabel}
        />
      </div>
    </main>
  );
}

