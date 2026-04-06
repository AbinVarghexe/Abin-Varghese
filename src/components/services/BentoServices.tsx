'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { 
  MotionGraphics, 
  VideoEditing, 
  GraphicDesign, 
  UIUXDesign, 
  WebDesign, 
  VisualEffects, 
  ThreeDDesigning 
} from './BentoVisuals';

interface BentoCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
  href: string;
  className?: string;
  accentColor?: string;
  delay?: number;
  isLarge?: boolean;
}

const BentoCard = ({ 
  children, 
  title, 
  description,
  href,
  className = '', 
  accentColor = '#3b82f6',
  delay = 0,
  isLarge = false
}: BentoCardProps) => (
  <Link href={href} className="contents">
    <motion.div
      variants={{
        initial: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
        hover: { y: -6, transition: { duration: 0.3, ease: 'easeOut' } },
      }}
      initial="initial"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover="hover"
      className={`group relative rounded-[28px] border-[5px] border-zinc-200 bg-white overflow-hidden transition-all hover:shadow-2xl hover:border-zinc-300 cursor-pointer flex flex-col ${className}`}
    >
      {/* Technical Stripe Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`stripes-${title.replace(/\s+/g, '-').toLowerCase()}`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="2" className="text-zinc-600" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#stripes-${title.replace(/\s+/g, '-').toLowerCase()})`} />
      </svg>

      {/* Top Seamless Fade */}
      <div className="absolute top-0 left-0 right-0 h-32 z-20 bg-linear-to-b from-white to-transparent opacity-80 pointer-events-none" />

      {/* Top Right Arrow Button */}
      <div className="absolute top-6 right-6 z-50 pointer-events-none">
        <motion.div
          className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center bg-white/80 backdrop-blur-sm group-hover:bg-zinc-900 group-hover:border-zinc-900 transition-all duration-300 pointer-events-auto shadow-sm"
          variants={{ 
            initial: { opacity: 0, x: 10, y: -10 }, 
            visible: { opacity: 1, x: 0, y: 0 }, 
            hover: { scale: 1.1, rotate: 45, transition: { duration: 0.2 } } 
          }}
        >
          <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
        </motion.div>
      </div>

      {/* Accent sliding top bar */}
      <motion.div
        className="absolute top-0 left-0 h-[3px] rounded-full z-40"
        style={{ backgroundColor: accentColor }}
        variants={{ 
          initial: { width: '0%' }, 
          visible: { width: '0%' }, 
          hover: { width: '100%', transition: { duration: 0.4 } } 
        }}
      />

      {/* Core Illustration Layer */}
      <div className="relative flex-1 z-10 flex items-center justify-center overflow-hidden">
        {children}
      </div>

      {/* Bottom text overlay with fade */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="w-full h-44" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,1) 100%)' }} />
      </div>

      {/* Text block */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-transparent px-7 pb-7 pt-0">
        <h3 className={`font-bold text-zinc-900 leading-tight mb-1 ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          {title}
        </h3>
        <p className="text-zinc-500 text-[11px] leading-tight line-clamp-2">
          {description}
        </p>
      </div>
    </motion.div>
  </Link>
);

export default function BentoServices() {
  return (
    <section className="relative w-full pt-32 pb-16 px-4 md:px-8 lg:px-20 bg-transparent overflow-hidden">
      {/* Grid Overlay for the Bento Section */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(115, 115, 115, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100%',
          backgroundPosition: 'center center'
        }}
      />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* --- Header --- */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full border border-zinc-100 bg-white/50 backdrop-blur-sm text-sm font-bold text-blue-500 uppercase tracking-widest mb-6"
          >
            Services
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight leading-[1.1]"
          >
            Built to Help You <br className="md:hidden" />
            <span className="relative inline-block px-2">
              <Sparkles className="absolute -top-6 -right-6 w-8 h-8 text-blue-500 opacity-40" />
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Grow</span>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-zinc-500 text-lg max-w-xl leading-relaxed"
          >
            We handle the technical complexity so you can focus on scaling your vision. 
            High-performance systems built for the modern web.
          </motion.p>
        </div>

        {/* --- Bento Grid (Corrected 2-3-2 Architecture) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* COLUMN 1: LEFT (2 Cards) */}
          <div className="flex flex-col gap-4 h-[880px] md:h-[880px]">
             {/* Card 1: Motion Graphics */}
            <BentoCard
              title="Motion Graphics"
              description="Breathe life into your brand with dynamic, smooth, and engaging animations that capture attention instantly."
              href="/services/motion-graphics"
              className="flex-[1.2]"
              accentColor="#7048e8"
              delay={0.1}
            >
              <MotionGraphics />
            </BentoCard>

            {/* Card 2: Video Editing */}
            <BentoCard
              title="Video Editing"
              description="Professional storytelling through seamless cuts, color grading, and audio syncing for high-impact results."
              href="/services/video-editing"
              className="flex-1"
              accentColor="#f59e0b"
              delay={0.2}
            >
              <VideoEditing />
            </BentoCard>
          </div>

          {/* COLUMN 2: MIDDLE (3 Cards) */}
          <div className="flex flex-col gap-4 h-[880px] md:h-[880px]">
            {/* Card 3: Graphics Design */}
            <BentoCard
              title="Graphics Design"
              description="Striking visual identities and marketing materials that resonate with your audience and elevate your brand."
              href="/services/graphics-design"
              className="flex-1"
              accentColor="#be4bdb"
              delay={0.3}
            >
              <GraphicDesign />
            </BentoCard>

            {/* Card 4: UI UX Design */}
            <BentoCard
              title="UI UX Design"
              description="User-centric design systems that balance aesthetic beauty with intuitive functionality for digital products."
              href="/services/ui-ux-design"
              className="flex-1"
              accentColor="#3b5bdb"
              delay={0.4}
            >
              <UIUXDesign />
            </BentoCard>

            {/* Card 5: Web Design */}
            <BentoCard
              title="Web Design"
              description="High-performance, responsive websites built with modern frameworks to turn visitors into customers."
              href="/services/web-design"
              className="flex-1"
              accentColor="#0d9488"
              delay={0.5}
            >
              <WebDesign />
            </BentoCard>
          </div>

          {/* COLUMN 3: RIGHT (2 Cards) */}
          <div className="flex flex-col gap-4 h-[880px] md:h-[880px]">
            {/* Card 6: Visual Effects */}
            <BentoCard
              title="Visual Effects"
              description="High-end cinematic compositing and digital effects that blur the line between imagination and reality."
              href="/services/visual-effects"
              className="flex-1"
              accentColor="#e03131"
              delay={0.6}
            >
              <VisualEffects />
            </BentoCard>

            {/* Card 7: 3D Designing */}
            <BentoCard
              title="3D Designing"
              description="Immersive 3D environments and product visualizations that provide a realistic perspective of your vision."
              href="/services/three-d-designing"
              className="flex-[1.2]"
              accentColor="#0c8599"
              delay={0.7}
              isLarge
            >
              <ThreeDDesigning />
            </BentoCard>
          </div>

        </div>
      </div>
    </section>
  );
}
