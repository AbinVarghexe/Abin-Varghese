import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import { getServiceBySlug, getServicesContent } from '@/lib/services-content';
import { getBehanceShowcaseEmbeds } from '@/lib/site-content';
import { createPageMetadata } from '@/seo/page-metadata';
import { BreadcrumbSchema, ServiceSchema } from '@/seo/schema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // Re-validate cached pages every hour

export async function generateStaticParams() {
  try {
    const services = await getServicesContent();
    return services.map((service) => ({ slug: service.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return createPageMetadata({
      title: 'Service Not Found | Abin Varghese',
      description: 'The requested service could not be found.',
      path: '/services',
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${service.title} | Professional Services | Abin Varghese`,
    description: service.description,
    path: `/services/${slug}`,
    keywords: service.providedServices,
    type: 'article',
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const behanceShowcaseEmbeds =
    slug === 'graphics-design' ? await getBehanceShowcaseEmbeds() : undefined;

  return (
    <main>
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path: `/services/${service.id}` },
        ]}
      />
      <ServiceSchema
        name={service.title}
        description={service.description}
        path={`/services/${service.id}`}
        serviceType={service.providedServices}
      />
      <ServicePageLayout service={service} behanceShowcaseEmbeds={behanceShowcaseEmbeds} />
    </main>
  );
}
