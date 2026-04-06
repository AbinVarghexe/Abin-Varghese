import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceById, services } from '@/constants/services';
import ServicePageLayout from '@/components/services/ServicePageLayout';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceById(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Abin Varghese',
    };
  }

  return {
    title: `${service.title} | Professional Services | Abin Varghese`,
    description: service.description,
    openGraph: {
      title: `${service.title} | Abin Varghese`,
      description: service.description,
      url: `https://abinvarghese.me/services/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.id,
  }));
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceById(slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <ServicePageLayout service={service} />
    </main>
  );
}
