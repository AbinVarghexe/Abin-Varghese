"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: number;
  url: string;
  image: string;
}

interface MobileProjectStackProps {
  projects: Project[];
  autoPlayInterval?: number;
}

export const MobileProjectStack = ({ 
  projects, 
  autoPlayInterval = 4000 
}: MobileProjectStackProps) => {
  const [items, setItems] = useState(projects);
  const [isAnimating, setIsAnimating] = useState(false);

  // Robust auto-shuffle logic
  useEffect(() => {
    const timer = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        const first = next.shift()!;
        next.push(first);
        return next;
      });
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlayInterval]);

  const handleManualShuffle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setItems((prev) => {
      const next = [...prev];
      const first = next.shift()!;
      next.push(first);
      return next;
    });
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative w-full h-[340px] flex items-center justify-center perspective-[1200px] overflow-visible select-none">
      <AnimatePresence mode="popLayout">
        {items.map((project, index) => {
          const isFront = index === 0;
          const isMiddle = index === 1;
          const isBack = index === 2;

          return (
            <motion.div
              key={project.id}
              layout
              onClick={handleManualShuffle}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: isFront ? 1 : isMiddle ? 0.94 : 0.88,
                y: isFront ? 0 : isMiddle ? 25 : 50,
                zIndex: 30 - index * 10,
                opacity: isBack ? 0.4 : 1,
                rotateX: isFront ? 0 : -5,
                // Add a continuous "breathing" animation
                translateY: [0, -4, 0],
              }}
              exit={{
                x: 200,
                rotate: 20,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.6, ease: "easeInOut" }
              }}
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 260,
                  damping: 30
                },
                translateY: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                },
                scale: { duration: 0.4 },
                y: { duration: 0.4 },
                opacity: { duration: 0.4 }
              }}
              style={{
                position: "absolute",
                transformStyle: "preserve-3d",
              }}
              className="w-[360px] xs:w-[360px] aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-zinc-200 bg-white"
            >
              <div className="flex flex-col w-full h-full">
                {/* Browser Header */}
                <div className="w-full h-8 flex items-center px-4 bg-zinc-100 border-b border-zinc-200 shrink-0">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="mx-auto bg-white px-3 py-0.5 text-[10px] rounded-md text-zinc-500 border border-zinc-200 font-mono tracking-tighter">
                    {project.url}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 w-full relative bg-zinc-50">
                  <img 
                    src={project.image} 
                    alt={project.url} 
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  {/* Subtle Polish Gradients */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
