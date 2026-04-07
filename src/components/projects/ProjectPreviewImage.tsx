"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ProjectPreviewImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  sizes: string;
  className: string;
  priority?: boolean;
}

export default function ProjectPreviewImage({
  src,
  fallbackSrc,
  alt,
  sizes,
  className,
  priority,
}: ProjectPreviewImageProps) {
  const [activeSrc, setActiveSrc] = useState(src);

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