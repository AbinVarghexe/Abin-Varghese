'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { StripedPattern } from "@/components/magicui/striped-pattern";
import Folder from '@/components/ui/Folder';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';

// ─── Services Data ─────────────────────────────────────────────────────────
const services = [
  {
    id: 'uiux' as const,
    title: 'UI / UX Design',
    description: 'Crafting intuitive, accessible digital experiences that balance beauty with clarity.',
    accentColor: '#3b5bdb',
    bgGradient: 'from-blue-50 to-indigo-50',
    className: 'md:col-span-1 md:row-span-1',
    delay: 0.0,
    lottieUrl: undefined,
  },
  {
    id: 'motion' as const,
    title: 'Motion Graphics',
    description: 'Bringing ideas to life with cinematic animation and visual storytelling.',
    accentColor: '#7048e8',
    bgGradient: 'from-violet-50 to-purple-50',
    className: 'md:col-span-1 md:row-span-1',
    delay: 0.1,
    lottieUrl: undefined,
  },
  {
    id: 'video' as const,
    title: 'Video Editing & VFX',
    description: 'High-fidelity video post-production, color grading, and visual effects for cinematic impact.',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-50 to-orange-50',
    className: 'md:col-span-1 md:row-span-2',
    delay: 0.2,
    isTall: true,
  },
  {
    id: 'web' as const,
    title: 'Website Development',
    description: 'Next-generation web applications built for speed, SEO, and scalability using React & Next.js.',
    lottieUrl: 'https://assets3.lottiefiles.com/packages/lf20_4kx2q32n.json',
    accentColor: '#0d9488',
    bgGradient: 'from-teal-50 to-emerald-50',
    className: 'md:col-span-2 md:row-span-1',
    delay: 0.3,
    isWide: true,
  },
];

