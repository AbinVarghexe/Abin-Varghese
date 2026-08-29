import { createStaticClient } from "@/utils/supabase/static";
import { createAdminClient } from "@/utils/supabase/admin";
import { services as servicesDefaults, type Service } from "@/constants/services";
import { getBehanceShowcaseEmbeds } from "@/lib/site-content";
import { parseBehanceShowcaseLinkId } from "@/lib/map-portfolio-project-to-service-showcase";
import { extractUrlFromEmbed, toBehanceIframeSrc } from "@/lib/utils";

const SERVICES_CONTENT_KEY = "services_section_content_v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

/** Legacy CMS rows still say "Video Editing"; public label should be Motion Graphics only. */
function sanitizeMotionGraphicsService(service: Service): Service {
  if (service.id !== "motion-video-editing") {
    return service;
  }

  let title = service.title;
  if (/video\s+editing/i.test(title)) {
    title = "Motion Graphics";
  }

  let description = service.description;
  if (/seamless\s+cuts/i.test(description) || /video\s+editing/i.test(description)) {
    description =
      "Breathe life into your brand with kinetic animation, motion systems, and on-brand visual storytelling.";
  }

  let detailedDescription = service.detailedDescription;
  if (/video\s+editing/i.test(detailedDescription)) {
    detailedDescription = detailedDescription
      .replace(/\bmotion graphics and professional video editing are\b/gi, "Motion graphics are")
      .replace(/\bprofessional video editing\b/gi, "motion design")
      .replace(/\bvideo editing\b/gi, "motion graphics");
  }

  return {
    ...service,
    title,
    description,
    detailedDescription,
  };
}

function normalizeService(raw: unknown, fallback: Service): Service {
  if (!isRecord(raw)) {
    return sanitizeMotionGraphicsService(fallback);
  }

  const normalizedProvidedServices = normalizeStringArray(raw.providedServices);

  const merged: Service = {
    ...fallback,
    id: typeof raw.id === "string" ? raw.id : fallback.id,
    title: typeof raw.title === "string" ? raw.title : fallback.title,
    description: typeof raw.description === "string" ? raw.description : fallback.description,
    detailedDescription:
      typeof raw.detailedDescription === "string"
        ? raw.detailedDescription
        : fallback.detailedDescription,
    accentColor: typeof raw.accentColor === "string" ? raw.accentColor : fallback.accentColor,
    providedServices:
      normalizedProvidedServices.length > 0
        ? normalizedProvidedServices
        : fallback.providedServices,
    projectsUrl: typeof raw.projectsUrl === "string" ? raw.projectsUrl : fallback.projectsUrl,
    projectsLabel: typeof raw.projectsLabel === "string" ? raw.projectsLabel : fallback.projectsLabel,
    iconUrl: typeof raw.iconUrl === "string" ? raw.iconUrl : fallback.iconUrl,
    contents: Array.isArray(raw.contents) ? (raw.contents as Service["contents"]) : fallback.contents,
  };

  return sanitizeMotionGraphicsService(merged);
}

/**
 * Graphics Design / Behance: hydrate `embedIframeSrc` from live Behance embed storage when CMS rows are stale,
 * and normalize gallery URLs → `/embed/` widget URLs (gallery pages do not render inside iframes).
 */
async function enrichGraphicsDesignBehanceEmbeds(services: Service[]): Promise<Service[]> {
  let embedList: Awaited<ReturnType<typeof getBehanceShowcaseEmbeds>> = [];
  try {
    embedList = await getBehanceShowcaseEmbeds();
  } catch {
    embedList = [];
  }
  const byId = new Map(embedList.map((e) => [e.id, e]));

  return services.map((service) => {
    if (service.id !== "graphics-design" || !service.contents?.length) {
      return service;
    }

    let anyChanged = false;
    const contents = service.contents.map((item) => {
      if (item.type !== "project") {
        return item;
      }

      let next = { ...item };
      let itemChanged = false;

      if (next.embedIframeSrc?.trim()) {
        const norm = toBehanceIframeSrc(next.embedIframeSrc);
        if (norm && norm !== next.embedIframeSrc) {
          next.embedIframeSrc = norm;
          itemChanged = true;
        }
      }

      const embedId = parseBehanceShowcaseLinkId(next.linkedProjectId);
      if (embedId) {
        const row = byId.get(embedId);
        const fromEmbed = row?.src ? toBehanceIframeSrc(extractUrlFromEmbed(row.src)) : undefined;
        if (fromEmbed && (!next.embedIframeSrc?.trim() || next.embedIframeSrc !== fromEmbed)) {
          next.embedIframeSrc = fromEmbed;
          itemChanged = true;
        }
      }

      if (itemChanged) anyChanged = true;
      return itemChanged ? next : item;
    });

    return anyChanged ? { ...service, contents } : service;
  });
}

export async function getServicesContent(): Promise<Service[]> {
  try {
    const supabase = createStaticClient();
    const { data: record, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", SERVICES_CONTENT_KEY)
      .single();

    if (error || !record?.value) {
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching services content:", error);
      }
      return enrichGraphicsDesignBehanceEmbeds(servicesDefaults.map(sanitizeMotionGraphicsService));
    }

    try {
      const parsed = JSON.parse(record.value);

      if (!Array.isArray(parsed)) {
        return enrichGraphicsDesignBehanceEmbeds(servicesDefaults.map(sanitizeMotionGraphicsService));
      }

      const defaultsById = new Map(servicesDefaults.map((service) => [service.id, service]));

      const normalized = parsed
        .map((item) => {
          if (!isRecord(item) || typeof item.id !== "string") {
            return null;
          }

          const fallback = defaultsById.get(item.id);
          if (!fallback) {
            return null;
          }

          return normalizeService(item, fallback);
        })
        .filter((service): service is Service => Boolean(service));

      return enrichGraphicsDesignBehanceEmbeds(
        normalized.length > 0
          ? normalized
          : servicesDefaults.map(sanitizeMotionGraphicsService)
      );
    } catch {
      return enrichGraphicsDesignBehanceEmbeds(servicesDefaults.map(sanitizeMotionGraphicsService));
    }
  } catch (error) {
    console.error("Critical error in getServicesContent:", error);
    return enrichGraphicsDesignBehanceEmbeds(servicesDefaults.map(sanitizeMotionGraphicsService));
  }
}

export async function upsertServicesContent(services: Service[]) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_content")
    .upsert(
      { key: SERVICES_CONTENT_KEY, value: JSON.stringify(services) },
      { onConflict: "key" }
    );

  if (error) throw error;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServicesContent();
  return services.find((service) => service.id === slug) || null;
}
