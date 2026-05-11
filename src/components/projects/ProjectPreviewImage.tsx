"use client";

import { useState, useMemo } from 'react';
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

  const { isIframe, extractedSrc } = useMemo(() => {
    if (!activeSrc) return { isIframe: false, extractedSrc: null };
    const trimmed = activeSrc.trim();
    let rawSrc = null;

    if (trimmed.startsWith('<iframe')) {
      const matchSrc = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
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

  if (isIframe && extractedSrc) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-transparent">
        {!isLoaded ? (
          <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(228,231,238,0.9),rgba(244,245,247,1),rgba(228,231,238,0.9))] bg-[length:200%_100%]" />
        ) : null}
        <div className="absolute inset-0 h-full w-full overflow-hidden bg-transparent">
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
        </div>
      </div>
    );
  }

  const isVideo = activeSrc?.match(/\.(mp4|webm|ogg)(\?.*)?$/i) || activeSrc?.includes('/video/');

  if (isVideo) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        {!isLoaded ? (
          <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(228,231,238,0.9),rgba(244,245,247,1),rgba(228,231,238,0.9))] bg-[length:200%_100%]" />
        ) : null}
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
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!isLoaded ? (
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(228,231,238,0.9),rgba(244,245,247,1),rgba(228,231,238,0.9))] bg-[length:200%_100%]" />
      ) : null}
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
    </div>
  );
}
