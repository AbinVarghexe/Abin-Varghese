import type { MetadataRoute } from "next";
import { getGithubWorkspaceProjects } from "@/lib/github-projects";
import { pinterestPins } from "@/lib/pinterest-content";
import { getServicesContent } from "@/lib/services-content";
import { getAbsoluteUrl } from "@/seo/config";

function now() {
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteUrl("/"),
      lastModified: now(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getAbsoluteUrl("/about"),
      lastModified: now(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl("/projects"),
      lastModified: now(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl("/services"),
      lastModified: now(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl("/contact"),
      lastModified: now(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl("/pinterest"),
      lastModified: now(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    const services = await getServicesContent();

    entries.push(
      ...services.map((service) => ({
        url: getAbsoluteUrl(`/services/${service.id}`),
        lastModified: now(),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      }))
    );
  } catch (error) {
    console.error("Unable to add service entries to the sitemap.", error);
  }

  try {
    const projects = await getGithubWorkspaceProjects();

    entries.push(
      ...projects.map((project) => ({
        url: getAbsoluteUrl(`/projects/${encodeURIComponent(project.slug)}`),
        lastModified: new Date(project.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    );
  } catch (error) {
    console.error("Unable to add project entries to the sitemap.", error);
  }

  entries.push(
    ...pinterestPins.map((pin) => ({
      url: getAbsoluteUrl(`/pinterest/${pin.id}`),
      lastModified: now(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  return entries;
}
