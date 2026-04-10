import prisma from "@/lib/prisma";
import type { HomeContent } from "@/lib/home-content-defaults";
import type { ContactSectionSettings } from "@/lib/contact-content";

export interface SiteCopyReviewItem {
  id: string;
  name: string;
  content: string;
  designation?: string;
  rating: number;
}

export interface SiteCopyCreativeCategory {
  title: string;
  description: string;
  image: string;
}

export interface SiteCopyTimelineEntry {
  role: string;
  organization: string;
  duration: string;
  copy: string;
}

export interface SiteCopyComparisonFeature {
  label: string;
  others: boolean;
  me: boolean;
}

export interface SiteCopyFaqItem {
  question: string;
  answer: string;
}

export interface SiteCopyContent {
  heroStatusLine: string;
  homeAboutHeading: string;
  homeAboutBody: string;
  homeAboutCtaLabel: string;
  homeToolboxHeading: string;
  homeToolboxIntro: string;
  homeToolCategories: Array<{
    id: "design" | "video" | "development";
    name: string;
    description: string;
  }>;
  homeRecentHeading: string;
  homeRecentIntro: string;
  homeRecentWebTitle: string;
  homeRecentWebCopy: string;
  homeRecentWebCtaLabel: string;
  homeCreativeTitle: string;
  homeCreativeCopy: string;
  homeCreativeCtaLabel: string;
  homeCreativeCategories: SiteCopyCreativeCategory[];
  homeServicesHeading: string;
  homeServicesIntro: string;
  homeReviewsHeading: string;
  homeReviewsIntro: string;
  homeReviewsItems: SiteCopyReviewItem[];
  aboutStickyNote: string;
  aboutLowerRightNote: string;
  aboutFooterTag: string;
  aboutIntroTitle: string;
  aboutIntroBody: string;
  aboutBookImage: string;
  aboutTimelineTitle: string;
  aboutTimelineEntries: SiteCopyTimelineEntry[];
  aboutTypewriterQuote: string;
  servicesHeroTitle: string;
  servicesWhyEyebrow: string;
  servicesWhyHeading: string;
  servicesWhyIntro: string;
  servicesWhyCtaLabel: string;
  servicesWhyCtaUrl: string;
  servicesWhyFeatures: SiteCopyComparisonFeature[];
  servicesFaqEyebrow: string;
  servicesFaqHeading: string;
  servicesFaqIntro: string;
  servicesFaqItems: SiteCopyFaqItem[];
  servicesFaqCtaText: string;
  servicesFaqCtaLabel: string;
  contactEyebrow: string;
  contactHeading: string;
  contactSupportLine: string;
  contactGiantText: string;
  footerBrandEyebrow: string;
  footerSupportCopy: string;
  footerEmail: string;
  footerCtaHeading: string;
  footerCtaCopy: string;
  footerCopyright: string;
  footerCredit: string;
}

const SITE_COPY_CONTENT_KEY = "site_copy_content_v1";

