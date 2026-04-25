"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

interface LiveProjectFrameProps {
  url: string;
  title: string;
  fallbackImage?: string;
  isInteractive?: boolean;
  borderRadius?: string;
}

export default function LiveProjectFrame({ 
  url, 
  title, 
  fallbackImage,
  isInteractive = false,
  borderRadius = 'inherit'
}: LiveProjectFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Desktop dimensions for emulation
  const DESKTOP_WIDTH = 1280;
  const ASPECT_RATIO = 16 / 9;
  const DESKTOP_HEIGHT = DESKTOP_WIDTH / ASPECT_RATIO;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth > 0) {
          setScale(containerWidth / DESKTOP_WIDTH);
        }
      }
    };

    // Use ResizeObserver for more robust sizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setScale(entry.contentRect.width / DESKTOP_WIDTH);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      // Initial check
      updateScale();
    }

    return () => resizeObserver.disconnect();
  }, [DESKTOP_WIDTH]);

  if (hasError) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-zinc-50 flex items-center justify-center">
        {fallbackImage ? (
          <img 
            src={fallbackImage} 
            alt={`${title} preview`} 
            className="w-full h-full object-cover object-top"
            style={{ borderRadius }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-400 p-6 text-center">
            <Globe className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-[10px] font-medium uppercase tracking-tight">Preview unavailable</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-white overflow-hidden group/live isolation-auto"
      style={{ 
        aspectRatio: '16/9',
        isolation: 'isolate',
        borderRadius,
        willChange: 'transform'
      }}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-zinc-50">
          <div className="absolute inset-y-0 left-0 w-16 border-r border-zinc-200/80 bg-zinc-100/80" />
          <div className="absolute inset-x-0 top-0 h-11 border-b border-zinc-200/80 bg-white/70" />
          <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(228,231,238,0.55),rgba(244,245,247,0.92),rgba(228,231,238,0.55))] bg-[length:200%_100%]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 shadow-sm">
              Loading preview
            </div>
          </div>
        </div>
      )}

      {/* Scaled Desktop Content Container */}
      <div 
        className="absolute top-0 left-0 origin-top-left overflow-hidden"
        style={{ 
          width: DESKTOP_WIDTH,
          height: DESKTOP_HEIGHT,
          transform: `scale(${scale})`,
          pointerEvents: isInteractive ? 'auto' : 'none',
          borderRadius,
          willChange: 'transform'
        }}
      >
        <iframe
          src={url}
          title={title}
          className="w-full h-full border-none"
          style={{ 
            background: 'white' 
          }}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>

      {/* Subtle overlay hint */}
      {!isInteractive && (
        <div className="absolute inset-0 z-2 bg-transparent pointer-events-none group-hover/live:bg-stone-900/3 transition-colors duration-500" />
      )}
    </div>
  );
}