// ─── Lottie fetch hook ──────────────────────────────────────────────────────
function useLottieData(url?: string) {
  const [animationData, setAnimationData] = useState<unknown>(null);
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then(res => res.json())
      .then(data => { if (!cancelled) setAnimationData(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [url]);
  return animationData;
}

// ─── UI Paper Contents for the Folder ─────────────────────────────────────
const folderPapers: React.ReactNode[] = [
  <div key="ps" className="w-full h-full p-3.5 flex items-center justify-center rounded-md pointer-events-none">
    <img src="https://skillicons.dev/icons?i=ps" alt="Photoshop" className="w-8 h-8 object-contain" />
  </div>,
  <div key="ai" className="w-full h-full p-3.5 flex items-center justify-center rounded-md pointer-events-none">
    <img src="https://skillicons.dev/icons?i=ai" alt="Illustrator" className="w-8 h-8 object-contain" />
  </div>,
  <div key="figma" className="w-full h-full p-3 flex items-center justify-center rounded-md pointer-events-none">
    <img src="https://skillicons.dev/icons?i=figma" alt="Figma" className="w-10 h-10 object-contain" />
  </div>,
];

// ─── Types ─────────────────────────────────────────────────────────────────
type BaseService = (typeof services)[number];
type LottieService = BaseService & { lottieUrl: string; isTall?: boolean; isWide?: boolean; };

// ─── Main Section ───────────────────────────────────────────────────────────
export default function ServicesSection() {
  return (
    <section id="services" className="relative z-20 pt-0 pb-24 px-4 md:px-8 lg:px-20 w-full bg-transparent overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start text-left mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-2 tracking-tight">
            My <span className="text-blue-600 font-serif italic font-medium">Services</span>
          </h2>
          <p className="mt-4 text-black/70 text-lg max-w-2xl leading-relaxed">
            Transforming ideas into digital reality through a blend of technical expertise and creative vision.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[340px]">
          {services.map(service => {
            if (service.id === 'uiux') return <UIUXCard key={service.id} service={service} />;
            if (service.id === 'motion') return <MotionGraphicsCard key={service.id} service={service} />;
            if (service.id === 'video') return <VideoEditingCard key={service.id} service={service} />;
            return <LottieCard key={service.id} service={service as LottieService} />;
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Common Card Shell ──────────────────────────────────────────────────────
interface CardShellProps {
  service: BaseService | LottieService;
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  showArrow?: boolean;
}

function CardShell({ service, children, className = '', onMouseEnter, onMouseLeave, showArrow = true }: CardShellProps) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
        hover: { y: -6, transition: { duration: 0.3, ease: 'easeOut' } },
      }}
      initial="initial"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: service.delay }}
      whileHover="hover"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative rounded-[28px] border-[5px] border-zinc-200 bg-white overflow-hidden transition-all hover:shadow-2xl hover:border-zinc-300 cursor-pointer ${service.className} ${className}`}
    >
      {/* Background washing */}
      <div className={`absolute inset-0 bg-linear-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Technical Stripe Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07] z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`stripes-${service.id}`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="2" className="text-zinc-600" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#stripes-${service.id})`} />
      </svg>

      {/* Top Seamless Fade — darker wash at the top edge */}
      <div className="absolute top-0 left-0 right-0 h-32 z-20 bg-linear-to-b from-white to-transparent opacity-80 pointer-events-none" />

      {/* Top Right Arrow Button — absolute positioned for clarity */}
      {showArrow && (
        <div className="absolute top-6 right-6 z-50 pointer-events-none">
          <motion.div
            className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center bg-white/80 backdrop-blur-sm group-hover:bg-zinc-900 group-hover:border-zinc-900 transition-all duration-300 pointer-events-auto shadow-sm"
            variants={{ initial: { opacity: 0, x: 10, y: -10 }, visible: { opacity: 1, x: 0, y: 0 }, hover: { scale: 1.1, rotate: 45, transition: { duration: 0.2 } } }}
          >
            <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </motion.div>
        </div>
      )}

      {/* Accent sliding top bar */}
      <motion.div
        className="absolute top-0 left-0 h-[3px] rounded-full z-40"
        style={{ backgroundColor: service.accentColor }}
        variants={{ initial: { width: '0%' }, visible: { width: '0%' }, hover: { width: '100%', transition: { duration: 0.4 } } }}
      />

      {/* Core Illustration Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {children}
      </div>

      {/* Bottom text overlay with fade */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="w-full h-44" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,1) 100%)' }} />
      </div>

      {/* Text block — transparent bg, sits on high-z */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-transparent px-7 pb-7 pt-0">
        <h3 className={`font-bold text-zinc-900 leading-tight ${(service as LottieService).isWide || (service as LottieService).isTall ? 'text-2xl' : 'text-xl'}`}>
          {service.title}
        </h3>
        <p className="text-zinc-500 text-xs leading-tight line-clamp-2 mt-0.5">{service.description}</p>
      </div>
    </motion.div>
  );
}