export const siteCopyDefaults: SiteCopyContent = {
  heroStatusLine: "Available for freelance projects, collaborations, and internship opportunities.",
  homeAboutHeading: "About [Me]",
  homeAboutBody:
    "I started out being drawn to visuals, layout systems, and design tools. Over time that pulled me deeper into frontend development and product building, and now I enjoy working on projects where I can shape both the interface and the implementation.",
  homeAboutCtaLabel: "More about",
  homeToolboxHeading: "My Creative [Toolbox]",
  homeToolboxIntro:
    "The tools I use reflect how I work. Some help me design, some help me build, and some help me present ideas more clearly from rough concept to finished product.",
  homeToolCategories: [
    { id: "design", name: "Design Tools", description: "UI, branding, and prototyping" },
    { id: "video", name: "Motion and Video", description: "Motion graphics, editing, and 3D" },
    { id: "development", name: "Development Tools", description: "Frontend engineering and creative coding" },
  ],
  homeRecentHeading: "My Recent [Projects]",
  homeRecentIntro:
    "These projects show the kind of work I enjoy most: useful products, clear interfaces, and builds that solve real problems without losing visual quality.",
  homeRecentWebTitle: "Web Development",
  homeRecentWebCopy:
    "Building responsive products with strong frontend structure, clean interaction, and practical implementation. I like turning rough ideas into websites and interfaces people can actually use.",
  homeRecentWebCtaLabel: "View Projects",
  homeCreativeTitle: "Creative Stuff",
  homeCreativeCopy:
    "Alongside product and web work, I spend time on branding, motion, layouts, and visual experiments. That creative side feeds back into how I approach websites and interfaces.",
  homeCreativeCtaLabel: "Contact me",
  homeCreativeCategories: [
    {
      title: "Motion Graphics",
      description: "Motion pieces that add rhythm, clarity, and energy to brand and product storytelling.",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600",
    },
    {
      title: "UI/UX Design",
      description: "Interfaces planned around clarity, flow, and how real people move through a product.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
    },
    {
      title: "Video Editing",
      description: "Edits shaped around pacing, clean transitions, and a stronger visual story.",
      image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600",
    },
    {
      title: "Visual Effects",
      description: "Atmospheric effects and visual treatments that add depth and impact to a piece.",
      image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600",
    },
    {
      title: "3D Design",
      description: "3D concepts, product visuals, and renders that help ideas feel more real.",
      image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=600",
    },
    {
      title: "Graphic Design",
      description: "Posters, identity systems, and digital graphics built with consistency and personality.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600",
    },
    {
      title: "Brand Visuals",
      description: "Visual systems that help a brand look coherent across web, social, and presentations.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600",
    },
  ],
  homeServicesHeading: "My [Services]",
  homeServicesIntro:
    "I work with founders, teams, and growing brands on websites, interfaces, brand visuals, and creative assets that need both good design and careful execution.",
  homeReviewsHeading: "Highlights and [Achievements]",
  homeReviewsIntro:
    "This section can hold achievements, recognitions, or real client feedback. It is now fully editable from the admin panel.",
  homeReviewsItems: [
    {
      id: "nasa-space-apps",
      name: "NASA Space Apps",
      content:
        "Best Mission Concept Award in the senior category at NASA Space Apps Challenge 2025, Kanjirappally Local Chapter.",
      designation: "Achievement",
      rating: 0,
    },
    {
      id: "acm-hackathon",
      name: "ACM AJCE",
      content: "Won 1st place out of 150 teams in the UI/UX Hackathon.",
      designation: "Hackathon Result",
      rating: 0,
    },
    {
      id: "kochi-hackathon",
      name: "Kochi Hackathon 2025",
      content: "Shortlisted from 900+ participants in the 36-hour challenge with the AJCE team.",
      designation: "Shortlist",
      rating: 0,
    },
  ],
  aboutStickyNote: "Still learning.\nStill building.",
  aboutLowerRightNote:
    "Most of the work I am proud of started with a simple question: how can this be clearer, better, or more useful? That is still how I approach projects now.",
  aboutFooterTag: "Issue 2026 · Abin Varghese Archive",
  aboutIntroTitle: "Prologue",
  aboutIntroBody:
    "I am Abin, a full-stack developer and UI/UX designer dedicated to building clear, useful products with refined interfaces. My path began with a fascination for typography, layouts, and brand identity, which naturally evolved from pure design into frontend engineering and comprehensive product development.\n\nCurrently, I'm a pre-final year B.Tech student in Computer Science and Engineering with a Minor in VLSI at Amal Jyothi College of Engineering (2023–Present). I approach every project as a real-world product rather than a simple exercise, focusing on solving complex problems and transforming rough concepts into polished, intuitive systems that add genuine value to the user experience.",
  aboutBookImage: "/about/abin-varghese.png",
  aboutTimelineTitle: "Chronicles of Work",
  aboutTimelineEntries: [
    {
      role: "B.Tech Computer Science and Engineering (Minor in VLSI)",
      organization: "Amal Jyothi College of Engineering",
      duration: "2023 to Present",
      copy:
        "Pre-final year student with a 7.19 CGPA, building a strong foundation in software engineering while actively working on real product and design projects.",
    },
    {
      role: "Full Stack Developer and UI/UX Designer",
      organization: "INCIAL",
      duration: "Jan 2024 to Present",
      copy:
        "Working across product design and development for client projects, with a focus on clean interfaces, usable systems, and solid frontend execution.",
    },
    {
      role: "Freelance Full Stack Web Developer",
      organization: "Independent",
      duration: "Mar 2023 to Present",
      copy:
        "Building websites and web apps from planning and design to development, deployment, and handoff.",
    },
    {
      role: "Data Science and Deep Learning Intern",
      organization: "Luminar Technolab, Kochi",
      duration: "Jun 2025",
      copy:
        "Worked on TensorFlow-based models for image classification and explored end-to-end deep learning workflows.",
    },
    {
      role: "Machine Learning Intern",
      organization: "Cognifyz Technologies",
      duration: "Apr 2025 to May 2025",
      copy:
        "Applied machine learning concepts in practical assignments and strengthened hands-on workflow knowledge.",
    },
    {
      role: "DevOps with AI Industry Immersion",
      organization: "NeST Digital Academy, Kochi",
      duration: "Feb 2026",
      copy:
        "Learned AWS, Docker, and AI-assisted DevOps workflows with a focus on deployment pipelines and CI/CD.",
    },
  ],
  aboutTypewriterQuote: "\"Good design gets attention. Good product design keeps it.\"",
  servicesHeroTitle: "Services",
  servicesWhyEyebrow: "Why work with me",
  servicesWhyHeading: "Why work [with me]",
  servicesWhyIntro:
    "I work across both design and development, which means less handoff friction, clearer execution, and better alignment between the original idea and the final product.",
  servicesWhyCtaLabel: "Get Started",
  servicesWhyCtaUrl: "/contact",
  servicesWhyFeatures: [
    { label: "Design and development in one workflow", others: false, me: true },
    { label: "Cleaner handoff between idea and build", others: false, me: true },
    { label: "Strong visual polish", others: true, me: true },
    { label: "Product-minded execution", others: true, me: true },
    { label: "Flexible across creative and technical work", others: false, me: true },
  ],
  servicesFaqEyebrow: "FAQs",
  servicesFaqHeading: "Common [Questions]",
  servicesFaqIntro:
    "A few quick answers about the kind of work I take on and how I usually approach a project.",
  servicesFaqItems: [
    {
      question: "What kind of projects do you usually take on?",
      answer:
        "I usually work on portfolio sites, business websites, admin dashboards, frontend-heavy products, and design-led digital experiences.",
    },
    {
      question: "Do you only design, or do you also build?",
      answer:
        "I do both. One of my strengths is being able to move from interface design into frontend and full-stack implementation without losing the original direction of the work.",
    },
    {
      question: "Are you available for freelance work?",
      answer:
        "Yes. I am open to freelance work, collaborations, and selected longer-term opportunities depending on the scope.",
    },
    {
      question: "Do you work with startups and student-led teams?",
      answer:
        "Yes. I am comfortable working with early-stage ideas and helping shape them into something clearer and more ready to build.",
    },
    {
      question: "How do you usually start a project?",
      answer:
        "I usually start by understanding the goal, audience, required features, and the overall visual direction. After that, I move into structure, design, and implementation in a practical order.",
    },
    {
      question: "Can you help improve an existing product or site?",
      answer:
        "Yes. I can step into an existing product or site to improve the UI, clean up the frontend, refine flows, or make the overall experience feel more consistent.",
    },
  ],
  servicesFaqCtaText: "Could not find the answer you were looking for?",
  servicesFaqCtaLabel: "Contact Me",
  contactEyebrow: "Let's Connect",
  contactHeading: "Let's talk about what you're building.",
  contactSupportLine:
    "The easiest way to start is with a simple message about what you are working on and where you need help.",
  contactGiantText: "Contact Me",
  footerBrandEyebrow: "Design-led digital work by Abin Varghese.",
  footerSupportCopy:
    "Full-stack development, UI/UX design, branding, and creative visual work from Idukki, Kerala.",
  footerEmail: process.env.CONTACT_EMAIL || "toabinvarghese@gmail.com",
  footerCtaHeading: "Have something in mind?",
  footerCtaCopy: "Let's talk.",
  footerCopyright: "ABIN VARGHESE 2026 ©",
  footerCredit: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback: number) {
  return typeof value === "number" ? value : fallback;
}

