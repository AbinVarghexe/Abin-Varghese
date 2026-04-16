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
  IconExternalLink,
  IconArrowRight,
} from '@tabler/icons-react';
import type { WorkspaceProject } from '@/lib/github-projects';
import { homePageDesignSystem } from '@/lib/home-page-design-system';
import PinCard from '@/components/pinterest/PinCard';
import { pinterestPins, type PinterestPin } from '@/lib/pinterest-content';
import ProjectPreviewImage from '@/components/projects/ProjectPreviewImage';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectGalleryCard from './ProjectGalleryCard';

export type WorkspaceFilter = 'coding' | 'designing';

const BEHANCE_PROJECTS = [
  {
    id: "behance-1",
    url: "https://www.behance.net/embed/project/238218229?ilo0=1",
    title: "Featured Brand Identity",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=2071",
    link: "https://www.behance.net/gallery/238218229/Project-Title"
  },
  {
    id: "behance-2",
    url: "https://www.behance.net/embed/project/238218229?ilo0=1", 
    title: "Visual Identity Study",
    coverImage: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=2070",
    link: "#"
  },
  {
    id: "behance-3",
    url: "https://www.behance.net/embed/project/238218229?ilo0=1", 
    title: "Kinetic Typography",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2064",
    link: "#"
  },
  {
    id: "behance-4",
    url: "https://www.behance.net/embed/project/238218229?ilo0=1", 
    title: "UI Design Exploration",
    coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=2070",
    link: "#"
  }
];

const FIGMA_PROJECTS = [
  {
    id: "figma-deal-six",
    title: "DEALSIX Platform",
    description: "A comprehensive digital ecosystem for logistics and commerce management. This design system focuses on high-density information architecture and clean user flows.",
    url: "https://www.figma.com/design/UkvEzHwcZ8SHSIqmsOK1KE/DEALSIX?node-id=11-3075&t=NNUTESDtBLn3Vgun-1",
    coverImage: "https://images.unsplash.com/photo-1551288049-bbbda5366a71?auto=format&fit=crop&q=80&w=2070",
    tags: ["UI/UX Evolution", "Design System", "Logistics", "B2B Dashboard"]
  }
];

interface WorkspaceProjectsSectionProps {
  projects: WorkspaceProject[];
  sourceUrl: string;
  workspace: WorkspaceFilter;
}

const CARD_RATIO = 'h-full w-full';

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

const DESIGN_CATEGORY_ICONS = {
  'All': LayoutGrid,
  'Graphic design': Palette,
  'Web Design': Monitor,
  'Motion Graphics': Video,
  'VFX & 3D Animation': Box,
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
        <div key={project.id} className={`${getTileClass(index)} h-full overflow-hidden`}>
          <WorkspaceProjectCard project={project} index={index} />
        </div>
      ))}
    </div>
  );
}

