"use client";

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Box,
  Film,
  Github,
  Globe,
  LayoutGrid,
  Monitor,
  Palette,
  Sparkles,
  Video,
  MousePointer2,
} from 'lucide-react';
import {
  IconBrandBehance,
  IconBrandDribbble,
  IconBrandPinterest,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from '@tabler/icons-react';
import type { WorkspaceProject } from '@/lib/github-projects';
import { homePageDesignSystem } from '@/lib/home-page-design-system';
import PinCard from '@/components/pinterest/PinCard';
import { pinterestPins, type PinterestPin } from '@/lib/pinterest-content';
import ProjectPreviewImage from '@/components/projects/ProjectPreviewImage';

export type WorkspaceFilter = 'coding' | 'designing';

interface WorkspaceProjectsSectionProps {
  projects: WorkspaceProject[];
  sourceUrl: string;
  workspace: WorkspaceFilter;
}

const CARD_RATIO = 'aspect-video w-full';

const CARD_HEIGHTS = [
  'h-[220px]',
  'h-[250px]',
  'h-[210px]',
  'h-[280px]',
  'h-[230px]',
  'h-[260px]',
];

const PROJECT_PIN_HEIGHTS = [360, 420, 340, 390, 440, 320];
const DESIGN_RETURN_QUERY = 'from=projects&workspace=designing';

type DesignCategory =
  | 'All'
  | 'Graphic design projects'
  | 'Visual effects projects'
  | 'UI/UX projects'
  | 'Video editing projects'
  | '3D design projects'
  | 'Motion graphics projects';

const DESIGN_CATEGORIES: DesignCategory[] = [
  'All',
  'Graphic design projects',
  'Visual effects projects',
  'UI/UX projects',
  'Video editing projects',
  '3D design projects',
  'Motion graphics projects',
];

const DESIGN_CATEGORY_ICONS = {
  'All': LayoutGrid,
  'Graphic design projects': Palette,
  'Visual effects projects': Sparkles,
  'UI/UX projects': Monitor,
  'Video editing projects': Film,
  '3D design projects': Box,
  'Motion graphics projects': Video,
} as const;

// Public demo links used when project-specific env URLs are not provided.
const DEMO_FIGMA_DESIGN_URL =
  'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File?type=design&node-id=0-1&mode=design';
const DEMO_FIGMA_WEBFLOW_URL =
  'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File?type=design&node-id=0-1&mode=design';

function toEmbedUrl(sourceUrl: string) {
  return `https://www.figma.com/embed?embed_host=portfolio&url=${encodeURIComponent(sourceUrl)}`;
}

function matchesDesignCategory(pin: PinterestPin, category: DesignCategory) {
  if (category === 'All') {
    return true;
  }

  const fingerprint = `${pin.title} ${pin.description} ${pin.board} ${pin.tags.join(' ')}`.toLowerCase();

  switch (category) {
    case 'UI/UX projects':
      return /(ui|ux|dashboard|component|design system|interface|app|prototype|wireframe|web|website|landing|frontend|ecommerce|cms|usability|user flow|journey|interaction)/.test(fingerprint);
    case 'Visual effects projects':
      return /(vfx|visual effect|cinematic|compositing|atmosphere|effects)/.test(fingerprint);
    case 'Video editing projects':
      return pin.mediaType === 'video' || /(video|editing|reel|loop|alpha|motion)/.test(fingerprint);
    case 'Graphic design projects':
      return /(graphic|branding|logo|collage|poster|typography|visual language)/.test(fingerprint);
    case '3D design projects':
      return pin.mediaType === 'model' || /(3d|model|render|mech|bot|geometry)/.test(fingerprint);
    case 'Motion graphics projects':
      return /(motion|animation|kinetic|transition|graphics|reel|loop)/.test(fingerprint);
    default:
      return true;
  }
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
  index: number;
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
    <div className="grid grid-cols-12 gap-4 auto-rows-[210px] md:auto-rows-[220px] xl:auto-rows-[240px]">
      {projects.map((project, index) => (
        <div key={project.id} className={getTileClass(index)}>
          <WorkspaceProjectCard project={project} index={index} />
        </div>
      ))}
    </div>
  );
}

