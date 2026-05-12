import { getAbsoluteUrl, siteConfig, siteUrl } from "@/seo/config";

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

export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteUrl,
    sameAs: siteConfig.socialProfiles,
    jobTitle: "Front-End Developer & UI/UX Designer",
    description: siteConfig.description,
    worksFor: {
      "@type": "Organization",
      name: "INCIAL",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Amal Jyothi College of Engineering",
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
    knowsAbout: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "UI/UX Design",
      "Figma",
      "JavaScript",
      "TypeScript",
      "Python",
      "Framer Motion",
      "Hugging Face Models",
    ],
    knowsLanguage: ["en", "ml"],
    email: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "toabinvarghese@gmail.com"}`,
    telephone: "+916282824259",
    image: {
      "@type": "ImageObject",
      url: getAbsoluteUrl("/profile.jpg"),
      contentUrl: getAbsoluteUrl("/profile.jpg"),
      description: "Portrait of Abin Varghese, Front-End Developer",
    },
    mainEntityOfPage: siteUrl,
  };

  return <JsonLd data={schema} />;
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    alternateName: [siteConfig.name, "Abin Varghese Dev"],
    url: siteUrl,
    description: siteConfig.description,
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
      name: siteConfig.name,
      url: siteUrl,
    },
  };

  return <JsonLd data={schema} />;
}

type FAQPageSchemaProps = {
  items: Array<{ question: string; answer: string }>;
};

export function FAQPageSchema({ items }: FAQPageSchemaProps) {
  const mainEntity = items
    .map((item) => ({
      question: item.question?.trim(),
      answer: item.answer?.trim(),
    }))
    .filter((item) => item.question && item.answer)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  if (mainEntity.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
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
      name: siteConfig.name,
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
