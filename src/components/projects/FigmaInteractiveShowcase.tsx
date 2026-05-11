"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Monitor, 
  MousePointer2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { IconArrowRight } from '@tabler/icons-react';

interface FigmaProject {
  id: string;
  title: string;
  description: string;
  url: string;
  coverImage: string;
  tags: string[];
}

interface FigmaInteractiveShowcaseProps {
  projects: FigmaProject[];
}

export function FigmaInteractiveShowcase({ projects }: FigmaInteractiveShowcaseProps) {
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  const [readyIds, setReadyIds] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const featuredProject = projects[0];
  const gridProjects = projects.slice(1);

  // Automatically load the featured project preview on mount
  React.useEffect(() => {
    if (featuredProject?.id) {
      setLoadedIds(prev => new Set(prev).add(featuredProject.id));
    }
  }, [featuredProject?.id]);

  const toEmbedUrl = (sourceUrl: string) => {
    return `https://www.figma.com/embed?embed_host=portfolio&url=${encodeURIComponent(sourceUrl)}`;
  };

  const handleLoad = (id: string) => {
    setLoadedIds(prev => new Set(prev).add(id));
  };

  const FigmaSkeleton = () => (
    <div className="absolute inset-0 bg-zinc-50 flex overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-16 md:w-20 border-r border-zinc-200 flex flex-col items-center py-6 gap-6 shrink-0">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-lg bg-zinc-200 animate-pulse" />
        ))}
      </div>
      
      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-12 border-b border-zinc-200 flex items-center px-6 gap-4">
          <div className="w-32 h-4 bg-zinc-200 rounded animate-pulse" />
          <div className="ml-auto flex gap-2">
            <div className="w-10 h-10 rounded-full bg-zinc-200 animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-zinc-200 animate-pulse" />
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 p-8 grid grid-cols-12 gap-6">
          <div className="col-span-8 flex flex-col gap-6">
            <div className="w-full h-48 bg-zinc-200/60 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full h-32 bg-zinc-200/60 rounded-2xl animate-pulse" />
              <div className="w-full h-32 bg-zinc-200/60 rounded-2xl animate-pulse" />
            </div>
          </div>
          <div className="col-span-4 bg-zinc-200/40 rounded-2xl animate-pulse" />
        </div>
      </div>

      {/* Loading Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-blue-600"
              />
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Initializing Preview</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-20 text-left">
      {/* Featured Main Card */}
      {featuredProject && (
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative w-full max-w-7xl overflow-hidden rounded-[20px] md:rounded-[40px] border border-black/10 bg-white p-2 md:p-4 shadow-3xl transition-all hover:bg-zinc-50/50"
          >
            <div className="relative aspect-[16/10] md:aspect-[16/7] w-full overflow-hidden rounded-[14px] md:rounded-[32px] border border-black/5 bg-zinc-100 shadow-inner">
              <AnimatePresence mode="wait">
                {isMobile ? (
                  /* Mobile: Static cover image with direct link, no iframe */
                  <motion.a
                    key="mobile-cover"
                    href={featuredProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 group/facade"
                  >
                    <img 
                      src={featuredProject.coverImage} 
                      className="h-full w-full object-cover"
                      alt={featuredProject.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <Monitor size={14} className="text-blue-600" />
                      <span className="text-[11px] font-bold text-zinc-800">View Live Preview</span>
                    </div>
                  </motion.a>
                ) : !loadedIds.has(featuredProject.id) ? (
                  <motion.div
                    key="cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 cursor-pointer group/facade"
                    onClick={() => handleLoad(featuredProject.id)}
                  >
                    <img 
                      src={featuredProject.coverImage} 
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover/facade:scale-105"
                      alt={featuredProject.title}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/facade:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2.5 shadow-2xl scale-95 group-hover/facade:scale-100 transition-transform">
                        <MousePointer2 size={18} className="text-blue-600" />
                        <span className="text-sm font-bold text-zinc-900">Explore Interactive Prototype</span>
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
                      src={toEmbedUrl(featuredProject.url)} 
                      className="absolute inset-0 h-full w-full border-0" 
                      allowFullScreen 
                      loading="lazy"
                      onLoad={() => setReadyIds(prev => new Set(prev).add(featuredProject.id))}
                    />
                    {!readyIds.has(featuredProject.id) && <FigmaSkeleton />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 md:mt-8 px-3 md:px-6 pb-4 md:pb-6">
              <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                <span className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[8px] md:text-[9px] font-bold uppercase tracking-widest border border-blue-100">
                  <Sparkles size={10} className="animate-pulse md:hidden" />
                  <Sparkles size={12} className="animate-pulse hidden md:inline" /> Featured
                </span>
                {featuredProject.tags.map(tag => (
                  <span key={tag} className="px-2 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 rounded-lg border border-zinc-100">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="max-w-4xl">
                <h3 className="text-lg md:text-3xl font-bold text-zinc-900 tracking-tight group-hover:text-[#1f5fff] transition-colors">
                  {featuredProject.title}
                </h3>
                <p className="mt-1.5 md:mt-2.5 text-xs md:text-base text-zinc-500 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none">
                  {featuredProject.description}
                </p>
              </div>
              
              <div className="mt-4 md:mt-8 flex items-center justify-between">
                {!isMobile && (
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400">
                    <MousePointer2 size={12} className="animate-bounce text-blue-400" />
                    Interactive Component
                  </div>
                )}
                <a 
                  href={featuredProject.url}
                  target="_blank"
                  className={`inline-flex items-center gap-2 rounded-full bg-[#1f5fff] text-xs font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-[#164ecc] active:scale-95 ${isMobile ? 'px-5 py-2.5 w-full justify-center' : 'px-7 py-3'}`}
                >
                  {isMobile ? 'Open in Figma' : 'View Design System'} <IconArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Secondary Grid (2 Columns) */}
      {gridProjects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {gridProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-[16px] md:rounded-[32px] border border-black/10 bg-white p-2 md:p-3 shadow-2xl transition-all hover:bg-zinc-50/50"
            >
              <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-[12px] md:rounded-[24px] border border-black/5 bg-zinc-100 shadow-inner">
                <AnimatePresence mode="wait">
                  {isMobile ? (
                    /* Mobile: Static cover image with direct link, no iframe */
                    <motion.a
                      key="mobile-cover"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 group/facade"
                    >
                      <img 
                        src={project.coverImage} 
                        className="h-full w-full object-cover"
                        alt={project.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <Monitor size={12} className="text-blue-600" />
                        <span className="text-[10px] font-bold text-zinc-800">View Preview</span>
                      </div>
                    </motion.a>
                  ) : !loadedIds.has(project.id) ? (
                    <motion.div
                      key="cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 cursor-pointer group/facade"
                      onClick={() => handleLoad(project.id)}
                    >
                      <img 
                        src={project.coverImage} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover/facade:scale-105"
                        alt={project.title}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/facade:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full flex items-center gap-2.5 shadow-2xl scale-95 group-hover/facade:scale-100 transition-transform">
                          <MousePointer2 size={18} className="text-blue-600" />
                          <span className="text-xs font-bold text-zinc-900">Explore Prototype</span>
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
                      {!readyIds.has(project.id) && <FigmaSkeleton />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="mt-3 md:mt-6 px-2.5 md:px-4 pb-3 md:pb-6 text-left">
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
                  {project.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 md:px-2 py-0.5 text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 rounded border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-base md:text-2xl font-bold text-zinc-900 group-hover:text-[#1f5fff] transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="mt-3 md:mt-6 flex items-center justify-between">
                  {isMobile ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#1f5fff] px-5 py-2 text-[11px] font-bold text-white shadow-lg transition-all active:scale-95 w-full justify-center"
                    >
                      Open in Figma <IconArrowRight size={13} />
                    </a>
                  ) : (
                    <>
                      <span 
                        className="inline-flex items-center gap-2 rounded-full bg-[#1f5fff] px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#164ecc] hover:shadow-xl active:scale-95 cursor-pointer"
                        onClick={() => handleLoad(project.id)}
                      >
                        {loadedIds.has(project.id) ? 'Interact Now' : 'Load Project'} <IconArrowRight size={14} />
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400">
                        <MousePointer2 size={12} className="animate-bounce text-blue-400" />
                        Interactive
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
