"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Github, Monitor, Sparkles } from 'lucide-react';
import { IconExternalLink } from '@tabler/icons-react';
import type { WorkspaceProject } from '@/lib/github-projects';
import ProjectPreviewImage from '@/components/projects/ProjectPreviewImage';

interface CodingMarqueeShowcaseProps {
  projects: WorkspaceProject[];
}

export default function CodingMarqueeShowcase({ projects }: CodingMarqueeShowcaseProps) {
  const [loadedIframeIds, setLoadedIframeIds] = useState<Set<string>>(new Set());
  const [readyIds, setReadyIds] = useState<Set<string>>(new Set());

  if (!projects || projects.length === 0) {
    return null;
  }

  const firstRowProjects = projects.slice(0, Math.ceil(projects.length / 2));
  const secondRowProjects = Math.ceil(projects.length / 2) < projects.length 
    ? projects.slice(Math.ceil(projects.length / 2)) 
    : projects;

  const fillRow = (rowItems: WorkspaceProject[]) => {
    let filled = [...rowItems];
    while (filled.length > 0 && filled.length < 6) {
      filled = [...filled, ...rowItems];
    }
    return filled;
  };

  const row1 = fillRow(firstRowProjects);
  const row2 = fillRow(secondRowProjects);

  const renderProjectCard = (project: WorkspaceProject, idx: number, rowIdx: number) => {
    const key = `${project.id}-row${rowIdx}-${idx}`;
    return (
      <div 
        key={key}
        className="group flex-shrink-0 w-[320px] md:w-[480px] overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-black/5 bg-zinc-50/50 px-5 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3 md:gap-4 truncate">
            <div className="truncate text-sm md:text-base font-bold text-zinc-900">{project.title}</div>
            <div className="flex gap-2">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-blue-600 transition-colors" aria-label="Live Site">
                  <Globe size={16} className="md:w-[18px] md:h-[18px]" />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-black transition-colors" aria-label="GitHub Repository">
                  <Github size={16} className="md:w-[18px] md:h-[18px]" />
                </a>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-zinc-400 transition-colors group-hover:text-blue-600">
            {project.liveUrl && loadedIframeIds.has(project.id) ? 'View Website' : 'Explore Project'} <IconExternalLink size={14} className="md:w-4 md:h-4" />
          </div>
        </div>
        <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {project.liveUrl && loadedIframeIds.has(project.id) ? (
              <motion.div
                key="iframe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
              >
                <iframe 
                  src={project.liveUrl} 
                  className="absolute inset-0 h-full w-full border-0 pointer-events-none"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={() => setReadyIds(prev => new Set(prev).add(project.id))}
                />
                {!readyIds.has(project.id) && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-zinc-50/50 backdrop-blur-[2px] animate-pulse">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Loading...</div>
                  </div>
                )}
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" />
              </motion.div>
            ) : (
              <motion.div
                key="cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 cursor-pointer group/facade"
                onClick={() => setLoadedIframeIds(prev => new Set(prev).add(project.id))}
              >
                <ProjectPreviewImage
                  src={project.imageUrl}
                  fallbackSrc={`https://opengraph.githubassets.com/portfolio/${project.owner}/${project.repo}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover/facade:scale-105"
                  alt={project.title}
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover/facade:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl">
                    <Sparkles size={16} className="text-blue-600 animate-pulse" />
                    <span className="text-sm font-bold text-zinc-900">{project.liveUrl ? 'Load Live Site' : 'View Details'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden py-10 md:py-16"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-scroll {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
        .animate-marquee-scroll-reverse {
          animation: marquee-reverse 60s linear infinite;
        }
        .animate-marquee-scroll-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>



      <div className="relative w-full flex flex-col gap-8 md:gap-12 overflow-hidden">
        {/* Row 1: Normal Direction */}
        <div className="flex w-fit animate-marquee-scroll gap-6 md:gap-12 px-6 md:px-12">
          {row1.map((project, idx) => renderProjectCard(project, idx, 1))}
          {row1.map((project, idx) => renderProjectCard(project, idx + row1.length, 1))}
        </div>
        
        {/* Row 2: Reverse Direction */}
        <div className="flex w-fit animate-marquee-scroll-reverse gap-6 md:gap-12 px-6 md:px-12">
          {row2.map((project, idx) => renderProjectCard(project, idx, 2))}
          {row2.map((project, idx) => renderProjectCard(project, idx + row2.length, 2))}
        </div>
      </div>
    </div>
  );
}
