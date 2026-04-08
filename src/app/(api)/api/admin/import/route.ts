import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import {
  getAboutContent,
  getHeroContent,
  getHomeContent,
  upsertAboutContent,
  upsertHeroContent,
  upsertHomeContent,
} from "@/lib/site-content";
import {
  contactSectionDefaults,
  type ContactSectionSettings,
  getContactSectionSettings,
  upsertContactSectionSettings,
} from "@/lib/contact-content";
import { getServicesContent, upsertServicesContent } from "@/lib/services-content";
import prisma from "@/lib/prisma";
import type { AboutContent } from "@/lib/about-content-defaults";
import type { HeroContent } from "@/lib/hero-content-defaults";
import type { HomeContent } from "@/lib/home-content-defaults";
import type { Service } from "@/constants/services";

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  imageUrl: z.string(),
  demoUrl: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  tags: z.array(z.string()),
  featured: z.boolean().optional(),
});

const importSchema = z.object({
  payload: z.object({
    hero: z.record(z.unknown()).optional(),
    home: z.record(z.unknown()).optional(),
    about: z.record(z.unknown()).optional(),
    forms: z.object({ settings: z.record(z.unknown()) }).optional(),
    services: z.array(z.record(z.unknown())).optional(),
    projects: z.array(projectSchema).optional(),
  }),
});

function parseHeroPayload(input: Record<string, unknown>): HeroContent {
  return {
    heroGreeting: String(input.heroGreeting || ""),
    heroName: String(input.heroName || ""),
    heroSubcopy: String(input.heroSubcopy || ""),
    heroAudienceTags: String(input.heroAudienceTags || ""),
    heroAvailabilityText: String(input.heroAvailabilityText || ""),
    heroCtaPrimaryLabel: String(input.heroCtaPrimaryLabel || ""),
    heroCtaPrimaryUrl: String(input.heroCtaPrimaryUrl || ""),
    heroCtaSecondaryLabel: String(input.heroCtaSecondaryLabel || ""),
    heroCtaSecondaryUrl: String(input.heroCtaSecondaryUrl || ""),
  };
}

function parseHomePayload(input: Record<string, unknown>): HomeContent {
  const socialRaw =
    typeof input.socialLinks === "object" && input.socialLinks !== null
      ? (input.socialLinks as Record<string, unknown>)
      : {};
  const pageRaw =
    typeof input.pageLinks === "object" && input.pageLinks !== null
      ? (input.pageLinks as Record<string, unknown>)
      : {};

  return {
    scrollingBannerItems: String(input.scrollingBannerItems || ""),
    scrollingLogos: Array.isArray(input.scrollingLogos)
      ? input.scrollingLogos.filter((item): item is string => typeof item === "string")
      : [],
    socialLinks: {
      github: String(socialRaw.github || ""),
      behance: String(socialRaw.behance || ""),
      linkedin: String(socialRaw.linkedin || ""),
      instagram: String(socialRaw.instagram || ""),
    },
    pageLinks: {
      about: String(pageRaw.about || ""),
      projects: String(pageRaw.projects || ""),
      services: String(pageRaw.services || ""),
      contact: String(pageRaw.contact || ""),
    },
  };
}

function parseAboutPayload(input: Record<string, unknown>): AboutContent {
  return {
    aboutImage: String(input.aboutImage || ""),
    aboutInstagramImage1: String(input.aboutInstagramImage1 || ""),
    aboutInstagramImage2: String(input.aboutInstagramImage2 || ""),
    aboutInstagramImage3: String(input.aboutInstagramImage3 || ""),
    aboutInstagramImage4: String(input.aboutInstagramImage4 || ""),
    aboutInstagramLink1: String(input.aboutInstagramLink1 || ""),
    aboutInstagramLink2: String(input.aboutInstagramLink2 || ""),
    aboutInstagramLink3: String(input.aboutInstagramLink3 || ""),
    aboutInstagramLink4: String(input.aboutInstagramLink4 || ""),
  };
}

function parseFormSettingsPayload(input: Record<string, unknown>): ContactSectionSettings {
  return {
    introText: String(input.introText || contactSectionDefaults.introText),
    instagramUrl: String(input.instagramUrl || contactSectionDefaults.instagramUrl),
    linkedinUrl: String(input.linkedinUrl || contactSectionDefaults.linkedinUrl),
    contactEmail: String(input.contactEmail || contactSectionDefaults.contactEmail),
    formEnabled:
      typeof input.formEnabled === "boolean"
        ? input.formEnabled
        : contactSectionDefaults.formEnabled,
  };
}

function parseServicesPayload(input: Array<Record<string, unknown>>): Service[] {
  return input.map((service) => ({
    id: String(service.id || ""),
    title: String(service.title || ""),
    description: String(service.description || ""),
    detailedDescription: String(service.detailedDescription || ""),
    accentColor: String(service.accentColor || "#000000"),
    providedServices: Array.isArray(service.providedServices)
      ? service.providedServices.filter((item): item is string => typeof item === "string")
      : [],
    contents: Array.isArray(service.contents)
      ? (service.contents as Service["contents"])
      : [],
    projectsUrl: typeof service.projectsUrl === "string" ? service.projectsUrl : undefined,
    projectsLabel: typeof service.projectsLabel === "string" ? service.projectsLabel : undefined,
  }));
}

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  const [hero, home, about, settings, services, projects] = await Promise.all([
    getHeroContent(),
    getHomeContent(),
    getAboutContent(),
    getContactSectionSettings(),
    getServicesContent(),
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({
    exportedAt: new Date().toISOString(),
    hero,
    home,
    about,
    forms: {
      settings,
    },
    services,
    projects,
  });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const { payload } = importSchema.parse(body);

    if (payload.hero) {
      await upsertHeroContent(parseHeroPayload(payload.hero));
    }

    if (payload.home) {
      await upsertHomeContent(parseHomePayload(payload.home));
    }

    if (payload.about) {
      await upsertAboutContent(parseAboutPayload(payload.about));
    }

    if (payload.forms?.settings) {
      await upsertContactSectionSettings(parseFormSettingsPayload(payload.forms.settings));
    }

    if (payload.services) {
      await upsertServicesContent(parseServicesPayload(payload.services));
    }

    if (payload.projects) {
      await prisma.project.deleteMany();
      await prisma.project.createMany({
        data: payload.projects.map((project) => ({
          title: project.title,
          description: project.description,
          content: project.content,
          imageUrl: project.imageUrl,
          demoUrl: project.demoUrl || null,
          githubUrl: project.githubUrl || null,
          tags: project.tags,
          featured: project.featured || false,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid import payload", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