function normalizeReviewItems(value: unknown): SiteCopyReviewItem[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.homeReviewsItems;
  }

  const normalized = value.reduce<SiteCopyReviewItem[]>((items, item, index) => {
    if (!isRecord(item)) {
      return items;
    }

    const normalizedItem: SiteCopyReviewItem = {
      id: normalizeString(item.id, `review-${index + 1}`),
      name: normalizeString(item.name, ""),
      content: normalizeString(item.content, ""),
      designation: normalizeString(item.designation, ""),
      rating: normalizeNumber(item.rating, 0),
    };

    if (normalizedItem.name && normalizedItem.content) {
      items.push(normalizedItem);
    }

    return items;
  }, []);

  return normalized.length > 0 ? normalized : siteCopyDefaults.homeReviewsItems;
}

function normalizeCreativeCategories(value: unknown): SiteCopyCreativeCategory[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.homeCreativeCategories;
  }

  const normalized = value
    .map((item) => {
      if (!isRecord(item)) return null;

      return {
        title: normalizeString(item.title, ""),
        description: normalizeString(item.description, ""),
        image: normalizeString(item.image, ""),
      };
    })
    .filter((item): item is SiteCopyCreativeCategory => Boolean(item && item.title));

  return normalized.length > 0 ? normalized : siteCopyDefaults.homeCreativeCategories;
}

