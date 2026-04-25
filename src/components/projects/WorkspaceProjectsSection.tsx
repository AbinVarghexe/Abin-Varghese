"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Github,
  Globe,
  LayoutGrid,
} from 'lucide-react';
import {
  IconBrandBehance,
  IconBrandDribbble,
  IconBrandPinterest,
} from '@tabler/icons-react';
import type { WorkspaceProject } from '@/lib/github-projects';
import { homePageDesignSystem } from '@/lib/home-page-design-system';
import PinCard from '@/components/pinterest/PinCard';
import type { PinterestPin } from '@/lib/pinterest-content';
import ProjectPreviewImage from '@/components/projects/ProjectPreviewImage';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectGalleryCard from './ProjectGalleryCard';
import CodingMarqueeShowcase from './CodingMarqueeShowcase';
import TechStackMarquee from './TechStackMarquee';
import { FigmaInteractiveShowcase } from './FigmaInteractiveShowcase';

export type WorkspaceFilter = 'coding' | 'designing';

interface WorkspaceProjectsSectionProps {
  projects: WorkspaceProject[];
  sourceUrl: string;
  workspace: WorkspaceFilter;
}

const CARD_RATIO = 'h-full w-full';

const PROJECT_PIN_HEIGHTS = [360, 420, 340, 390, 440, 320];
const DESIGN_RETURN_QUERY = 'from=projects&workspace=designing';

type DesignCategory =
  | 'All'
  | 'Graphic design'
  | 'Web Design'
  | 'Motion Graphics'
  | 'VFX & 3D Animation';

const DESIGN_CATEGORIES: DesignCategory[] = [
  'All',
  'Graphic design',
  'Web Design',
  'Motion Graphics',
  'VFX & 3D Animation',
];

function toConcreteDesignCategory(
  value: string | null | undefined
): Exclude<DesignCategory, 'All'> | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'graphic design') {
    return 'Graphic design';
  }

  if (normalized === 'web design') {
    return 'Web Design';
  }

  if (normalized === 'motion graphics') {
    return 'Motion Graphics';
  }

  if (normalized === 'vfx & 3d animation') {
    return 'VFX & 3D Animation';
  }

  return null;
}

function isConcreteDesignCategory(value: string | null | undefined): value is Exclude<DesignCategory, 'All'> {
  return toConcreteDesignCategory(value) !== null;
}

function normalizeDesignCategory(
  category: string | null | undefined,
  type: WorkspaceProject['type'],
  mediaType: WorkspaceProject['mediaType'],
  tags: string[] = [],
  fallbackText = ''
): DesignCategory {
  const explicitCategory = toConcreteDesignCategory(category);

  if (explicitCategory) {
    return explicitCategory;
  }

  if (type === 'FIGMA') {
    return 'Web Design';
  }

  if (type === 'PINTEREST' && mediaType === 'MODEL') {
    return 'VFX & 3D Animation';
  }

  if (type === 'PINTEREST' && mediaType === 'VIDEO') {
    return 'Motion Graphics';
  }

  const fingerprint = `${category ?? ''} ${tags.join(' ')} ${fallbackText}`.toLowerCase();

  if (/graphic|branding|poster|logo|collage|editorial|print|typography/.test(fingerprint)) {
    return 'Graphic design';
  }

  if (/motion|animation|kinetic|after effects|lottie|reel/.test(fingerprint)) {
    return 'Motion Graphics';
  }

  if (/3d|vfx|visual effect|render|model|blender|houdini|maya|cinematic/.test(fingerprint)) {
    return 'VFX & 3D Animation';
  }

  if (/web design|ui|ux|dashboard|website|landing|interface|design system|prototype|app/.test(fingerprint)) {
    return 'Web Design';
  }

  return 'Web Design';
}

function matchesDesignCategory(pin: PinterestPin, category: DesignCategory) {
  if (category === 'All') {
    return true;
  }

  if (isConcreteDesignCategory(pin.board)) {
    return pin.board === category;
  }

  const fingerprint = `${pin.title} ${pin.description} ${pin.board} ${pin.tags.join(' ')}`.toLowerCase();

  switch (category) {
    case 'Graphic design':
      return pin.mediaType === 'image' && /(graphic|branding|logo|collage|poster|typography|visual language)/.test(fingerprint);
    case 'Web Design':
      return /(ui|ux|dashboard|component|design system|interface|app|prototype|wireframe|web|website|landing|frontend|ecommerce|cms|usability|user flow|journey|interaction)/.test(fingerprint);
    case 'VFX & 3D Animation':
      return (pin.mediaType === 'video' || pin.mediaType === 'model') && /(3d|model|render|mech|bot|geometry|blender|c4d|houdini|octane|vfx|visual effect|cinematic|compositing|atmosphere|effects|video|editing|simulation|particle|explosion|smoke|fire|nuke|maya)/.test(fingerprint);
    case 'Motion Graphics':
      return pin.mediaType === 'video' && /(motion|animation|kinetic|transition|graphics|reel|loop|after effects|lottie)/.test(fingerprint);
    default:
      return true;
  }
}

