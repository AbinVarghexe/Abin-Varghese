import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import { getServiceBySlug } from '@/lib/services-content';
import { createPageMetadata } from '@/seo/page-metadata';
import { BreadcrumbSchema, ServiceSchema } from '@/seo/schema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
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
    type: "article",
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.id}` },
        ]}
      />
      <ServiceSchema
        name={service.title}
        description={service.description}
        path={`/services/${service.id}`}
        serviceType={service.providedServices}
      />
      <ServicePageLayout service={service} />
    </main>
  );
}
