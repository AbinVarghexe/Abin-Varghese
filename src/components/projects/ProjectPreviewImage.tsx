"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ProjectPreviewImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export default function ProjectPreviewImage({
  src,
  fallbackSrc,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className = "",
  priority = false,
}: ProjectPreviewImageProps) {
  return (
    <ProjectPreviewImageInner
      key={`${src}::${fallbackSrc}`}
      src={src}
      fallbackSrc={fallbackSrc}
      alt={alt}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}

function ProjectPreviewImageInner({
  src,
  fallbackSrc,
  alt,
  sizes,
  className,
  priority,
}: ProjectPreviewImageProps) {
  const [activeSrc, setActiveSrc] = useState(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to trigger loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const { isIframe, extractedSrc } = useMemo(() => {
    if (!isInView || !activeSrc) return { isIframe: false, extractedSrc: null };
    const trimmed = activeSrc.trim();
    let rawSrc = null;

    if (trimmed.includes('<iframe')) {
      const matchSrc = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
      if (matchSrc) rawSrc = matchSrc[1];
    } else if (trimmed.includes('player.vimeo.com') || trimmed.includes('youtube.com/embed')) {
      rawSrc = trimmed;
    }

    if (!rawSrc) return { isIframe: false, extractedSrc: null };

    try {
      const cleanSrc = rawSrc.replace(/&amp;/g, '&');
      const validUrl = cleanSrc.startsWith('http') ? cleanSrc : `https:${cleanSrc.startsWith('//') ? '' : '//'}${cleanSrc}`;
      const url = new URL(validUrl);
      
      if (url.hostname.includes('vimeo.com')) {
        url.searchParams.set('background', '1');
        url.searchParams.set('autopause', '0');
        url.searchParams.set('controls', '0');
        url.searchParams.set('title', '0');
        url.searchParams.set('byline', '0');
        url.searchParams.set('portrait', '0');
        url.searchParams.set('transparent', '0');
        url.searchParams.set('dnt', '1');
      } else if (url.hostname.includes('youtube.com')) {
        url.searchParams.set('controls', '0');
        url.searchParams.set('showinfo', '0');
        url.searchParams.set('rel', '0');
        url.searchParams.set('modestbranding', '1');
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('mute', '1');
        url.searchParams.set('loop', '1');
        url.searchParams.set('playsinline', '1');
      }
      return { isIframe: true, extractedSrc: url.toString() };
    } catch {
      return { isIframe: true, extractedSrc: rawSrc };
    }
  }, [activeSrc]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-[linear-gradient(110deg,rgba(228,231,238,0.9),rgba(244,245,247,1),rgba(228,231,238,0.9))] bg-[length:200%_100%]" />
      )}
      
      <div className={`h-full w-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {isInView && (
          <>
            {isIframe && extractedSrc ? (
              <iframe
                src={extractedSrc}
                title={alt}
                allow="autoplay; fullscreen; picture-in-picture"
                allowTransparency={true}
                className={`${className} absolute inset-0 h-full w-full pointer-events-none scale-[1.02]`}
                style={{ border: 'none', background: 'transparent' }}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  if (activeSrc !== fallbackSrc) {
                    setActiveSrc(fallbackSrc);
                    setIsLoaded(false);
                    return;
                  }
                  setIsLoaded(true);
                }}
              />
            ) : activeSrc?.match(/\.(mp4|webm|ogg)(\?.*)?$/i) || activeSrc?.includes('/video/') ? (
              <video
                src={activeSrc}
                title={alt}
                autoPlay
                loop
                muted
                playsInline
                className={className}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onLoadedData={() => setIsLoaded(true)}
                onError={() => {
                  if (activeSrc !== fallbackSrc) {
                    setActiveSrc(fallbackSrc);
                    setIsLoaded(false);
                    return;
                  }
                  setIsLoaded(true);
                }}
              />
            ) : (
              <Image
                src={activeSrc}
                alt={alt}
                fill
                sizes={sizes}
                className={className}
                priority={priority}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  if (activeSrc !== fallbackSrc) {
                    setActiveSrc(fallbackSrc);
                    setIsLoaded(false);
                    return;
                  }
                  setIsLoaded(true);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