function DesigningWorkspaceLayout({ projects }: { projects: WorkspaceProject[] }) {
  const design = homePageDesignSystem;

  const [selectedCategories, setSelectedCategories] = useState<DesignCategory[]>(['All']);
  const [showFilters, setShowFilters] = useState(true);

  const feedItems = useMemo(() => {
    const projectPins = projects.map((project, index) => {
      const pin: PinterestPin = {
        id: `project-${project.id}`,
        title: project.title,
        description: project.description,
        mediaType: 'image',
        mediaPath: project.imageUrl,
        board: 'Design Repositories',
        author: project.owner,
        tags: project.tags.length ? project.tags : ['repository', 'design'],
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

    const visualPins = pinterestPins.map((pin) => ({
      id: `pin-${pin.id}`,
      href: `/pinterest/${pin.id}?${DESIGN_RETURN_QUERY}`,
      pin,
    }));

    const mixed: Array<{ id: string; href: string; pin: PinterestPin }> = [];
    const limit = Math.max(projectPins.length, visualPins.length);

    for (let index = 0; index < limit; index += 1) {
      if (visualPins[index]) {
        mixed.push(visualPins[index]);
      }
      if (projectPins[index]) {
        mixed.push(projectPins[index]);
      }
    }

    return mixed;
  }, [projects]);

  const filteredFeedItems = useMemo(() => {
    if (selectedCategories.length === 0 || selectedCategories.includes('All')) {
      return feedItems;
    }

    return feedItems.filter((item) =>
      selectedCategories.some((category) => matchesDesignCategory(item.pin, category))
    );
  }, [feedItems, selectedCategories]);

  const chipItems = useMemo(
    () =>
      DESIGN_CATEGORIES.map((category) => ({
        category,
      })),
    []
  );

  const selectedFilterPills = useMemo(
    () => selectedCategories.filter((category) => category !== 'All'),
    [selectedCategories]
  );

  const uiUxEmbedCards = useMemo(() => {
    const primarySource =
      process.env.NEXT_PUBLIC_UIUX_FIGMA_URL ??
      process.env.NEXT_PUBLIC_FIGMA_DESIGN_URL ??
      DEMO_FIGMA_DESIGN_URL;
    const secondarySource =
      process.env.NEXT_PUBLIC_WEB_DESIGN_FIGMA_URL ??
      process.env.NEXT_PUBLIC_UIUX_FIGMA_URL ??
      process.env.NEXT_PUBLIC_FIGMA_DESIGN_URL ??
      DEMO_FIGMA_WEBFLOW_URL;

    return [
      {
        id: 'uiux-primary',
        title: 'UI System Preview',
        description: 'Interactive component and interface structure for UI implementation.',
        sourceUrl: primarySource,
        docsUrl: process.env.NEXT_PUBLIC_UIUX_IMPLEMENTATION_DOCS_URL ?? 'https://www.nngroup.com/articles/',
      },
      {
        id: 'uiux-webflow',
        title: 'Web UX Flow Preview',
        description: 'Web page and interaction flow references for implementation planning.',
        sourceUrl: secondarySource,
        docsUrl: process.env.NEXT_PUBLIC_WEB_IMPLEMENTATION_DOCS_URL ?? 'https://nextjs.org/docs',
      },
    ].map((card) => ({
      ...card,
      embedUrl: toEmbedUrl(card.sourceUrl),
    }));
  }, []);

  const hasUiUxSelected = useMemo(
    () => selectedCategories.includes('UI/UX projects'),
    [selectedCategories]
  );

  const hasNonUiUxSelected = useMemo(
    () => selectedCategories.some((category) => category !== 'All' && category !== 'UI/UX projects'),
    [selectedCategories]
  );

  const showUiUxEmbedSection = useMemo(
    () => hasUiUxSelected && !selectedCategories.includes('All'),
    [hasUiUxSelected, selectedCategories]
  );

  const showUiUxOnlyLayout = useMemo(
    () => showUiUxEmbedSection && !hasNonUiUxSelected,
    [showUiUxEmbedSection, hasNonUiUxSelected]
  );

  const feedItemsBelowUiUx = useMemo(() => {
    if (showUiUxEmbedSection && hasNonUiUxSelected) {
      return filteredFeedItems.filter((item) => !matchesDesignCategory(item.pin, 'UI/UX projects'));
    }

    return filteredFeedItems;
  }, [filteredFeedItems, showUiUxEmbedSection, hasNonUiUxSelected]);

  function toggleCategory(category: DesignCategory) {
    setSelectedCategories((previous) => {
      if (category === 'All') {
        return ['All'];
      }

      const withoutAll = previous.filter((item) => item !== 'All') as DesignCategory[];

      if (withoutAll.includes(category)) {
        const remaining = withoutAll.filter((item) => item !== category) as DesignCategory[];
        return remaining.length > 0 ? remaining : ['All'];
      }

      return [...withoutAll, category] as DesignCategory[];
    });
  }

  function removeCategory(category: DesignCategory) {
    setSelectedCategories((previous) => {
      const remaining = previous.filter((item) => item !== 'All' && item !== category) as DesignCategory[];
      return remaining.length > 0 ? remaining : ['All'];
    });
  }

  return (
    <div>
      <div className="relative mt-4">
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
            Browse UI/UX, motion, visual effects, video, and 3D references through a curated design feed.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:h-[calc(100vh-13rem)] lg:flex-row lg:items-start">
        <aside
          className={`w-full min-w-0 rounded-xl border p-3 transition-[width] duration-300 sm:p-4 lg:sticky lg:top-24 lg:h-fit ${
            showFilters ? 'lg:w-[270px] lg:min-w-[270px]' : 'lg:w-[76px] lg:min-w-[76px]'
          }`}
          style={{
            borderColor: design.colors.border.card,
            background: design.colors.surface,
            boxShadow: design.shadows.subtle,
            borderRadius: '14px',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p
              className={`px-1 text-xs font-semibold uppercase tracking-[0.14em] ${showFilters ? '' : 'lg:hidden'}`}
              style={{
                color: design.colors.text.muted,
                fontFamily: design.typography.families.sans,
              }}
            >
              Filter Boards
            </p>

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition"
              aria-label={showFilters ? 'Hide filters sidebar' : 'Show filters sidebar'}
              title={showFilters ? 'Hide filters sidebar' : 'Show filters sidebar'}
              style={{
                borderColor: design.colors.border.subtle,
                background: design.colors.surfaceSoft,
                color: design.colors.text.primary,
              }}
            >
              {showFilters ? <IconChevronLeft size={20} stroke={1.9} /> : <IconChevronRight size={20} stroke={1.9} />}
            </button>
          </div>

          {showFilters ? (
            <div className="mt-3 space-y-2 lg:max-h-[calc(100vh-20rem)] lg:overflow-y-auto lg:pr-1">
              {chipItems.map((chip) => {
                const isActive = selectedCategories.includes(chip.category);
                const CategoryIcon = DESIGN_CATEGORY_ICONS[chip.category];
                return (
                  <button
                    key={chip.category}
                    type="button"
                    onClick={() => toggleCategory(chip.category)}
                    className="inline-flex w-full items-center gap-2 rounded-xl border px-2 py-2 pr-3 text-left text-sm font-semibold transition"
                    style={{
                      borderColor: isActive ? design.colors.brand.blueSoft : design.colors.border.subtle,
                      background: design.colors.surfaceSoft,
                      color: design.colors.text.secondary,
                      fontFamily: design.typography.families.sans,
                    }}
                  >
                    <span
                      className="inline-flex h-8 w-10 items-center justify-center rounded-md"
                      style={{
                        background: 'transparent',
                        color: isActive ? design.colors.brand.blue : design.colors.text.secondary,
                      }}
                    >
                      <CategoryIcon className="h-4 w-4" />
                    </span>
                    <span className="line-clamp-1">{chip.category}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 space-y-2 lg:max-h-[calc(100vh-20rem)] lg:overflow-y-auto lg:pr-1">
              {chipItems.map((chip) => {
                const isActive = selectedCategories.includes(chip.category);
                const CategoryIcon = DESIGN_CATEGORY_ICONS[chip.category];
                return (
                  <button
                    key={chip.category}
                    type="button"
                    onClick={() => toggleCategory(chip.category)}
                    className="inline-flex w-full items-center justify-center rounded-lg border p-1 transition"
                    aria-label={chip.category}
                    title={chip.category}
                    style={{
                      borderColor: isActive ? design.colors.brand.blueSoft : design.colors.border.subtle,
                      background: design.colors.surfaceSoft,
                      color: design.colors.text.secondary,
                    }}
                  >
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md"
                      style={{
                        background: 'transparent',
                        color: isActive ? design.colors.brand.blue : design.colors.text.secondary,
                      }}
                    >
                      <CategoryIcon className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <div className="min-w-0 flex-1 px-1 sm:px-2 lg:flex lg:h-full lg:flex-col">
          {selectedFilterPills.length > 0 ? (
            <div
              className="z-20 rounded-xl border px-3 py-3 sm:px-4"
              style={{
                borderColor: design.colors.border.card,
                background: design.colors.surface,
                boxShadow: design.shadows.subtle,
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                {selectedFilterPills.map((category) => {
                  const CategoryIcon = DESIGN_CATEGORY_ICONS[category];
                  return (
                    <span
                      key={`selected-${category}`}
                      className="inline-flex items-center gap-2 rounded-full border px-2 py-1 pr-1 text-xs font-semibold sm:text-sm"
                      style={{
                        borderColor: design.colors.border.subtle,
                        background: design.colors.surfaceSoft,
                        color: design.colors.text.secondary,
                      }}
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md" style={{ color: design.colors.brand.blue }}>
                        <CategoryIcon className="h-3.5 w-3.5" />
                      </span>
                      <span>{category}</span>
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        aria-label={`Remove ${category}`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border"
                        style={{
                          borderColor: design.colors.border.subtle,
                          background: design.colors.surface,
                          color: design.colors.text.secondary,
                        }}
                      >
                        <IconX size={14} stroke={2} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-4 pb-6 lg:flex-1 lg:overflow-y-auto lg:pr-1">
            {showUiUxEmbedSection ? (
              <div className="mb-6 grid grid-cols-1 gap-x-4 gap-y-10 xl:grid-cols-2">
                {uiUxEmbedCards.map((card) => (
                  <section
                    key={card.id}
                    className="rounded-xl border px-3 py-3 sm:px-4"
                    style={{
                      borderColor: design.colors.border.card,
                      background: design.colors.surface,
                      boxShadow: design.shadows.subtle,
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="max-w-2xl">
                        <h3
                          className="text-base font-semibold sm:text-lg"
                          style={{
                            color: design.colors.text.primary,
                            fontFamily: design.typography.families.sans,
                          }}
                        >
                          {card.title}
                        </h3>
                        <p
                          className="mt-1 text-xs sm:text-sm"
                          style={{
                            color: design.colors.text.body,
                            fontFamily: design.typography.families.sans,
                          }}
                        >
                          {card.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={card.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm"
                          style={{
                            borderColor: design.colors.border.subtle,
                            background: design.colors.surfaceSoft,
                            color: design.colors.text.secondary,
                          }}
                        >
                          Open Source
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>

                        {card.docsUrl ? (
                          <a
                            href={card.docsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm"
                            style={{
                              borderColor: design.colors.border.subtle,
                              background: design.colors.surfaceSoft,
                              color: design.colors.text.secondary,
                            }}
                          >
                            Documentation
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 aspect-video w-full overflow-hidden" style={{ borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.1)' }}>
                      <iframe
                        title={card.title}
                        src={card.embedUrl}
                        className="h-full w-full bg-white"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </section>
                ))}
              </div>
            ) : null}

            {showUiUxOnlyLayout ? null : (
              <>
                {feedItemsBelowUiUx.length > 0 ? (
                  <div className="columns-2 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                    {feedItemsBelowUiUx.map((item) => (
                      <PinCard key={item.id} pin={item.pin} href={item.href} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-black/20 bg-white/80 px-6 py-10 text-center">
                    <p className="text-sm text-zinc-600 md:text-base">
                      No pins found for {selectedFilterPills.length > 0 ? selectedFilterPills.join(', ') : 'your current selection'}. Try another filter.
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="pt-4 text-center text-xs text-zinc-500">
              End of feed
            </div>
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
      ? 'mx-auto w-full max-w-[1480px] px-3 py-14 md:px-5 md:py-20'
      : 'mx-auto w-full max-w-[1620px] px-2 py-8 sm:px-4 md:px-6 md:py-12';

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

      <div className="relative z-10">
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

        {workspace === 'coding' ? (
          <div className="mb-4 flex justify-end md:mb-5">
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
                padding: '12px 20px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                fontSize: '14px',
                color: '#fff',
                textDecoration: 'none',
                transition: 'box-shadow 300ms ease, transform 200ms ease',
              }}
              onMouseEnter={(event) => {
                const element = event.currentTarget as HTMLElement;
                element.style.boxShadow = '0 14px 36px rgba(0,0,0,0.22)';
                element.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(event) => {
                const element = event.currentTarget as HTMLElement;
                element.style.boxShadow = 'none';
                element.style.transform = 'scale(1)';
              }}
            >
              <Github className="h-5 w-5" />
              <span>View Github</span>
            </a>
          </div>
        ) : null}

        <div className={containerClass}>
          {workspace === 'coding' ? (
            filteredProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-black/20 bg-zinc-50 px-6 py-10 text-center">
                <p className="text-sm text-zinc-600 md:text-base">
                  No projects found in this workspace from your GitHub source.
                </p>
              </div>
            ) : (
              <CodingWorkspaceLayout projects={filteredProjects} />
            )
          ) : (
            <DesigningWorkspaceLayout projects={filteredProjects} />
          )}

          {workspace === 'coding' ? (
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
    </section>
  );
}