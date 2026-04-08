'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LogoCarouselProps {
  logos: string[];
  showTitle?: boolean;
  className?: string;
}

export default function LogoCarousel({ logos, showTitle = true, className = "" }: LogoCarouselProps) {
  // Ensure we have enough logos to create a seamless infinite loop.
  // We repeat the list multiple times to ensure the carousel is wide enough for the animation.
  const displayLogos = logos.length > 0 ? [...logos, ...logos, ...logos] : [];
  const [isHovered, setIsHovered] = useState(false);

  if (logos.length === 0) return null;

  return (
    <div className={`relative w-full ${showTitle ? "py-12 md:py-16" : "py-0"} overflow-hidden ${className}`}>

      <div className="flex flex-col items-center gap-8">
        {showTitle && (
          <div className="text-center">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-[0.2em]">Trusted by Forward-Thinking Brands</p>
          </div>
        )}

        <div 
          className="flex w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            maskImage: 'linear-gradient(90deg, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 20%, black 80%, transparent)',
          }}
        >
          <motion.div
            className="flex gap-12 md:gap-24 items-center whitespace-nowrap px-12"
            animate={{
              x: ['0%', '-50%'],
            }}
            transition={{
              duration: 30, // Smooth slow speed
              ease: 'linear',
              repeat: Infinity,
              // Only animate when not hovered
              repeatType: 'loop',
            }}
            style={{
              // Use animationPlayState to pause on hover
              animationPlayState: isHovered ? 'paused' : 'running',
              display: 'flex',
              width: 'max-content',
            }}
          >
            {displayLogos.map((logo, index) => (
              <motion.div
                key={`${logo}-${index}`}
                className="relative h-10 w-32 md:h-15 md:w-48 flex items-center justify-center shrink-0 opacity-100 brightness-0 invert transition-all duration-500 ease-in-out cursor-pointer group"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <img
                  src={logo}
                  alt={`Partner Logo ${index + 1}`}
                  className="max-h-full max-w-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all duration-500"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
