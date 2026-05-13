"use client";

import { useState } from 'react';
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
