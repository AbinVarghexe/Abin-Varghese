"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Category {
  title: string;
  description: string;
  image: string;
}

interface ArchGalleryProps {
  categories: Category[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function ArchGallery({ categories, selectedIndex, onSelect }: ArchGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
      <div className="absolute top-[5%] md:top-[12%] left-1/2 -translate-x-1/2 w-full h-full pointer-events-auto overflow-visible">
        {categories.map((cat, i) => {
          const isHovered = hoveredIndex === i;
          const isSelected = selectedIndex === i;
          
          // Space them by a tighter angle for closer spacing without overlap
          const offset = i - 3;
          const rotation = offset * 8; 
          
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-0"
              style={{
                width: "200px",
                height: "240px",
                marginLeft: "-100px",
                transformOrigin: "50% 1200px",
                zIndex: isSelected ? 20 : (isHovered ? 15 : (7 - Math.abs(offset))),
              }}
              initial={{ rotate: rotation, y: 50, opacity: 0 }}
              whileInView={{ rotate: rotation, y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.05, 
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
                  y: isSelected ? -50 : (isHovered ? -25 : 0),
                  scale: isSelected ? 1.25 : (isHovered ? 1.15 : 1),
                  rotate: isHovered && !isSelected ? -rotation * 0.1 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <div className="w-full h-full relative">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      (isSelected || isHovered) ? "grayscale-0" : "grayscale"
                    }`}
                  />
                  
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
