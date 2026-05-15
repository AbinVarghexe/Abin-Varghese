import { getAbsoluteUrl, siteUrl } from "@/seo/config";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type PersonSchemaProps = {
  name: string;
  jobTitle: string;
  description: string;
  employer: string;
  education: string;
  phone: string;
  email: string;
  knowsAbout: string[];
  knowsLanguage: string[];
  profileImage: string;
  socialProfiles: string[];
};

export function PersonSchema({
  name,
  jobTitle,
  description,
  employer,
  education,
  phone,
  email,
  knowsAbout,
  knowsLanguage,
  profileImage,
  socialProfiles,
}: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: siteUrl,
    sameAs: socialProfiles,
    jobTitle,
    description,
    worksFor: {
      "@type": "Organization",
      name: employer,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education,
      address: {
        "@type": "PostalAddress",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    knowsAbout,
    knowsLanguage,
    email: `mailto:${email}`,
    telephone: phone,
    image: {
      "@type": "ImageObject",
      url: getAbsoluteUrl(profileImage),
      contentUrl: getAbsoluteUrl(profileImage),
      description: `Portrait of ${name}`,
    },
    mainEntityOfPage: siteUrl,
  };

  return <JsonLd data={schema} />;
}

type WebSiteSchemaProps = {
  name: string;
  alternateName: string[];
  description: string;
};

export function WebSiteSchema({ name, alternateName, description }: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    alternateName,
    url: siteUrl,
    description,
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Person",
      name,
      url: siteUrl,
    },
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
  providerName: string;
};

export function ServiceSchema({ name, description, path, serviceType, providerName }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Person",
      name: providerName,
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    url: getAbsoluteUrl(path),
    serviceType,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
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
  creatorName: string;
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
  creatorName,
}: SoftwareProjectSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name,
    description,
    url: getAbsoluteUrl(path),
    codeRepository,
    image: image
      ? {
          "@type": "ImageObject",
          url: image.startsWith("/") ? getAbsoluteUrl(image) : image,
          description: `${name} project preview`,
        }
      : undefined,
    dateModified,
    programmingLanguage: {
      "@type": "ComputerLanguage",
      name: keywords?.[0] ?? "JavaScript",
    },
    keywords: keywords?.join(", "),
    creator: {
      "@type": "Person",
      name: creatorName,
      url: siteUrl,
    },
    license: "https://opensource.org/licenses/MIT",
    ...(liveUrl
      ? {
          targetProduct: {
            "@type": "WebApplication",
            name,
            url: liveUrl,
            applicationCategory: "DeveloperApplication",
          },
        }
      : {}),
  };

  return <JsonLd data={schema} />;
}
