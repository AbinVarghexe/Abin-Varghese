"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Zap } from "lucide-react";

interface Category {
  title: string;
  description: string;
  image?: string;
  lottieUrl?: string;
}

interface ArchGalleryProps {
  categories: Category[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function useLottieData(url?: string) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => { if (!cancelled) setAnimationData(data); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [url]);

  return { animationData, error };
}

const LottieCardPlayer = ({ url, fallbackImage }: { url?: string, fallbackImage?: string }) => {
  const urlLower = url?.toLowerCase() || '';
  const isVideo = urlLower.endsWith('.mp4');
  const isImage = urlLower.endsWith('.gif') || urlLower.endsWith('.png') || urlLower.endsWith('.jpg') || urlLower.endsWith('.jpeg') || urlLower.endsWith('.webp');
  
  const { animationData, error } = useLottieData(isVideo || isImage ? undefined : url);

  if (isVideo) {
    return (
      <div className="w-full h-full relative bg-black">
        <video 
          src={url} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (isImage) {
    return (
      <img 
        src={url} 
        alt="Creative content" 
        className="w-full h-full object-cover"
      />
    );
  }

  if (error || (!url && !fallbackImage)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-300">
        <Zap className="w-12 h-12" />
      </div>
    );
  }

  const isLottie = url && !isVideo && !isImage;
  if (isLottie && !animationData) {
    return <div className="w-full h-full bg-zinc-100 animate-pulse" />;
  }

  if (animationData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white p-4">
        <Lottie 
          animationData={animationData} 
          loop={true} 
          autoplay={true}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <img 
      src={fallbackImage} 
      alt="Card graphic" 
      className="w-full h-full object-cover"
    />
  );
};

export function ArchGallery({ categories, selectedIndex, onSelect }: ArchGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
      <div className="absolute top-[5%] md:top-[12%] left-1/2 -translate-x-1/2 w-full h-full pointer-events-auto overflow-visible">
        {categories.map((cat, i) => {
          const isHovered = hoveredIndex === i;
          const isSelected = selectedIndex === i;
          
          // Calculate shortest path offset for continuous carousel
          let offset = i - selectedIndex;
          const half = categories.length / 2;
          if (offset > half) offset -= categories.length;
          else if (offset < -half) offset += categories.length;
          
          const rotation = offset * 10; 
          
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-0"
              style={{
                width: "200px",
                height: "240px",
                marginLeft: "-100px",
                transformOrigin: "50% 1200px",
                zIndex: isSelected ? 20 : (isHovered ? 15 : (10 - Math.abs(offset))),
              }}
              animate={{ rotate: rotation, y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelect(i)}
            >
              <motion.div 
                className={`w-full h-full rounded-xl overflow-hidden shadow-2xl border-4 cursor-pointer bg-white transition-all duration-500 ${
                  isSelected ? "border-[#3b5bdb]" : "border-white"
                }`}
                animate={{
                  y: isSelected ? -70 : (isHovered ? -35 : 0),
                  scale: isSelected ? 1.4 : (isHovered ? 1.15 : 1),
                  rotate: isHovered && !isSelected ? -rotation * 0.15 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <div className="w-full h-full relative">
                  <div className="w-full h-full transition-all duration-700">
                    <LottieCardPlayer url={cat.lottieUrl} fallbackImage={cat.image} />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/20 opacity-60 pointer-events-none" />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
