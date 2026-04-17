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
  const [activeSrc, setActiveSrc] = useState(src || fallbackSrc);

  const isVideo = activeSrc?.match(/\.(mp4|webm|ogg)(\?.*)?$/i) || activeSrc?.includes('/video/');

  if (isVideo) {
    return (
      <video
        src={activeSrc}
        title={alt}
        autoPlay
        loop
        muted
        playsInline
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => {
          if (activeSrc !== fallbackSrc) {
            setActiveSrc(fallbackSrc);
          }
        }}
      />
    );
  }

  return (
    <Image
      src={activeSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => {
        if (activeSrc !== fallbackSrc) {
          setActiveSrc(fallbackSrc);
        }
      }}
    />
  );
}