function getInteractiveProjectUrl(project: WorkspaceProject): string | null {
  const candidate = project.liveUrl?.trim() || project.githubUrl?.trim();

  if (!candidate) {
    return null;
  }

  return candidate;
}

function getDesignPinMediaType(
  project: WorkspaceProject,
  normalizedCategory: DesignCategory
): PinterestPin["mediaType"] {
  if (normalizedCategory === 'Web Design' || project.type === 'FIGMA') {
    return 'image';
  }

  if (project.mediaType === 'VIDEO') {
    return 'video';
  }

  if (project.mediaType === 'MODEL') {
    return 'model';
  }

  return 'image';
}

function resolveGithubProfileUrl(sourceUrl: string): string {
  const fallback = 'https://github.com/AbinVarghexe';
  const normalized = sourceUrl.trim();

  if (!normalized) {
    return fallback;
  }

  if (/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(normalized)) {
    return `https://github.com/${normalized}`;
  }

  try {
    const value = normalized.startsWith('http://') || normalized.startsWith('https://')
      ? normalized
      : `https://${normalized}`;
    const parsed = new URL(value);
    const [owner] = parsed.pathname.split('/').filter(Boolean);

    if (parsed.hostname.includes('github.com') && owner) {
      return `https://github.com/${owner}`;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function WorkspaceProjectCard({
  project,
  index,
}: {
  project: WorkspaceProject;
  index?: number;
}) {
  const design = homePageDesignSystem;
  const fallbackSrc = `https://opengraph.githubassets.com/portfolio/${project.owner}/${project.repo}`;

  return (
    <article
      className={`group relative break-inside-avoid overflow-hidden transition-all duration-300 hover:shadow-lg ${CARD_RATIO}`}
      style={{
        borderRadius: design.components.card.base.radius,
        border: design.components.card.base.border,
        background: design.components.card.base.background,
        boxShadow: design.shadows.subtle,
      }}
    >
      <Link
        href={`/projects/${encodeURIComponent(project.slug)}`}
        className="absolute inset-0 z-10 pointer-events-auto"
        aria-label={`Open ${project.title} details`}
      />

      {/* Background Layer: Static preview image */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <ProjectPreviewImage
          src={project.imageUrl}
          fallbackSrc={fallbackSrc}
          alt={`${project.title} project preview`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Content overlays */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="absolute inset-0 z-2 bg-transparent pointer-events-none group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      {/* Hover Floating Details Panel */}
      <div 
        className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-3 p-4 shrink-0 pointer-events-none translate-y-8 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100" 
        style={{ 
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: "1.25rem",
          border: '1.5px solid rgba(255,255,255,0.4)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
         <div className="px-1">
            <h3 
              className="line-clamp-1 text-[16px] font-semibold tracking-tight"
              style={{ color: design.colors.text.primary, fontFamily: design.typography.families.sans }}
            >
              {project.title}
            </h3>
            <p 
              className="line-clamp-1 text-[13px] mt-1"
              style={{ color: design.colors.text.body, fontFamily: design.typography.families.sans }}
            >
              {project.description}
            </p>
         </div>

         {/* Design-System Based Action Row (Chunky, not stretched) */}
         <div className="flex items-center gap-2 mt-1 relative z-30 pointer-events-auto">
            {project.liveUrl && (
              <>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn inline-flex items-center justify-between no-underline transition-transform hover:scale-[1.02]"
                  style={{
                    background: design.gradients.secondaryAction, // Black secondary color
                    borderRadius: design.components.button.base.radius,
                    padding: '6px 6px 6px 14px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                  }}
                  aria-label={`Open ${project.title} live website`}
                >
                  <span 
                    className="text-[12px] tracking-wide mr-2"
                    style={{ 
                      color: "#ffffff", 
                      fontFamily: design.typography.families.sans,
                      fontWeight: 500
                    }}
                  >
                    Live
                  </span>
                  <span 
                    className="flex items-center justify-center rounded-full shrink-0 transition-transform duration-300 group-hover/btn:-rotate-12" 
                    style={{ 
                      width: '28px', 
                      height: '28px',
                      background: 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <Globe 
                      className="w-4 h-4" 
                      style={{ color: "#ffffff" }} 
                      strokeWidth={2} 
                    />
                  </span>
                </a>
              </>
            )}
            
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="group/btn inline-flex items-center justify-between no-underline transition-transform hover:scale-[1.02]"
              style={{
                background: design.components.button.secondary.background,
                border: '1.5px solid #e4e4e7',
                borderRadius: design.components.button.base.radius,
                padding: '4.5px 4.5px 4.5px 12.5px', // adjusted for border
                boxShadow: design.components.button.secondary.shadow,
              }}
              aria-label={`Open ${project.title} GitHub repository`}
            >
              <span 
                className="text-[12px] tracking-wide mr-2"
                style={{ 
                  color: design.components.button.secondary.text, 
                  fontFamily: design.typography.families.sans,
                  fontWeight: 500
                }}
              >
                Repo
              </span>
              <span 
                className="flex items-center justify-center rounded-full shrink-0 transition-transform duration-300 group-hover/btn:rotate-12" 
                style={{ 
                  width: '28px', 
                  height: '28px',
                  background: design.components.button.secondary.iconBackground,
                }}
              >
                <Github 
                  className="w-4 h-4" 
                  style={{ color: design.components.button.secondary.iconColor }} 
                  strokeWidth={2} 
                />
              </span>
            </a>
         </div>
      </div>
    </article>
  );
}

function CodingWorkspaceLayout({ projects }: { projects: WorkspaceProject[] }) {
  if (projects.length === 0) {
    return null;
  }

  const bentoTileClasses = [
    'col-span-12 sm:col-span-12 md:col-span-8 row-span-2',
    'col-span-12 sm:col-span-6 md:col-span-4 row-span-1',
    'col-span-12 sm:col-span-6 md:col-span-4 row-span-1',
    'col-span-12 sm:col-span-6 md:col-span-4 row-span-1',
    'col-span-12 sm:col-span-6 md:col-span-4 row-span-1',
    'col-span-12 sm:col-span-12 md:col-span-4 row-span-1',
  ];

  const getTileClass = (index: number) => {
    if (index < bentoTileClasses.length) {
      return bentoTileClasses[index];
    }

    const fallbackPattern = [
      'col-span-12 sm:col-span-6 md:col-span-4 row-span-1',
      'col-span-12 sm:col-span-6 md:col-span-4 row-span-1',
      'col-span-12 sm:col-span-12 md:col-span-4 row-span-1',
    ];

    return fallbackPattern[(index - bentoTileClasses.length) % fallbackPattern.length];
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Bento Grid */}
      <div className="px-4 md:px-8 mx-auto max-w-7xl w-full">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-zinc-600 text-[10px] font-bold uppercase tracking-widest border border-black/10">
            <LayoutGrid size={14} /> Full Gallery
          </span>
          <h3 className="mt-4 text-3xl md:text-4xl font-bold text-zinc-900">
            Project Directory
          </h3>
          <p className="mt-2 text-zinc-500 max-w-lg mx-auto">
            A comprehensive library of my development journey, including experiments, 
            tooling, and production-ready frontend components.
          </p>
        </div>
        <div className="grid grid-cols-12 gap-4 auto-rows-[210px] md:auto-rows-[220px] xl:auto-rows-[240px]">
          {projects.map((project, index) => (
            <div key={project.id} className={`${getTileClass(index)} h-full overflow-hidden`}>
              <WorkspaceProjectCard project={project} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DesigningWorkspaceLayout({ projects }: { projects: WorkspaceProject[] }) {
  const [activeTab, setActiveTab] = useState<DesignCategory>('All');
  const design = homePageDesignSystem;
  const uploadedProjects = useMemo(
    () => projects.filter((project) => project.isFromDb && Boolean(project.imageUrl)),
    [projects]
  );

  const feedItems = useMemo(() => {
    return uploadedProjects.map((project, index) => {
      const normalizedCategory = normalizeDesignCategory(
        project.category,
        project.type,
        project.mediaType,
        project.tags,
        `${project.title} ${project.description}`
      );
      const normalizedMediaType = getDesignPinMediaType(project, normalizedCategory);
      const pin: PinterestPin = {
        id: `project-${project.id}`,
        title: project.title,
        description: project.description,
        mediaType: normalizedMediaType,
        mediaPath: project.imageUrl,
        board: normalizedCategory,
        author: project.owner,
        tags: project.tags.length ? [...project.tags, normalizedCategory] : ['repository', 'design', normalizedCategory],
        dominantColor: '#111827',
        previewHeight: PROJECT_PIN_HEIGHTS[index % PROJECT_PIN_HEIGHTS.length],
        likes: Math.max(project.stars * 30, 120),
      };

      return {
        id: `repo-${project.id}`,
        href: `/projects/${encodeURIComponent(project.slug)}?${DESIGN_RETURN_QUERY}`,
        pin,
      };
    });
  }, [uploadedProjects]);

  const filteredFeedItems = useMemo(() => {
    if (activeTab === 'All') {
      return feedItems.filter((item) => item.pin.board !== 'Web Design');
    }
    return feedItems.filter((item) => matchesDesignCategory(item.pin, activeTab));
  }, [feedItems, activeTab]);

  const interactiveWebProjects = useMemo(() => {
    return uploadedProjects
      .filter((project) => normalizeDesignCategory(
        project.category,
        project.type,
        project.mediaType,
        project.tags,
        `${project.title} ${project.description}`
      ) === 'Web Design')
      .sort((a, b) => {
        const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featuredDelta !== 0) {
          return featuredDelta;
        }

        return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      })
      .map((project) => {
        const url = getInteractiveProjectUrl(project);

        if (!url) {
          return null;
        }

        return {
          id: project.id,
          title: project.title,
          description: project.description,
          url,
          coverImage: project.imageUrl,
          tags: project.tags.length > 0 ? project.tags : ['Web Design'],
        };
      })
      .filter((project): project is NonNullable<typeof project> => Boolean(project));
  }, [uploadedProjects]);
  
  const isPinterestLayout = [
    'All',
    'Graphic design', 
    'Motion Graphics', 
    'VFX & 3D Animation'
  ].includes(activeTab);
  const showInteractiveWebDesign = activeTab === 'Web Design' && interactiveWebProjects.length > 0;

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-scroll {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
        .animate-marquee-scroll-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
        .animate-marquee-scroll-reverse:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="relative mt-4">
        {/* ... existing header logic ... */}
        <div className="absolute right-1 top-1 hidden items-center gap-2 sm:flex">
          <a
            href="https://www.behance.net/toabinvarghese"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Behance"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition"
            style={{
              borderColor: design.colors.border.subtle,
              background: design.colors.surfaceSoft,
              color: design.colors.text.secondary,
            }}
          >
            <IconBrandBehance size={18} stroke={1.8} />
          </a>
          <a
            href="https://www.pinterest.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Pinterest"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition"
            style={{
              borderColor: design.colors.border.subtle,
              background: design.colors.surfaceSoft,
              color: design.colors.text.secondary,
            }}
          >
            <IconBrandPinterest size={18} stroke={1.8} />
          </a>
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Dribbble"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition"
            style={{
              borderColor: design.colors.border.subtle,
              background: design.colors.surfaceSoft,
              color: design.colors.text.secondary,
            }}
          >
            <IconBrandDribbble size={18} stroke={1.8} />
          </a>
        </div>

        <div className="mx-auto max-w-4xl px-1 text-center">
          <p className="mb-3 inline-flex rounded-xl border border-black/10 bg-black/3 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60">
            Design Session
          </p>
          <h2 className="text-5xl font-extrabold tracking-tight text-[#0b1034] md:text-7xl">
            Curated <span className="font-serif italic font-medium text-[#1f5fff]">Designs</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-zinc-600 md:text-lg">
            Browse only the design projects you have uploaded from the admin panel, grouped by category.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-12 mb-16 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-zinc-100/80 p-1.5 rounded-full border border-zinc-200">
          {DESIGN_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-7 py-2.5 text-[15px] font-medium rounded-full transition-all duration-300 ease-out ${
                activeTab === category 
                  ? "bg-gradient-to-br from-zinc-900 to-zinc-600 text-white shadow-lg" 
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {category === 'All' ? 'All Boards' : category}
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1 px-1 sm:px-2">
        <div className="pb-16 text-center">
          {/* Main Feed Container */}
          <div className="mx-auto max-w-7xl">
            {showInteractiveWebDesign ? (
              <FigmaInteractiveShowcase projects={interactiveWebProjects} />
            ) : filteredFeedItems.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-black/15 bg-white/70 px-6 py-14 text-center shadow-[0_16px_36px_rgba(10,10,10,0.04)]">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  No Uploaded Projects
                </p>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 md:text-base">
                  This design category is empty right now. Upload a project from the admin panel to have it appear here.
                </p>
              </div>
            ) : (
              <div className={isPinterestLayout ? "columns-2 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 max-w-[1400px] mx-auto" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 md:gap-y-32"}>
                <AnimatePresence mode="popLayout">
                  {filteredFeedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {isPinterestLayout ? (
                        <PinCard pin={item.pin} href={item.href} index={index} />
                      ) : (
                        <ProjectGalleryCard
                          title={item.pin.title}
                          category={item.pin.board}
                          image={item.pin.mediaPath}
                          link={item.href}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceProjectsSection({
  projects,
  sourceUrl,
  workspace,
}: WorkspaceProjectsSectionProps) {
  const githubProfileUrl = useMemo(() => resolveGithubProfileUrl(sourceUrl), [sourceUrl]);

  const containerClass =
    workspace === 'coding'
      ? 'rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_20px_45px_rgba(10,10,10,0.08)] md:p-8'
      : '';

  const sectionClass =
    workspace === 'coding'
      ? 'w-full py-14 md:py-20'
      : 'w-full py-8 sm:py-12 md:py-16';

  const contentContainerClass =
    workspace === 'coding'
      ? 'mx-auto w-full max-w-[1480px] px-3 md:px-5'
      : 'mx-auto w-full max-w-[1620px] px-2 sm:px-4 md:px-6';

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.workspace === workspace),
    [projects, workspace]
  );

  return (
    <section className={`${sectionClass} relative overflow-hidden`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px)',
            backgroundSize: '120px 100%',
            backgroundPosition: 'center top',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        />
      </div>

      <div className={`relative z-10 ${contentContainerClass}`}>
        {workspace === 'coding' ? (
          <div className="mb-7 flex flex-col items-center gap-5 text-center">
            <div className="space-y-2">
              <p className="inline-flex rounded-xl border border-black/10 bg-black/3 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60">
                Co Project
              </p>
              <h2 className="text-5xl font-extrabold tracking-tight text-[#0b1034] md:text-7xl">
                Curated <span className="font-serif italic font-medium text-[#1f5fff]">Projects</span>
              </h2>
              <p className="mx-auto max-w-2xl text-base text-zinc-600 md:text-lg">
                Explore projects by workspace. Hover each card to quickly open the live site or repository, and click the card to view full project details.
              </p>
            </div>
          </div>
        ) : null}



        <div className="flex flex-col gap-8 md:gap-14">
          {workspace === 'coding' && (
            <div className="flex flex-col gap-6 md:gap-10">
              <CodingMarqueeShowcase projects={filteredProjects} />
              
              <div className="flex flex-col gap-4 md:gap-6">
                <TechStackMarquee />
                
                {/* GitHub CTA Button - Right Aligned */}
                <div className="flex justify-end px-4 md:px-8">
                  <a
                    href={githubProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center no-underline"
                    style={{
                      gap: '10px',
                      background: 'var(--gradient-gray)',
                      border: '1.5px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-full)',
                      padding: '10px 20px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      fontSize: '14px',
                      color: '#fff',
                      textDecoration: 'none',
                      transition: 'all 300ms ease',
                    }}
                    onMouseEnter={(event) => {
                      const element = event.currentTarget as HTMLElement;
                      element.style.boxShadow = '0 12px 32px rgba(0,0,0,0.22)';
                      element.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(event) => {
                      const element = event.currentTarget as HTMLElement;
                      element.style.boxShadow = 'none';
                      element.style.transform = 'translateY(0)';
                    }}
                  >
                    <Github className="h-4 w-4" />
                    <span>View GitHub Profile</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className={containerClass}>
            {workspace === 'coding' ? (
              filteredProjects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-black/20 bg-zinc-50 px-6 py-10 text-center">
                  <p className="text-sm text-zinc-600 md:text-base">
                    No projects found in this workspace from your GitHub source.
                  </p>
                </div>
              ) : (
                <CodingWorkspaceLayout projects={filteredProjects.filter((p) => !p.isFromDb)} />
              )
            ) : (
              <DesigningWorkspaceLayout projects={filteredProjects} />
            )}

            {workspace === 'coding' && false ? (
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-6 text-xs text-zinc-500 md:text-sm">
                <span>Data source: {sourceUrl}</span>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-black/20 px-3 py-1.5 font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  Open GitHub source
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </section>
  );
}
