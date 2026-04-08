'use client';

import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface DockItem {
  name: string;
  link: string;
  icon?: LucideIcon;
}

interface DockProps {
  items?: DockItem[];
  className?: string;
}

export const Dock: React.FC<DockProps> = ({ items = [], className = '' }) => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Determine active index based on current pathname
  const activeIndex = items.findIndex(item => item.link === pathname);
  
  // Create a reference to force usage of motion import
  const MotionDiv = m.div;

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <MotionDiv
        className="flex items-center justify-center gap-4 px-6! py-3! rounded-lg shadow-lg p-4!"
        initial={{ 
          y: 100, 
          opacity: 0,
          borderWidth: '1px',
          borderColor: 'rgba(0, 0, 0, 0.1)',
        }}
        animate={{ 
          y: 0, 
          opacity: 1,
          borderWidth: '1px',
          borderColor: 'rgba(0, 0, 0, 0.1)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          borderStyle: 'solid',
          backgroundColor: 'rgba(236, 236, 236, 0.7)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        }}
      >
        {items.map((item, i) => (
          <DockIcon 
            key={item.name}
            item={item}
            isActive={activeIndex === i}
            isHovered={hoveredIndex === i}
            onHover={() => setHoveredIndex(i)}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
      </MotionDiv>
    </div>
  );
};

interface DockIconProps {
  item: DockItem;
  isActive: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const DockIcon: React.FC<DockIconProps> = ({ 
  item, 
  isActive, 
  isHovered, 
  onHover, 
  onLeave 
}) => {
  // Scale animation based on whether the icon is hovered or active
  const iconScale = isHovered ? 1.4 : isActive ? 1.2 : 1;
  
  const activeColor = '#111827';
  const inactiveColor = '#6b7280';
  const indicatorColor = '#111827';
  
  // Use m instead of motion
  const MotionDiv = m.div;
  const MotionSpan = m.span;
  
  return (
    <Link href={item.link}>
      <MotionDiv
        className="relative flex flex-col items-center justify-center p-2"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {isHovered && (
            <MotionSpan
              className="absolute -top-10 text-xs font-medium whitespace-nowrap"
              style={{ color: activeColor }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {item.name}
            </MotionSpan>
          )}
        </AnimatePresence>
        
        <MotionDiv
          className="flex items-center justify-center"
          animate={{ scale: iconScale }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {item.icon ? (
            <item.icon 
              className="w-5 h-5" 
              style={{ color: isActive ? activeColor : inactiveColor }}
            />
          ) : (
            <span 
              className="text-sm font-medium"
              style={{ color: isActive ? activeColor : inactiveColor }}
            >
              {item.name.charAt(0)}
            </span>
          )}
        </MotionDiv>
        
        {isActive && (
          <MotionDiv
            className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: indicatorColor }}
            layoutId="dock-indicator"
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />
        )}
      </MotionDiv>
    </Link>
  );
};