export function DesigningWorkspaceLayout({ projects }: { projects: any[] }) {
  const [activeTab, setActiveTab] = useState<DesignCategory>('All');
  const [loadedFigmaIds, setLoadedFigmaIds] = useState<Set<string>>(new Set());
  const [loadedBehanceIds, setLoadedBehanceIds] = useState<Set<string>>(new Set());
  const [readyIds, setReadyIds] = useState<Set<string>>(new Set());
  const design = homePageDesignSystem;

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

    const behancePins = BEHANCE_PROJECTS.map((project, index) => ({
      id: `virtual-behance-${project.id}`,
      href: project.link,
      pin: {
        id: project.id,
        title: project.title,
        description: "Featured Case Study",
        mediaType: 'image' as const,
        mediaPath: project.coverImage,
        board: 'Case Studies',
        author: 'Behance',
        tags: ['branding', 'case-study'],
        dominantColor: '#0057ff',
        previewHeight: PROJECT_PIN_HEIGHTS[(index + 1) % PROJECT_PIN_HEIGHTS.length],
        likes: 950,
      }
    }));

    const figmaPins = FIGMA_PROJECTS.map((project, index) => ({
      id: `virtual-figma-${project.id}`,
      href: project.url,
      pin: {
        id: project.id,
        title: project.title,
        description: project.description,
        mediaType: 'image' as const,
        mediaPath: project.coverImage,
        board: 'Web Design',
        author: 'Figma',
        tags: project.tags,
        dominantColor: '#1f5fff',
        previewHeight: PROJECT_PIN_HEIGHTS[(index + 2) % PROJECT_PIN_HEIGHTS.length],
        likes: 1100,
      }
    }));

    const visualPins = pinterestPins.map((pin) => ({
      id: `pin-${pin.id}`,
      href: `/pinterest/${pin.id}?${DESIGN_RETURN_QUERY}`,
      pin,
    }));

    const mixed: Array<{ id: string; href: string; pin: PinterestPin }> = [];
    const sources = [visualPins, projectPins, figmaPins, behancePins];
    const maxLen = Math.max(...sources.map(s => s.length));

    for (let i = 0; i < maxLen; i++) {
      sources.forEach(source => {
        if (source[i]) mixed.push(source[i]);
      });
    }

    return mixed;
  }, [projects]);

  const filteredFeedItems = useMemo(() => {
    if (activeTab === 'All') {
      return feedItems;
    }
    return feedItems.filter((item) => matchesDesignCategory(item.pin, activeTab));
  }, [feedItems, activeTab]);


  const itemsBeforeBehance = filteredFeedItems.slice(0, 20);
  const showBehance = activeTab === 'Graphic design' && itemsBeforeBehance.length >= 20;
  
  const isPinterestLayout = [
    'All',
    'Graphic design', 
    'Motion Graphics', 
    'VFX & 3D Animation'
  ].includes(activeTab);

  const isWebDesignLayout = activeTab === 'Web Design';

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-scroll {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-scroll:hover {
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
            Browse UI/UX, motion, visual effects, video, and 3D references through a curated design feed.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-12 mb-16 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-zinc-100/80 p-1.5 rounded-lg border border-black/[0.03]">
          {DESIGN_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-5 py-2 text-[14px] font-medium rounded-md transition-all duration-300 ease-out ${
                activeTab === category 
                  ? "bg-white text-[#1f5fff] shadow-[0_2px_10px_rgba(0,0,0,0.06)]" 
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
            {isWebDesignLayout ? (
              <div className="flex flex-col gap-24">
                {FIGMA_PROJECTS.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                    className="group relative overflow-hidden rounded-[40px] border border-black/10 bg-white p-4 shadow-3xl transition-all hover:bg-zinc-50/50"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[32px] border border-black/5 bg-zinc-100 shadow-inner">
                      <AnimatePresence mode="wait">
                        {!loadedFigmaIds.has(project.id) ? (
                          <motion.div
                            key="cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 cursor-pointer group/facade"
                            onClick={() => setLoadedFigmaIds(prev => new Set(prev).add(project.id))}
                          >
                            <img 
                              src={project.coverImage} 
                              className="h-full w-full object-cover transition-transform duration-700 group-hover/facade:scale-105"
                              alt={project.title}
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/facade:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl scale-95 group-hover/facade:scale-100 transition-transform">
                                <MousePointer2 size={20} className="text-blue-600" />
                                <span className="text-sm font-bold text-zinc-900">Click to Explore Prototype</span>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="iframe"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-zinc-50"
                          >
                            <iframe 
                              src={toEmbedUrl(project.url)} 
                              className="absolute inset-0 h-full w-full border-0" 
                              allowFullScreen 
                              loading="lazy"
                              onLoad={() => setReadyIds(prev => new Set(prev).add(project.id))}
                            />
                            {/* Loading State Facade */}
                            {!readyIds.has(project.id) && (
                              <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-zinc-50/50 backdrop-blur-[2px] animate-pulse">
                                <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Loading Figma...</div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="mt-10 px-6 pb-8 text-left">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 rounded-md border border-blue-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-bold text-zinc-900 group-hover:text-[#1f5fff] transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-lg text-zinc-500 max-w-2xl leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="mt-8 flex items-center gap-4">
                        <a 
                          href={project.url}
                          target="_blank"
                          className="inline-flex items-center gap-2 rounded-full bg-[#1f5fff] px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-[#164ecc] hover:shadow-2xl active:scale-95"
                        >
                          View Full Design <IconArrowRight size={18} />
                        </a>
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                          <MousePointer2 size={14} className="animate-bounce" />
                          Interactive Prototype
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={isPinterestLayout ? "columns-2 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 max-w-[1400px] mx-auto" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 md:gap-y-32"}>
                <AnimatePresence mode="popLayout">
                  {itemsBeforeBehance.map((item, index) => (
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

          {/* Horizontal Behance Showcase Section */}
          <AnimatePresence>
            {showBehance && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-y border-black/5 bg-zinc-50/50 py-32"
                style={{ clipPath: 'inset(0 0 0 0)' }}
              >
                <div className="mb-20 text-center">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0057ff]/10 text-[#0057ff] text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                    <IconBrandBehance size={14} /> Global Portfolio
                  </span>
                  <h3 className="mt-4 text-4xl font-bold text-zinc-900">Behance Case Studies</h3>
                  <div className="mt-2 text-zinc-500">A continuous showcase of high-fidelity project explorations</div>
                </div>

                <div className="relative w-full overflow-hidden">
                  <div className="flex w-fit animate-marquee-scroll gap-12 px-12 py-10" style={{ animationDuration: '45s' }}>
                    {/* First Loop */}
                    {BEHANCE_PROJECTS.map((project, idx) => (
                      <div 
                        key={`${project.id}-loop1`}
                        className="group flex-shrink-0 w-[680px] overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl transition-all hover:scale-[1.02] hover:shadow-3xl"
                      >
                        <div className="flex items-center justify-between border-b border-black/5 bg-zinc-50/50 px-8 py-5">
                          <div className="truncate text-base font-bold text-zinc-900">{project.title}</div>
                          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 transition-colors group-hover:text-blue-600">
                            {idx === 0 || loadedBehanceIds.has(project.id) ? 'View Project' : 'Explore Case Study'} <IconExternalLink size={16} />
                          </div>
                        </div>
                        <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden">
                          <AnimatePresence mode="wait">
                            {idx === 0 || loadedBehanceIds.has(project.id) ? (
                              <motion.div
                                key="iframe"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0"
                              >
                                <iframe 
                                  src={project.url} 
                                  className="absolute inset-0 h-full w-full border-0 pointer-events-none"
                                  loading="lazy"
                                  onLoad={() => setReadyIds(prev => new Set(prev).add(project.id))}
                                />
                                {!readyIds.has(project.id) && (
                                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-zinc-50/50 backdrop-blur-[2px] animate-pulse">
                                    <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Loading...</div>
                                  </div>
                                )}
                                <a 
                                  href={project.link} 
                                  target="_blank" 
                                  className="absolute inset-0 z-10" 
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 cursor-pointer group/behance-facade"
                                onClick={() => setLoadedBehanceIds(prev => new Set(prev).add(project.id))}
                              >
                                <img 
                                  src={project.coverImage} 
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover/behance-facade:scale-105"
                                  alt={project.title}
                                />
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover/behance-facade:opacity-100 transition-opacity duration-300">
                                  <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl">
                                    <Sparkles size={16} className="text-blue-600 animate-pulse" />
                                    <span className="text-sm font-bold text-zinc-900">Unlock Case Study</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))}
                    {/* Second Loop for seamless transition */}
                    {BEHANCE_PROJECTS.map((project, idx) => (
                      <div 
                        key={`${project.id}-loop2`}
                        className="group flex-shrink-0 w-[680px] overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl transition-all hover:scale-[1.02] hover:shadow-3xl"
                      >
                        <div className="flex items-center justify-between border-b border-black/5 bg-zinc-50/50 px-8 py-5">
                          <div className="truncate text-base font-bold text-zinc-900">{project.title}</div>
                          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 transition-colors group-hover:text-blue-600">
                            {idx === 0 || loadedBehanceIds.has(project.id) ? 'View Project' : 'Explore Case Study'} <IconExternalLink size={16} />
                          </div>
                        </div>
                        <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden">
                          <AnimatePresence mode="wait">
                            {idx === 0 || loadedBehanceIds.has(project.id) ? (
                              <motion.div
                                key="iframe"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0"
                              >
                                <iframe 
                                  src={project.url} 
                                  className="absolute inset-0 h-full w-full border-0 pointer-events-none"
                                  loading="lazy"
                                  onLoad={() => setReadyIds(prev => new Set(prev).add(project.id))}
                                />
                                {!readyIds.has(project.id) && (
                                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-zinc-50/50 backdrop-blur-[2px] animate-pulse">
                                    <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Loading...</div>
                                  </div>
                                )}
                                <a 
                                  href={project.link} 
                                  target="_blank" 
                                  className="absolute inset-0 z-10" 
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 cursor-pointer group/behance-facade"
                                onClick={() => setLoadedBehanceIds(prev => new Set(prev).add(project.id))}
                              >
                                <img 
                                  src={project.coverImage} 
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover/behance-facade:scale-105"
                                  alt={project.title}
                                />
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover/behance-facade:opacity-100 transition-opacity duration-300">
                                  <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl">
                                    <Sparkles size={16} className="text-blue-600 animate-pulse" />
                                    <span className="text-sm font-bold text-zinc-900">Unlock Case Study</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button section removed */}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Portfolio version text removed */}
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