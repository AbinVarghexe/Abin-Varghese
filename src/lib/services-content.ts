import { createStaticClient } from "@/utils/supabase/static";
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

  if (error || !record?.value) {
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching services content:", error);
    }
    return servicesDefaults;
  }

  try {
    const parsed = JSON.parse(record.value);

    if (!Array.isArray(parsed)) {
      return servicesDefaults;
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

    return normalized.length > 0 ? normalized : servicesDefaults;
  } catch {
    return servicesDefaults;
  }
}

export async function upsertServicesContent(services: Service[]) {
  const supabase = createStaticClient();
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
