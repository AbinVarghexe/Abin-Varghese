import { getAbsoluteUrl, siteConfig, siteUrl } from "@/seo/config";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }}
    />
  );
}

export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteUrl,
    sameAs: [
      "https://www.linkedin.com/in/toabinvarghese",
      "https://github.com/AbinVarghexe",
      "https://www.behance.net/toabinvarghese",
    ],
    jobTitle: "Front-End Developer & UI/UX Designer",
    worksFor: {
      "@type": "Organization",
      name: "INCIAL",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Amal Jyothi College of Engineering",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "UI/UX Design",
      "Figma",
      "JavaScript",
      "Python",
      "Hugging Face Models",
    ],
    email: "mailto:toabinvarghese@gmail.com",
    telephone: "+916282824259",
    image: getAbsoluteUrl("/profile.jpg"),
  };

  return <JsonLd data={schema} />;
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    alternateName: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    inLanguage: "en-IN",
  };

  return <JsonLd data={schema} />;
}

type BreadcrumbSchemaProps = {
  items: Array<{
    name: string;
    path: string;
  }>;
};

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };

  return <JsonLd data={schema} />;
}

type ServiceSchemaProps = {
  name: string;
  description: string;
  path: string;
  serviceType: string[];
};

export function ServiceSchema({ name, description, path, serviceType }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteUrl,
    },
    areaServed: "Worldwide",
    url: getAbsoluteUrl(path),
    serviceType,
  };

  return <JsonLd data={schema} />;
}

type SoftwareProjectSchemaProps = {
  name: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  codeRepository: string;
  liveUrl?: string | null;
  dateModified?: string;
};

export function SoftwareProjectSchema({
  name,
  description,
  path,
  image,
  keywords,
  codeRepository,
  liveUrl,
  dateModified,
}: SoftwareProjectSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name,
    description,
    url: getAbsoluteUrl(path),
    codeRepository,
    image: image ? (image.startsWith("/") ? getAbsoluteUrl(image) : image) : undefined,
    dateModified,
    programmingLanguage: keywords?.[0],
    keywords: keywords?.join(", "),
    creator: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteUrl,
    },
    ...(liveUrl
      ? {
          targetProduct: {
            "@type": "WebApplication",
            name,
            url: liveUrl,
          },
        }
      : {}),
  };

  return <JsonLd data={schema} />;
}