// ─── UI UX Card ────────────────────────────────────────────────────────────
function UIUXCard({ service }: { service: BaseService }) {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-animate the folder open/close on a loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen(prev => !prev);
    }, 4000); // Toggle every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <CardShell service={service}>
      <motion.div
        className="w-full h-full flex items-center justify-center pb-12"
        animate={{
          y: isOpen ? 45 : 0, // Stays down when open, goes back to 0 when closed
          rotateZ: isOpen ? -1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        {/* Internal floating animation — always active but relative to parent Y */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Folder color={service.accentColor} size={1.4} items={folderPapers} isOpen={isOpen} />
        </motion.div>
      </motion.div>
    </CardShell>
  );
}

// ─── Motion Graphics Card ─────────────────────────────────────────────────
function MotionGraphicsCard({ service }: { service: BaseService }) {
  return (
    <CardShell service={service}>
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-transparent pb-16">
        <span className="pointer-events-none whitespace-pre-wrap bg-linear-to-b from-zinc-900 to-zinc-400 bg-clip-text text-center text-7xl font-semibold leading-none text-transparent opacity-10 uppercase tracking-tighter">
          MOTION
        </span>

        {/* Inner Circles — Design Tools */}
        <OrbitingCircles iconSize={40} radius={65} duration={18} speed={1.2}>
          <div className="flex items-center justify-center w-10 h-10 transition-transform hover:scale-110">
            <img src="https://skillicons.dev/icons?i=figma" alt="Figma" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 transition-transform hover:scale-110">
            <img src="https://skillicons.dev/icons?i=blender" alt="Blender" className="w-full h-full object-contain" />
          </div>
        </OrbitingCircles>

        {/* Outer Circles — Motion & Publishing */}
        <OrbitingCircles iconSize={52} radius={125} duration={25} reverse speed={0.8}>
          <div className="flex items-center justify-center w-12 h-12 p-2 transition-transform hover:scale-110">
            <img src="https://skillicons.dev/icons?i=ae" alt="After Effects" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center justify-center w-12 h-12 p-2 transition-transform hover:scale-110">
            <img src="https://skillicons.dev/icons?i=pr" alt="Premiere Pro" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center justify-center w-12 h-12 p-2 transition-transform hover:scale-110">
            <img src="https://cdn.simpleicons.org/davinciresolve" alt="DaVinci Resolve" className="w-full h-full object-contain" />
          </div>
        </OrbitingCircles>
      </div>
    </CardShell>
  );
}

// ─── Video Editing Card ──────────────────────────────────────────────────
function VideoEditingCard({ service }: { service: BaseService }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <CardShell service={service}>
      <div className="relative w-full h-full flex flex-col items-center justify-center pt-8 pb-32 px-6 overflow-hidden bg-transparent">
        {/* Simplified Video Preview "Screen" */}
        <motion.div 
          className="w-48 h-32 rounded-xl bg-zinc-900 border-4 border-zinc-800 shadow-2xl relative overflow-hidden mb-6 flex items-center justify-center p-4"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Abstract moving visuals in the screen */}
          <motion.div 
            className="w-full h-full rounded-md bg-linear-to-tr from-amber-500/20 to-orange-500/20 relative overflow-hidden"
          >
            <motion.div 
              className="absolute top-2 left-2 right-2 h-1.5 rounded-full bg-white/20"
              animate={{ width: ["10%", "80%", "30%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute bottom-2 left-2 w-12 h-12 rounded-lg bg-orange-500/30 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-6 h-6 text-orange-400" />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-orange-500/10 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Editing Timeline Animation */}
        <div className="w-full flex flex-col gap-2 relative">
          {/* Timeline Ruler */}
          <div className="w-full h-4 border-b border-zinc-200 mb-1 flex justify-between px-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`w-px ${i % 2 === 0 ? 'h-full bg-zinc-300' : 'h-1/2 bg-zinc-200 mt-auto'}`} />
            ))}
          </div>

          {[
            { color: '#f59e0b', width: '40%', x: '10%', delay: 0 },
            { color: '#f97316', width: '30%', x: '55%', delay: 0.2 },
            { color: '#ef4444', width: '25%', x: '20%', delay: 0.4 },
          ].map((track, i) => (
            <div key={i} className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200/50 shadow-inner">
              <motion.div 
                className="absolute h-full rounded-full shadow-sm"
                style={{ backgroundColor: track.color, left: track.x, width: track.width }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: track.delay }}
              />
            </div>
          ))}

          {/* Moving Playhead */}
          <motion.div 
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
            animate={{ left: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rotate-45 bg-red-500 shadow-sm" />
          </motion.div>
        </div>

        {/* Global VFX Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {isMounted && [...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-orange-400/30"
              initial={{ 
                x: Math.random() * 300 - 150 + 150, 
                y: Math.random() * 300 - 150 + 150, 
                opacity: 0 
              }}
              animate={{ 
                y: [null, -100], 
                opacity: [0, 1, 0],
                scale: [0, 1, 0] 
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                repeat: Infinity, 
                delay: Math.random() * 5 
              }}
            />
          ))}
        </div>
      </div>
    </CardShell>
  );
}

// ─── Lottie Card ────────────────────────────────────────────────────────────
function LottieCard({ service }: { service: LottieService }) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const animationData = useLottieData(service.lottieUrl);

  return (
    <CardShell
      service={service}
    >
      <div className={`w-full h-full flex items-center justify-center p-6 ${service.isTall ? 'pb-32' : 'pb-24'}`}>
        {animationData ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            autoplay={true}
            loop
            className={`w-full h-full object-contain ${service.isTall ? 'scale-125' : 'scale-110'}`}
          />
        ) : (
          <div className="w-32 h-32 rounded-2xl bg-zinc-100 animate-pulse" />
        )}
      </div>
    </CardShell>
  );
}
