"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { homePageDesignSystem } from "@/lib/home-page-design-system";
import { PinterestPin } from "@/lib/pinterest-content";

interface PinCardProps {
  pin: PinterestPin;
  href: string;
  compact?: boolean;
  fixedHeight?: number;
  index?: number;
}

export default function PinCard({
  pin,
  href,
  compact = false,
  fixedHeight,
  index = 0,
}: PinCardProps) {
  const design = homePageDesignSystem;
  const cardRadius = "14px";

  const [isLoaded, setIsLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [measuredMedia, setMeasuredMedia] = useState<{
    path: string;
    ratio: number;
  } | null>(null);

  const { extractedSrc, iframeRatio } = useMemo(() => {
    const sources = [pin.mediaPath, pin.externalUrl].filter(Boolean) as string[];
    
    let rawSrc = null;
    let ratio = null;

    for (const src of sources) {
      const trimmed = src.trim();
      
      if (trimmed.startsWith('<iframe')) {
        const matchSrc = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
        if (matchSrc) rawSrc = matchSrc[1];

        const widthAttr = trimmed.match(/width\s*=\s*["']?([^"']+)["']?/i);
        const heightAttr = trimmed.match(/height\s*=\s*["']?([^"']+)["']?/i);
        
        if (widthAttr && heightAttr && !widthAttr[1].includes('%') && !heightAttr[1].includes('%')) {
          const w = parseInt(widthAttr[1], 10);
          const h = parseInt(heightAttr[1], 10);
          if (w > 0 && h > 0) {
            ratio = w / h;
          }
        }
        if (rawSrc) break;
      } else if (trimmed.includes('player.vimeo.com') || trimmed.includes('youtube.com/embed')) {
        rawSrc = trimmed;
        break;
      } else if (trimmed.includes('vimeo.com')) {
        const match = trimmed.match(/vimeo\.com\/(\d+)/);
        if (match) {
          rawSrc = `https://player.vimeo.com/video/${match[1]}`;
          break;
        }
      } else if (trimmed.includes('youtube.com/watch') || trimmed.includes('youtu.be/')) {
        const videoId = trimmed.includes('v=') 
          ? trimmed.split('v=')[1]?.split('&')[0]
          : trimmed.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) {
          rawSrc = `https://www.youtube.com/embed/${videoId}`;
          break;
        }
      }
    }

    if (!rawSrc) return { extractedSrc: null, iframeRatio: null };

    try {
      const cleanSrc = rawSrc.replace(/&amp;/g, '&');
      const validUrl = cleanSrc.startsWith('http') ? cleanSrc : `https:${cleanSrc.startsWith('//') ? '' : '//'}${cleanSrc}`;
      const url = new URL(validUrl);
      
      if (url.hostname.includes('vimeo.com')) {
        url.searchParams.set('background', '1');
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('muted', '1');
        url.searchParams.set('loop', '1');
        url.searchParams.set('autopause', '0');
        url.searchParams.set('controls', '0');
        url.searchParams.set('title', '0');
        url.searchParams.set('byline', '0');
        url.searchParams.set('portrait', '0');
        url.searchParams.set('transparent', '1');
        url.searchParams.set('playsinline', '1');
        url.searchParams.set('dnt', '1');
      } else if (url.hostname.includes('youtube.com')) {
        let videoId = '';
        if (url.pathname.includes('/embed/')) {
          videoId = url.pathname.split('/embed/')[1].split('?')[0];
        } else {
          videoId = url.searchParams.get('v') || url.pathname.split('/').pop() || '';
        }
        
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('mute', '1');
        url.searchParams.set('loop', '1');
        if (videoId) url.searchParams.set('playlist', videoId);
        url.searchParams.set('controls', '0');
        url.searchParams.set('showinfo', '0');
        url.searchParams.set('rel', '0');
        url.searchParams.set('modestbranding', '1');
        url.searchParams.set('playsinline', '1');
        url.searchParams.set('iv_load_policy', '3');
        url.searchParams.set('fs', '0');
        url.searchParams.set('disablekb', '1');
        url.searchParams.set('enablejsapi', '1');
        if (typeof window !== 'undefined') {
          url.searchParams.set('origin', window.location.origin);
        }
      }
      return { extractedSrc: url.toString(), iframeRatio: ratio };
    } catch {
      return { extractedSrc: rawSrc, iframeRatio: ratio };
    }
  }, [pin.mediaPath, pin.externalUrl]);

  const isIframeEmbed = extractedSrc !== null;

  useEffect(() => {
    if (!isIframeEmbed || !extractedSrc) return;
    
    // Fallback: force load state after 2.5s if onLoad doesn't fire
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    
    let isMounted = true;
    const fetchOembed = async () => {
      try {
        const urlObj = new URL(extractedSrc);
        let oembedUrl = '';
        
        if (urlObj.hostname.includes('vimeo.com')) {
          const match = urlObj.pathname.match(/\/video\/(\d+)/) || urlObj.pathname.match(/\/(\d+)/);
          if (match && match[1]) {
            const videoUrl = `https://vimeo.com/${match[1]}`;
            oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`;
          }
        } else if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
          let videoUrl = extractedSrc;
          if (urlObj.pathname.includes('/embed/')) {
            const videoId = urlObj.pathname.split('/embed/')[1];
            videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          }
          oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
        }

        if (oembedUrl) {
          const res = await fetch(oembedUrl);
          const data = await res.json();
          if (isMounted && data && data.width && data.height) {
            setMeasuredMedia({
              path: pin.mediaPath || pin.externalUrl || '',
              ratio: data.width / data.height,
            });
          }
        }
      } catch (err) {}
    };

    fetchOembed();
    return () => { 
      isMounted = false;
      clearTimeout(timer);
    };
  }, [extractedSrc, pin.mediaPath, pin.externalUrl]);

  const fallbackAspectRatio = useMemo(() => {
    const estimatedRatio = 320 / Math.max(pin.previewHeight, 1);
    return Math.min(1.8, Math.max(0.56, Number(estimatedRatio.toFixed(2))));
  }, [pin.previewHeight]);

  const activeMeasuredRatio =
    measuredMedia && (measuredMedia.path === pin.mediaPath || measuredMedia.path === pin.externalUrl) 
      ? measuredMedia.ratio 
      : (isIframeEmbed && iframeRatio) ? iframeRatio : null;

  const mediaStyle = fixedHeight
    ? { minHeight: fixedHeight }
    : { aspectRatio: activeMeasuredRatio ?? fallbackAspectRatio };

  return (
    <motion.article 
      className="mb-4 break-inside-avoid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.05, 
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      <Link
        href={href}
        className="group block shadow-[0_18px_45px_-38px_rgba(0,0,0,0.62)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-36px_rgba(0,0,0,0.68)]"
        style={{
          background: design.colors.surface,
          border: `1px solid ${design.colors.border.card}`,
          borderRadius: cardRadius,
          boxShadow: design.shadows.card,
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ ...mediaStyle, borderRadius: cardRadius }}>
          {!isLoaded && (
            <div className="absolute inset-0 z-10 overflow-hidden bg-zinc-100">
              <div className="h-full w-full" style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 2s infinite',
              }} />
              <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer { 100% { transform: translateX(100%); } }` }} />
            </div>
          )}

          <div className={`transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {isIframeEmbed && extractedSrc && (
              <div className="absolute inset-0 h-full w-full overflow-hidden bg-transparent">
                <iframe
                  src={extractedSrc}
                  className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out scale-[1.02] group-hover:scale-[1.12]"
                  style={{ border: 'none', background: 'transparent' }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowTransparency={true}
                  loading="eager"
                  onLoad={() => setIsLoaded(true)}
                />
                {/* Transparent overlay to capture clicks for the Link component while allowing iframe to initialize */}
                <div className="absolute inset-0 z-10 bg-transparent cursor-pointer" />
              </div>
            )}

            {pin.mediaType === "image" && !isIframeEmbed && (
              <Image
                src={pin.mediaPath}
                alt={pin.title}
                fill
                sizes={compact ? "(max-width: 1280px) 100vw, 20vw" : "(max-width: 1280px) 100vw, 30vw"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                onLoadingComplete={(image) => {
                  setIsLoaded(true);
                  if (!fixedHeight && image.naturalWidth && image.naturalHeight) {
                    setMeasuredMedia({
                      path: pin.mediaPath,
                      ratio: image.naturalWidth / image.naturalHeight,
                    });
                  }
                }}
              />
            )}

            {(pin.mediaType === "video" || pin.mediaType === "image") && !videoFailed && !isIframeEmbed && pin.mediaPath.endsWith('.mp4') && (
              <video
                src={pin.mediaPath}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                onLoadedData={() => setIsLoaded(true)}
                onError={() => {
                  setVideoFailed(true);
                  setIsLoaded(true);
                }}
                onLoadedMetadata={(event) => {
                  if (!fixedHeight && event.currentTarget.videoWidth && event.currentTarget.videoHeight) {
                    setMeasuredMedia({
                      path: pin.mediaPath,
                      ratio: event.currentTarget.videoWidth / event.currentTarget.videoHeight,
                    });
                  }
                }}
              />
            )}

            {pin.mediaType === "model" && !isIframeEmbed && (
              <Image
                src={pin.mediaPath}
                alt={pin.title}
                fill
                sizes={compact ? "(max-width: 1280px) 100vw, 20vw" : "(max-width: 1280px) 100vw, 30vw"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                onLoadingComplete={(image) => {
                  setIsLoaded(true);
                  if (!fixedHeight && image.naturalWidth && image.naturalHeight) {
                    setMeasuredMedia({
                      path: pin.mediaPath,
                      ratio: image.naturalWidth / image.naturalHeight,
                    });
                  }
                }}
              />
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