function normalizeTimelineEntries(value: unknown): SiteCopyTimelineEntry[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.aboutTimelineEntries;
  }

  const normalized = value
    .map((item) => {
      if (!isRecord(item)) return null;

      return {
        role: normalizeString(item.role, ""),
        organization: normalizeString(item.organization, ""),
        duration: normalizeString(item.duration, ""),
        copy: normalizeString(item.copy, ""),
      };
    })
    .filter((item): item is SiteCopyTimelineEntry => Boolean(item && item.role));

  return normalized.length > 0 ? normalized : siteCopyDefaults.aboutTimelineEntries;
}

function normalizeComparisonFeatures(value: unknown): SiteCopyComparisonFeature[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.servicesWhyFeatures;
  }

  const normalized = value
    .map((item) => {
      if (!isRecord(item)) return null;

      return {
        label: normalizeString(item.label, ""),
        others: Boolean(item.others),
        me: Boolean(item.me),
      };
    })
    .filter((item): item is SiteCopyComparisonFeature => Boolean(item && item.label));

  return normalized.length > 0 ? normalized : siteCopyDefaults.servicesWhyFeatures;
}

function normalizeFaqItems(value: unknown): SiteCopyFaqItem[] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.servicesFaqItems;
  }

  const normalized = value
    .map((item) => {
      if (!isRecord(item)) return null;

      return {
        question: normalizeString(item.question, ""),
        answer: normalizeString(item.answer, ""),
      };
    })
    .filter((item): item is SiteCopyFaqItem => Boolean(item && item.question));

  return normalized.length > 0 ? normalized : siteCopyDefaults.servicesFaqItems;
}

function normalizeToolCategories(
  value: unknown
): SiteCopyContent["homeToolCategories"] {
  if (!Array.isArray(value)) {
    return siteCopyDefaults.homeToolCategories;
  }

  const expectedIds = ["design", "video", "development"] as const;

  return expectedIds.map((id, index) => {
    const item = value[index];
    if (!isRecord(item)) {
      return siteCopyDefaults.homeToolCategories[index];
    }

    return {
      id,
      name: normalizeString(item.name, siteCopyDefaults.homeToolCategories[index].name),
      description: normalizeString(
        item.description,
        siteCopyDefaults.homeToolCategories[index].description
      ),
    };
  });
}

