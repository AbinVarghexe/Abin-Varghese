import { createStaticClient } from "@/utils/supabase/static";
import { createAdminClient } from "@/utils/supabase/admin";
import { services as servicesDefaults, type Service } from "@/constants/services";

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

function normalizeService(raw: unknown, fallback: Service): Service {
  if (!isRecord(raw)) {
    return fallback;
  }

  const normalizedProvidedServices = normalizeStringArray(raw.providedServices);

  return {
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
}

export async function getServicesContent(): Promise<Service[]> {
  const supabase = createStaticClient();
  const { data: record, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", SERVICES_CONTENT_KEY)
    .single();

  let baseServices: Service[] = servicesDefaults;

  if (!error && record?.value) {
    try {
      const parsed = JSON.parse(record.value);
      if (Array.isArray(parsed)) {
        const defaultsById = new Map(servicesDefaults.map((service) => [service.id, service]));
        baseServices = parsed
          .map((item) => {
            if (!isRecord(item) || typeof item.id !== "string") return null;
            const fallback = defaultsById.get(item.id);
            if (!fallback) return null;
            return normalizeService(item, fallback);
          })
          .filter((service): service is Service => Boolean(service));
        
        if (baseServices.length === 0) baseServices = servicesDefaults;
      }
    } catch {
      baseServices = servicesDefaults;
    }
  }

  // ─── Dynamic Project Population ───
  // Collect all unique project IDs mentioned in service contents
  const projectIds = new Set<string>();
  baseServices.forEach(service => {
    service.contents?.forEach(content => {
      if (content.type === 'project' && content.projectId) {
        projectIds.add(content.projectId);
      }
    });
  });

  if (projectIds.size > 0) {
    // 1. Fetch from standard projects table
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .in("id", Array.from(projectIds));

    const projectsMap = new Map<string, any>(projects?.map(p => [p.id, p]) || []);

    // 2. Fetch from site_content table for showcase items (if any projectIds remain missing)
    const missingIds = Array.from(projectIds).filter(id => !projectsMap.has(id));
    
    if (missingIds.length > 0) {
      const { data: contentRecord } = await supabase
        .from("site_content")
        .select("value")
        .in("key", ["behance_showcase_v1", "pinterest_showcase_v1"]);

      if (contentRecord) {
        contentRecord.forEach(record => {
          try {
            const items = JSON.parse(record.value);
            if (Array.isArray(items)) {
              items.forEach((item: any) => {
                if (missingIds.includes(item.id)) {
                  projectsMap.set(item.id, {
                    id: item.id,
                    title: item.title,
                    external_url: item.src,
                    media_url: item.src, // Fallback
                    tags: ["Behance", "Showcase"],
                    isShowcase: true
                  });
                }
              });
            }
          } catch (e) {
            console.error("Error parsing showcase content:", e);
          }
        });
      }
    }

    if (projectsMap.size > 0) {
      // Merge project data into service contents
      baseServices = baseServices.map(service => ({
        ...service,
        contents: service.contents?.map(content => {
          if (content.type === 'project' && content.projectId) {
            const project = projectsMap.get(content.projectId);
            if (project) {
              const isVideo = project.category?.toLowerCase().includes("motion") || 
                            project.category?.toLowerCase().includes("vfx") || 
                            project.mediaType === "VIDEO" ||
                            project.media_type === "VIDEO";
              
              const links = [];
              const externalUrl = project.external_url || project.externalUrl;
              const isBehanceShowcase = project.isShowcase && externalUrl?.includes("behance.net");

              if (externalUrl) {
                let icon: any = "ExternalLink";
                if (externalUrl.includes("github.com")) icon = "Github";
                else if (externalUrl.includes("figma.com")) icon = "Figma";
                else if (externalUrl.includes("behance.net")) icon = "ExternalLink";
                
                links.push({ 
                  label: isVideo ? "Watch Reel" : externalUrl.includes("behance.net") ? "View on Behance" : "View Project", 
                  url: externalUrl, 
                  icon 
                });
              }

              return {
                ...content,
                title: project.title || content.title,
                description: project.description || content.description,
                mockupImage: isBehanceShowcase ? "" : (project.media_url || project.mediaUrl || content.mockupImage),
                videoUrl: isVideo ? externalUrl : content.videoUrl,
                iframeUrl: isBehanceShowcase ? externalUrl : content.iframeUrl,
                techStack: project.tags || project.tags || content.techStack,
                projectSlug: project.slug || project.slug || content.projectSlug,
                projectLinks: links.length > 0 ? links : content.projectLinks
              };
            }
          }
          return content;
        })
      }));
    }
  }

  return baseServices;
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
