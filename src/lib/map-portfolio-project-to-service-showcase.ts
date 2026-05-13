import type { ProjectLink, ServiceContent } from "@/constants/services";
import type { BehanceShowcaseEmbed } from "@/lib/site-content";
import { extractUrlFromEmbed, toBehanceIframeSrc } from "@/lib/utils";

/** Stored in `linkedProjectId` when the row comes from Admin → Graphic Design → Behance embeds (site_content). */
export const SERVICE_LINK_BEHANCE_PREFIX = "behance-showcase:";

export function isBehanceShowcaseServiceLink(
  linkedProjectId: string | null | undefined
): boolean {
  return Boolean(linkedProjectId?.startsWith(SERVICE_LINK_BEHANCE_PREFIX));
}

export function parseBehanceShowcaseLinkId(
  linkedProjectId: string | null | undefined
): string | null {
  if (!linkedProjectId?.startsWith(SERVICE_LINK_BEHANCE_PREFIX)) {
    return null;
  }
  return linkedProjectId.slice(SERVICE_LINK_BEHANCE_PREFIX.length) || null;
}

export type AdminProjectForShowcase = {
  id: string;
  title: string;
  description: string | null;
  mediaType: "IMAGE" | "VIDEO" | "GIF" | "MODEL";
  mediaUrl: string | null;
  externalUrl: string | null;
  iframeUrl: string | null;
  /** From Admin projects API — used to prefer Behance iframe preview over thumbnail image. */
  type?: "CODE" | "FIGMA" | "BEHANCE" | "PINTEREST" | null;
  tags: string[] | null;
  dominantColor: string | null;
  slug?: string | null;
  category?: string | null;
  workspace?: string | null;
};

export function mapPortfolioProjectToServiceShowcase(
  p: AdminProjectForShowcase
): ServiceContent {
  const projectLinks: ProjectLink[] = [];
  const slug = (p.slug?.trim() || p.id).trim();
  const portfolioPath = `/projects/${encodeURIComponent(slug)}`;
  projectLinks.push({ label: "View on portfolio", url: portfolioPath, icon: "Globe" });

  if (p.externalUrl?.trim()) {
    const url = p.externalUrl.trim();
    const icon = url.includes("github.com") ? ("Github" as const) : ("ExternalLink" as const);
    const label = url.includes("github.com") ? "Repository" : "External";
    projectLinks.push({ label, url, icon });
  }

  if (p.iframeUrl?.trim()) {
    const url = extractUrlFromEmbed(p.iframeUrl).trim();
    if (url && /^https?:\/\//i.test(url)) {
      const label = url.includes("behance") ? "Behance" : "Live preview";
      projectLinks.push({ label, url, icon: "Globe" });
    }
  }

  const deduped: ProjectLink[] = [];
  const seen = new Set<string>();
  for (const link of projectLinks) {
    if (seen.has(link.url)) continue;
    seen.add(link.url);
    deduped.push(link);
  }

  const iframeCandidate = p.iframeUrl?.trim()
    ? extractUrlFromEmbed(p.iframeUrl).trim()
    : "";
  let embedIframeSrc: string | undefined;
  if (
    iframeCandidate &&
    (/behance\.net/i.test(iframeCandidate) || p.type === "BEHANCE")
  ) {
    embedIframeSrc = toBehanceIframeSrc(iframeCandidate);
  }

  const media = p.mediaUrl?.trim() || "";
  let mockupImage: string | undefined;
  let videoUrl: string | undefined;
  let threeDModel: string | undefined;

  if (p.mediaType === "VIDEO" && media) {
    if (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(media)) {
      videoUrl = media;
    } else {
      mockupImage = media;
    }
  } else if (p.mediaType === "MODEL" && media) {
    if (/\.glb(\?|$)/i.test(media)) {
      threeDModel = media;
    } else {
      mockupImage = media;
    }
  } else if (media) {
    mockupImage = media;
  }

  return {
    type: "project",
    linkedProjectId: p.id,
    title: p.title,
    description: p.description?.trim() || "",
    mockupImage,
    embedIframeSrc,
    videoUrl,
    threeDModel,
    techStack: [...(p.tags || [])],
    projectLinks: deduped,
    bgColor: p.dominantColor || undefined,
  };
}

export function mapBehanceShowcaseEmbedToServiceContent(
  embed: BehanceShowcaseEmbed
): ServiceContent {
  const rawSrc = extractUrlFromEmbed(embed.src).trim();
  const embedIframeSrc = toBehanceIframeSrc(rawSrc || embed.src);

  const projectLinks: ProjectLink[] = [];
  if (rawSrc && /^https?:\/\//i.test(rawSrc)) {
    projectLinks.push({
      label: "Behance",
      url: rawSrc,
      icon: "ExternalLink",
    });
  }

  return {
    type: "project",
    linkedProjectId: `${SERVICE_LINK_BEHANCE_PREFIX}${embed.id}`,
    title: embed.title?.trim() || "Behance project",
    description: "",
    embedIframeSrc,
    projectLinks,
    techStack: ["Behance"],
  };
}
