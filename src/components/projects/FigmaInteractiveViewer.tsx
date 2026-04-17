"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2, 
  MousePointer2,
  X 
} from 'lucide-react';
import { IconBrandFigma } from '@tabler/icons-react';

interface FigmaInteractiveViewerProps {
  figmaUrl: string;
  title?: string;
  tags?: string[];
  coverImage?: string;
}

export default function FigmaInteractiveViewer({ 
  figmaUrl, 
  title = "Figma Prototype", 
  tags = [],
  coverImage 
}: FigmaInteractiveViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);

  // Parse Figma embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('figma.com/embed')) return url;
    return `https://www.figma.com/embed?embed_host=portfolio&url=${encodeURIComponent(url)}`;
  };

  const embedUrl = getEmbedUrl(figmaUrl);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFullscreen]);

  return (
    <>
      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-8"
          >
            <div className="relative h-full w-full max-w-7xl overflow-hidden rounded-[24px] border border-white/10 bg-[#1e1e1e] shadow-2xl flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 bg-[#2c2c2c] px-6 py-4 shrink-0">
                <div className="flex items-center gap-3 text-white">
                  <IconBrandFigma size={20} className="text-[#0acf83]" />
                  <span className="text-sm font-bold tracking-tight">{title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href={figmaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-[12px] font-bold text-white transition-all hover:bg-zinc-800 shadow-md">
                    Open in Figma
                  </a>
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="relative flex-1 w-full bg-[#1e1e1e]">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card Component exactly matching BehanceStyleCard Container */}
      <div className="group relative w-full overflow-hidden rounded-[24px] border border-black/10 bg-white p-3 md:p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-[#0acf83]/10 hover:border-[#0acf83]/30 flex flex-col">
        
        {/* Header Info perfectly matching the other cards */}
        <div className="mb-3 md:mb-4 flex items-center justify-between px-1 md:px-2 shrink-0">
          <div className="flex flex-col gap-1 max-w-[65%]">
            <h4 className="text-[15px] md:text-lg font-bold tracking-tight text-zinc-900 group-hover:text-[#0acf83] transition-colors truncate">
              {title}
            </h4>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-100">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <a 
              href={figmaUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex h-9 items-center gap-2 rounded-full bg-black px-4 text-[12px] font-bold text-white shadow-lg transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 border border-white/20"
            >
              <IconBrandFigma size={14} /> Open in Figma
            </a>
          </div>
        </div>

        {/* Interactive Preview Container perfectly matching other cards */}
        <div className="relative w-full aspect-[16/10] md:h-[550px] overflow-hidden rounded-[18px] md:rounded-[24px] border border-black/5 bg-zinc-100 shadow-inner">
          <AnimatePresence mode="wait">
            {!isLoaded ? (
              <motion.div
                key="facade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 cursor-pointer group/card"
                onClick={() => setIsLoaded(true)}
              >
                {coverImage && (
                  <img 
                    src={coverImage} 
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover/card:scale-105" 
                    alt={title} 
                  />
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl hover:scale-105 transition-transform duration-300">
                    <MousePointer2 size={16} className="text-[#0acf83]" />
                    <span className="text-[12px] font-bold text-zinc-900 uppercase tracking-widest">Interactive Preview</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white">
                {!isIframeReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/50 backdrop-blur-[2px] z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-6 w-6 rounded-full border-[3px] border-zinc-200 border-t-[#0acf83] animate-spin" />
                      <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Initializing...</div>
                    </div>
                  </div>
                )}
                
                {/* Fullscreen Trigger */}
                <button 
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl opacity-0 hover:bg-zinc-100 group-hover:opacity-100 transition-all duration-300 text-zinc-600 hover:text-black hover:scale-110"
                  title="Fullscreen"
                >
                  <Maximize2 size={16} />
                </button>

                <iframe
                  src={embedUrl}
                  className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${isIframeReady ? 'opacity-100' : 'opacity-0'}`}
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => setIsIframeReady(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
