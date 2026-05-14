"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Zap } from "lucide-react";

interface CreativeItem {
  title: string;
  description: string;
  image: string;
  lottieUrl?: string;
}

interface CreativeMobileStackProps {
  items: CreativeItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function CreativeMobileStack({ 
  items: initialItems, 
  currentIndex, 
  onIndexChange 
}: CreativeMobileStackProps) {
  // We maintain a local stack order to handle the shuffling, 
  // but we report the 'top' item's original index back to the parent.
  const [stack, setStack] = useState(initialItems.map((item, originalIndex) => ({ ...item, originalIndex })));

  // Sync internal stack when external currentIndex changes (e.g., from buttons)
  useEffect(() => {
    if (stack[0].originalIndex !== currentIndex) {
      setStack((prev) => {
        const next = [...prev];
        const targetIdx = next.findIndex((item) => item.originalIndex === currentIndex);
        if (targetIdx !== -1) {
          const [targetItem] = next.splice(targetIdx, 1);
          return [targetItem, ...next];
        }
        return prev;
      });
    }
  }, [currentIndex, stack]);

  const handleSwipe = () => {
    setStack((prev) => {
      const next = [...prev];
      const swiped = next.shift();
      if (swiped) {
        next.push(swiped);
      }
      // Report the new top item's index
      onIndexChange(next[0].originalIndex);
      return next;
    });
  };

  // If the parent updates the index (e.g., via buttons), we need to ensure 
  // the stack reflects the correct top item. For simplicity in a swipe-first 
  // UI, we assume the stack is the source of truth, but we could sync if needed.
  
  return (
    <div className="relative w-[300px] h-[390px] mx-auto mb-8">
      <AnimatePresence mode="popLayout">
        {stack.slice(0, 3).reverse().map((item, index) => {
          // Adjust index mapping because we reversed for Z-index
          const visualIndex = 2 - index; 
          return (
            <SwipeCard
              key={item.title}
              item={item}
              index={visualIndex}
              total={3}
              onSwipe={handleSwipe}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({ item, index, total, onSwipe }: { 
  item: any; 
  index: number; 
  total: number; 
  onSwipe: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);
  
  const isTop = index === 0;

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        zIndex: total - index,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onSwipe();
        }
      }}
      animate={{
        scale: 1 - index * 0.05,
        y: index * 12,
        // Match the "About Me" staggered layout
        x: index === 0 ? 0 : index % 2 === 0 ? 40 : -40,
        rotate: index === 0 ? 0 : index % 2 === 0 ? 14 : -14,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      exit={{ 
        x: x.get() < 0 ? -500 : 500, 
        opacity: 0, 
        transition: { duration: 0.4 } 
      }}
      className="absolute inset-0 rounded-[12px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white cursor-grab active:cursor-grabbing touch-none border-2 border-white"
    >
      <div className="w-full h-full relative bg-zinc-900">
                {(() => {
                  const url = item.lottieUrl;
                  const fallbackImage = item.image;
                  
                  // Priority 1: Direct Video check
                  const isUrlVideo = url?.toLowerCase().endsWith('.mp4');
                  const isFallbackVideo = fallbackImage?.toLowerCase().endsWith('.mp4');
                  
                  if (isUrlVideo || isFallbackVideo) {
                    const videoSrc = isUrlVideo ? url : fallbackImage;
                    return (
                      <video 
                        src={videoSrc} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    );
                  }

                  // Priority 2: GIF or Static Image check
                  const checkIsImage = (src?: string) => {
                    if (!src) return false;
                    const s = src.toLowerCase();
                    return s.includes('pinimg') || s.includes('pinterest') || 
                           s.endsWith('.gif') || s.endsWith('.png') || 
                           s.endsWith('.jpg') || s.endsWith('.jpeg') || s.endsWith('.webp');
                  };

                  const isUrlImage = checkIsImage(url);
                  const isFallbackImage = checkIsImage(fallbackImage);

                  if (isUrlImage || isFallbackImage) {
                    const imgSrc = isUrlImage ? url : fallbackImage;
                    return (
                      <img 
                        src={imgSrc} 
                        alt={item.title} 
                        className="w-full h-full object-cover pointer-events-none" 
                        referrerPolicy="no-referrer"
                      />
                    );
                  }

                  // Fallback for JSON or missing media
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-300">
                      <Zap className="w-8 h-8" />
                    </div>
                  );
                })()}
        {index > 0 && <div className="absolute inset-0 bg-black/10" />}
        <div className="absolute inset-0 bg-linear-to-b from-black/0 to-black/20" />
      </div>
    </motion.div>
  );
}