export function normalizeSiteCopyContent(value: unknown): SiteCopyContent {
  if (!isRecord(value)) {
    return siteCopyDefaults;
  }

  return {
    heroStatusLine: normalizeString(value.heroStatusLine, siteCopyDefaults.heroStatusLine),
    homeAboutHeading: normalizeString(value.homeAboutHeading, siteCopyDefaults.homeAboutHeading),
    homeAboutBody: normalizeString(value.homeAboutBody, siteCopyDefaults.homeAboutBody),
    homeAboutCtaLabel: normalizeString(value.homeAboutCtaLabel, siteCopyDefaults.homeAboutCtaLabel),
    homeToolboxHeading: normalizeString(value.homeToolboxHeading, siteCopyDefaults.homeToolboxHeading),
    homeToolboxIntro: normalizeString(value.homeToolboxIntro, siteCopyDefaults.homeToolboxIntro),
    homeToolCategories: normalizeToolCategories(value.homeToolCategories),
    homeRecentHeading: normalizeString(value.homeRecentHeading, siteCopyDefaults.homeRecentHeading),
    homeRecentIntro: normalizeString(value.homeRecentIntro, siteCopyDefaults.homeRecentIntro),
    homeRecentWebTitle: normalizeString(value.homeRecentWebTitle, siteCopyDefaults.homeRecentWebTitle),
    homeRecentWebCopy: normalizeString(value.homeRecentWebCopy, siteCopyDefaults.homeRecentWebCopy),
    homeRecentWebCtaLabel: normalizeString(
      value.homeRecentWebCtaLabel,
      siteCopyDefaults.homeRecentWebCtaLabel
    ),
    homeCreativeTitle: normalizeString(value.homeCreativeTitle, siteCopyDefaults.homeCreativeTitle),
    homeCreativeCopy: normalizeString(value.homeCreativeCopy, siteCopyDefaults.homeCreativeCopy),
    homeCreativeCtaLabel: normalizeString(
      value.homeCreativeCtaLabel,
      siteCopyDefaults.homeCreativeCtaLabel
    ),
    homeCreativeCategories: normalizeCreativeCategories(value.homeCreativeCategories),
    homeServicesHeading: normalizeString(value.homeServicesHeading, siteCopyDefaults.homeServicesHeading),
    homeServicesIntro: normalizeString(value.homeServicesIntro, siteCopyDefaults.homeServicesIntro),
    homeReviewsHeading: normalizeString(value.homeReviewsHeading, siteCopyDefaults.homeReviewsHeading),
    homeReviewsIntro: normalizeString(value.homeReviewsIntro, siteCopyDefaults.homeReviewsIntro),
    homeReviewsItems: normalizeReviewItems(value.homeReviewsItems),
    aboutStickyNote: normalizeString(value.aboutStickyNote, siteCopyDefaults.aboutStickyNote),
    aboutLowerRightNote: normalizeString(
      value.aboutLowerRightNote,
      siteCopyDefaults.aboutLowerRightNote
    ),
    aboutFooterTag: normalizeString(value.aboutFooterTag, siteCopyDefaults.aboutFooterTag),
    aboutIntroTitle: normalizeString(value.aboutIntroTitle, siteCopyDefaults.aboutIntroTitle),
    aboutIntroBody: normalizeString(value.aboutIntroBody, siteCopyDefaults.aboutIntroBody),
    aboutBookImage: normalizeString(value.aboutBookImage, siteCopyDefaults.aboutBookImage),
    aboutTimelineTitle: normalizeString(value.aboutTimelineTitle, siteCopyDefaults.aboutTimelineTitle),
    aboutTimelineEntries: normalizeTimelineEntries(value.aboutTimelineEntries),
    aboutTypewriterQuote: normalizeString(
      value.aboutTypewriterQuote,
      siteCopyDefaults.aboutTypewriterQuote
    ),
    servicesHeroTitle: normalizeString(value.servicesHeroTitle, siteCopyDefaults.servicesHeroTitle),
    servicesWhyEyebrow: normalizeString(value.servicesWhyEyebrow, siteCopyDefaults.servicesWhyEyebrow),
    servicesWhyHeading: normalizeString(value.servicesWhyHeading, siteCopyDefaults.servicesWhyHeading),
    servicesWhyIntro: normalizeString(value.servicesWhyIntro, siteCopyDefaults.servicesWhyIntro),
    servicesWhyCtaLabel: normalizeString(value.servicesWhyCtaLabel, siteCopyDefaults.servicesWhyCtaLabel),
    servicesWhyCtaUrl: normalizeString(value.servicesWhyCtaUrl, siteCopyDefaults.servicesWhyCtaUrl),
    servicesWhyFeatures: normalizeComparisonFeatures(value.servicesWhyFeatures),
    servicesFaqEyebrow: normalizeString(value.servicesFaqEyebrow, siteCopyDefaults.servicesFaqEyebrow),
    servicesFaqHeading: normalizeString(value.servicesFaqHeading, siteCopyDefaults.servicesFaqHeading),
    servicesFaqIntro: normalizeString(value.servicesFaqIntro, siteCopyDefaults.servicesFaqIntro),
    servicesFaqItems: normalizeFaqItems(value.servicesFaqItems),
    servicesFaqCtaText: normalizeString(value.servicesFaqCtaText, siteCopyDefaults.servicesFaqCtaText),
    servicesFaqCtaLabel: normalizeString(
      value.servicesFaqCtaLabel,
      siteCopyDefaults.servicesFaqCtaLabel
    ),
    contactEyebrow: normalizeString(value.contactEyebrow, siteCopyDefaults.contactEyebrow),
    contactHeading: normalizeString(value.contactHeading, siteCopyDefaults.contactHeading),
    contactSupportLine: normalizeString(
      value.contactSupportLine,
      siteCopyDefaults.contactSupportLine
    ),
    contactGiantText: normalizeString(value.contactGiantText, siteCopyDefaults.contactGiantText),
    footerBrandEyebrow: normalizeString(
      value.footerBrandEyebrow,
      siteCopyDefaults.footerBrandEyebrow
    ),
    footerSupportCopy: normalizeString(value.footerSupportCopy, siteCopyDefaults.footerSupportCopy),
    footerEmail: normalizeString(value.footerEmail, siteCopyDefaults.footerEmail),
    footerCtaHeading: normalizeString(value.footerCtaHeading, siteCopyDefaults.footerCtaHeading),
    footerCtaCopy: normalizeString(value.footerCtaCopy, siteCopyDefaults.footerCtaCopy),
    footerCopyright: normalizeString(value.footerCopyright, siteCopyDefaults.footerCopyright),
    footerCredit: normalizeString(value.footerCredit, siteCopyDefaults.footerCredit),
  };
}

export async function getSiteCopyContent(): Promise<SiteCopyContent> {
  const record = await prisma.siteContent.findUnique({
    where: { key: SITE_COPY_CONTENT_KEY },
  });

  if (!record?.value) {
    return siteCopyDefaults;
  }

  try {
    const parsed = JSON.parse(record.value);
    return normalizeSiteCopyContent(parsed);
  } catch {
    return siteCopyDefaults;
  }
}

export async function upsertSiteCopyContent(content: SiteCopyContent) {
  await prisma.siteContent.upsert({
    where: { key: SITE_COPY_CONTENT_KEY },
    update: { value: JSON.stringify(content) },
    create: { key: SITE_COPY_CONTENT_KEY, value: JSON.stringify(content) },
  });
}

export interface PublicSiteShellContent {
  siteCopy: SiteCopyContent;
  socialLinks: HomeContent["socialLinks"];
  contactSettings: ContactSectionSettings;
}
