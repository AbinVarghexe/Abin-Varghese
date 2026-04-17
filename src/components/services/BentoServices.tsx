'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Service } from '@/constants/services';
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
  mode?: 'vertical' | 'horizontal';
}

const BentoCard = ({ 
  children, 
  title, 
  description,
  href,
  className = '', 
  accentColor = '#3b82f6',
  delay = 0,
  isLarge = false,
  mode = 'vertical'
}: BentoCardProps) => (
  <Link href={href} className={className}>
    <motion.div
      variants={{
        initial: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
        hover: { y: -6, transition: { duration: 0.3, ease: 'easeOut' } },
      }}
      initial="initial"
      whileInView="visible"
      transition={{ duration: 0.5, delay }}
      whileHover="hover"
      className={`group relative h-full rounded-xl border-[5px] border-zinc-200 bg-white overflow-hidden transition-all hover:shadow-2xl hover:border-zinc-300 cursor-pointer flex ${mode === 'horizontal' ? 'flex-col md:flex-row' : 'flex-col'}`}
    >
      {/* Technical Stripe Background ... */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`stripes-${title.replace(/\s+/g, '-').toLowerCase()}`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="2" className="text-zinc-600" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#stripes-${title.replace(/\s+/g, '-').toLowerCase()})`} />
      </svg>

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
      <div className={`relative flex-1 z-10 flex items-center justify-center overflow-hidden ${mode === 'horizontal' ? 'md:order-2 h-64 md:h-full' : ''}`}>
        {children}
        
        {/* Horizontal separation gradient - Only on horizontal mode dekstop */}
        {mode === 'horizontal' && (
          <div className="hidden md:block absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
        )}
      </div>

      {/* Text block */}
      <div className={`relative z-30 flex flex-col p-7 ${mode === 'horizontal' ? 'md:w-1/2 md:order-1 bg-white md:bg-transparent justify-end' : 'justify-end h-32'}`}>
        {/* Bottom text overlay with fade - Only for vertical cards */}
        {mode === 'vertical' && (
          <div className="absolute inset-0 -top-24 z-20 pointer-events-none" 
               style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,1) 100%)' }} />
        )}
        
        <div className="relative z-30">
          <h3 className={`font-bold text-zinc-900 leading-tight mb-2 ${mode === 'horizontal' ? 'text-2xl md:text-3xl' : isLarge ? 'text-2xl' : 'text-xl'}`}>
            {title}
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  </Link>
);

interface BentoServicesProps {
  services: Service[];
}

interface ServiceCardCopy {
  title: string;
  description: string;
  href: string;
  accentColor: string;
}

function resolveServiceCopy(
  services: Service[],
  id: string,
  fallback: ServiceCardCopy
): ServiceCardCopy {
  const service = services.find((item) => item.id === id);
  if (!service) {
    return fallback;
  }

  return {
    title: service.title,
    description: service.description,
    href: `/services/${service.id}`,
    accentColor: service.accentColor,
  };
}

export default function BentoServices({ services }: BentoServicesProps) {
  const web = resolveServiceCopy(services, 'web', {
    title: 'Web Design',
    description: 'User-centric design systems that balance beauty with simplicity for the modern web.',
    href: '/services/web',
    accentColor: '#3b5bdb',
  });

  const motionVideo = resolveServiceCopy(services, 'motion-video-editing', {
    title: 'Motion Graphics and Video Editing',
    description: 'Breathe life into your brand with dynamic animations and professional storytelling through seamless cuts.',
    href: '/services/motion-video-editing',
    accentColor: '#7048e8',
  });

  const graphicsDesign = resolveServiceCopy(services, 'graphics-design', {
    title: 'Graphics Design',
    description: 'Striking visual identities and marketing materials that resonate with your audience.',
    href: '/services/graphics-design',
    accentColor: '#be4bdb',
  });

  const threeDvfx = resolveServiceCopy(services, '3d-vfx', {
    title: '3D Designing and VFX',
    description: 'Immersive 3D environments and high-end cinematic compositing that push visual boundaries.',
    href: '/services/3d-vfx',
    accentColor: '#0c8599',
  });

  return (
    <section className="relative w-full pt-32 pb-16 px-4 md:px-8 lg:px-20 bg-transparent overflow-hidden">
      {/* Grid Overlay */}
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
            className="text-4xl md:text-6xl font-bold pb-2 text-black tracking-tight"
          >
            Built to Help You <br className="md:hidden" />
            <span className="text-blue-600 font-serif italic font-medium">Grow</span> 
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

        {/* --- Bento Grid (Custom 2x2 Layout) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[380px]">
          
          {/* Card 1: Web Design */}
          <BentoCard
            title={web.title}
            description={web.description}
            href={web.href}
            accentColor={web.accentColor}
            delay={0.1}
            className="col-span-1"
          >
            <UIUXDesign />
          </BentoCard>

          {/* Card 2: Motion & Video */}
          <BentoCard
            title={motionVideo.title}
            description={motionVideo.description}
            href={motionVideo.href}
            accentColor={motionVideo.accentColor}
            delay={0.2}
            className="col-span-1"
          >
            <MotionGraphics />
          </BentoCard>

          {/* Card 3: Graphics Design (Tall - row span 2) */}
          <BentoCard
            title={graphicsDesign.title}
            description={graphicsDesign.description}
            href={graphicsDesign.href}
            accentColor={graphicsDesign.accentColor}
            delay={0.3}
            className="col-span-1 md:row-span-2"
          >
            <GraphicDesign />
          </BentoCard>

          {/* Card 4: 3D & VFX (Wide - col span 2, horizontal) */}
          <BentoCard
            title={threeDvfx.title}
            description={threeDvfx.description}
            href={threeDvfx.href}
            accentColor={threeDvfx.accentColor}
            delay={0.4}
            mode="horizontal"
            className="col-span-1 md:col-span-2"
          >
            <ThreeDDesigning />
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
