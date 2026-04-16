"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const [measuredMedia, setMeasuredMedia] = useState<{
    path: string;
    ratio: number;
  } | null>(null);

  // Fallback aspect ratio while waiting for image data
  const fallbackAspectRatio = useMemo(() => {
    const estimatedRatio = 320 / Math.max(pin.previewHeight, 1);
    return Math.min(1.8, Math.max(0.56, Number(estimatedRatio.toFixed(2))));
  }, [pin.previewHeight]);

  const activeMeasuredRatio =
    measuredMedia && measuredMedia.path === pin.mediaPath ? measuredMedia.ratio : null;

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
        delay: index * 0.05, // Staggered reveal
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
          {/* Shimmering Skeleton Placeholder */}
          {!isLoaded && (
            <div 
              className="absolute inset-0 z-10 overflow-hidden bg-zinc-100"
            >
              <div 
                className="h-full w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 2s infinite',
                }}
              />
               <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmer {
                  100% { transform: translateX(100%); }
                }
              `}} />
            </div>
          )}

          <div className={`transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {pin.mediaType === "image" && (
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

            {pin.mediaType === "video" && (
              <video
                src={pin.mediaPath}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                onLoadedData={() => setIsLoaded(true)}
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

            {pin.mediaType === "model" && (
              <>
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
              </>
            )}
          </div>

        </div>
      </Link>
    </motion.article>
  );
}
