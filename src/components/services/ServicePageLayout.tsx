'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle2, Zap, Film, Palette, Globe, Cpu, Eye, Box, ExternalLink, ArrowUpRight, Figma, Github, Code2, Instagram, Youtube, Dribbble, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { Service, ProjectLink } from '@/constants/services';

const iconMap = {
  Zap,
  Film,
  Palette,
  Globe,
  Cpu,
  Eye,
  Box,
  Sparkles,
  Figma,
  Github,
  Code2,
  Instagram,
  Youtube,
  Dribbble,
  ExternalLink,
  ArrowUpRight,
  Calendar,
  Clock,
  User
};

// ─── Video Preview Sub-Component ──────────────────────────────────────────
function VideoPreview({ videoUrl, poster }: { videoUrl: string; poster?: string }) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      className="w-full h-full object-cover"
    >
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
}

interface ServicePageLayoutProps {
  service: Service;
}

export default function ServicePageLayout({ service }: ServicePageLayoutProps) {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Cursor Follow Logic for Project Cards
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoveredLinkLabel, setHoveredLinkLabel] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getLinkProvider = (url: string = "") => {
    if (url.includes('behance')) return 'Behance';
    if (url.includes('dribbble')) return 'Dribbble';
    if (url.includes('github')) return 'GitHub';
    if (url.includes('figma')) return 'Figma';
    if (url.includes('youtube')) return 'YouTube';
    if (url.includes('instagram')) return 'Instagram';
    return 'View Project';
  };

  // Projects count for the stack
  const projectItems = (service.contents || []).filter(item => item.type === 'project');

  const handleMouseMove = (e: React.MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  if (!service) return null;

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Navigation */}
      <nav className="fixed top-24 left-0 right-0 z-50 px-6 md:px-12 flex justify-between items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto"
        >
          <Link 
            href="/services" 
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </motion.div>
      </nav>

      {/* Dynamic Cursor Bubble */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            style={{
              left: cursorXSpring,
              top: cursorYSpring,
              position: 'fixed',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/20 -translate-x-1/2 -translate-y-[120%]"
          >
            <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
              {hoveredLinkLabel}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-44 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* ── Vertical & Horizontal Grid Overlay with High-Density Pseudo-Random Dots ─────────────────────────── */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(rgba(59, 130, 246, 0.9) 2.5px, transparent 0),
              radial-gradient(rgba(59, 130, 246, 0.7) 2px, transparent 0),
              radial-gradient(rgba(59, 130, 246, 0.6) 1.5px, transparent 0),
              radial-gradient(rgba(59, 130, 246, 0.5) 1.2px, transparent 0),
              radial-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 0),
              radial-gradient(rgba(59, 130, 246, 0.3) 0.8px, transparent 0),
              linear-gradient(to right, rgba(59, 130, 246, 0.25) 1.5px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.25) 1.5px, transparent 1px)
            `,
            backgroundSize: '350px 350px, 450px 450px, 600px 600px, 800px 800px, 500px 500px, 400px 400px, 100px 100px, 100px 100px',
            backgroundPosition: '55px 130px, 240px 95px, 310px 440px, 180px 220px, 420px 310px, 120px 280px, center top, center top',
            maskImage: 'linear-gradient(to bottom, transparent 2%, black 15%, black 85%, transparent 98%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 2%, black 15%, black 85%, transparent 98%)'
          }}
        />

        {/* Subtle Background Accent */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.05] pointer-events-none -mt-40 z-0"
          style={{ backgroundColor: '#71717a' }} // Neutral Zinc-500
        />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex flex-col gap-8 items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-7xl lg:text-[8rem] font-bold tracking-tight text-zinc-900 leading-[0.8] md:whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display), "Kangki", serif' }}
            >
              {service.title.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "text-zinc-400" : ""}>
                  {word}{i === 0 ? " " : ""}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-zinc-500 max-w-3xl leading-relaxed mt-4"
            >
              {service.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section 
        className="relative pt-20 pb-10 px-6 md:px-12 lg:px-24 bg-white border-t border-zinc-100 overflow-hidden"
      >
        {/* Section-specific Dotted Grid Background */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(circle, #71717a 2px, transparent 2px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Main Content Area: Reordered & Centered */}
            <div className="lg:col-span-12 flex flex-col gap-2">
              {/* The Approach Section (Now at the top) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-10 text-zinc-900 tracking-tight">The Creative Process</h2>
                <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-medium balance">
                  {service.detailedDescription}
                </p>
                <div className="w-px h-24 bg-linear-to-b from-zinc-200 to-transparent mx-auto mt-12 mb-0" />
              </motion.div>

              {/* What's Included Section: Serpentine Path Layout */}
              <div className="w-full relative pt-0 pb-4 px-4 overflow-visible">
                <div className="text-center mb-16 relative z-10">
                  <span className="px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-6 inline-block">Strategy & Deliverables</span>
                  <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">Let us show you how we drive <br /> your brand to new heights</h2>
                </div>

                <div className="relative max-w-[1200px] mx-auto min-h-[600px]">
                  {/* SVG Connecting Path (Hand-Drawn Curly Serpentine Flow) */}
                  <div className="absolute inset-0 pointer-events-none hidden lg:block z-0 -top-10 -bottom-10">
                    <motion.svg 
                      width="100%" 
                      height="100%" 
                      viewBox="0 0 1000 1000" 
                      fill="none" 
                      preserveAspectRatio="none"
                      className="overflow-visible"
                    >
                      <motion.path
                        /* Curly Serpentine Path following the cards (1->2->3, Turn, 4->5->6) */
                        d="M 166 80 C 300 60, 400 100, 500 80 C 600 60, 750 100, 834 80 C 1100 80, 1100 400, 500 400 C -100 400, -100 720, 166 720 C 300 700, 400 740, 500 720 C 600 700, 750 740, 834 720"
                        stroke="#18181b" 
                        strokeWidth="2.5"
                        strokeDasharray="2 18" /* Dramatic dots */
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 1000, opacity: 0 }}
                        whileInView={{ strokeDashoffset: 0, opacity: 0.6 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 4, ease: "linear" }}
                      />
                      {/* End Arrow marker */}
                      <motion.path 
                        d="M 825 710 L 834 720 L 825 730"
                        stroke="#18181b"
                        strokeWidth="2.5"
                        strokeDasharray="2 18"
                        strokeLinecap="round"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.6 }}
                        viewport={{ once: true }}
                        transition={{ delay: 3.5 }}
                      />
                    </motion.svg>
                  </div>

                  {/* Horizontal Grid (3 per row) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 lg:gap-y-32 gap-x-10 relative z-10">
                    {service.providedServices.map((subService, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9, rotate: i % 2 === 0 ? -4 : 4 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: (i % 2 === 0 ? -1.2 : 1.2) }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                        whileHover={{ y: -15, rotate: 0, transition: { duration: 0.4 } }}
                        className="relative group bg-white p-8 pt-14 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-zinc-100 flex flex-col items-center text-center gap-6"
                      >
                        {/* Number Indicator & Punched Hole Aesthetics */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 shadow-xl flex items-center justify-center mb-3">
                             <div className="w-3.5 h-3.5 rounded-full bg-white/20 shadow-inner border border-white/10" /> {/* Punched out look */}
                          </div>
                          <span className="text-sm font-black text-zinc-900 tracking-tighter">0{i + 1}</span>
                        </div>

                        {/* Icon Wrapper */}
                        <div 
                          className="w-16 h-16 rounded-4xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 shadow-sm bg-zinc-950/5"
                        >
                          <CheckCircle2 className="w-7 h-7 text-zinc-900" />
                        </div>

                        <div className="flex flex-col gap-4">
                          <h4 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">{subService}</h4>
                          <p className="text-sm text-zinc-500 leading-relaxed font-medium px-2">
                             Premium design system implementation and high-fidelity project assets tailored to your brand goals.
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase (3D Stacked Projects) */}
      {service.contents && service.contents.length > 0 && (
        <section className="pt-24 pb-32 border-t border-zinc-100 overflow-hidden bg-white">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">Featured Projects</h2>
              <p className="text-zinc-500 mt-4 text-lg leading-relaxed font-medium">Deep dive into recent successful deliveries and project processes.</p>
            </div>
            
            {/* Stack Controls */}
            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${
                  activeIndex === 0 ? 'border-zinc-100 text-zinc-200 bg-zinc-50/50' : 'border-zinc-200 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 bg-white'
                }`}
              >
                <ArrowLeft className="w-5 h-5 rotate-90" />
              </motion.button>
              
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Project</span>
                <span className="text-lg font-black text-zinc-900">0{activeIndex + 1}<span className="text-zinc-300 mx-1">/</span>0{projectItems.length}</span>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={activeIndex === projectItems.length - 1}
                onClick={() => setActiveIndex(prev => Math.min(projectItems.length - 1, prev + 1))}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all shadow-lg font-bold ${
                  activeIndex === projectItems.length - 1 ? 'border-zinc-100 text-zinc-200 bg-zinc-50/50' : 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                <ArrowUpRight className="w-5 h-5 rotate-135" />
              </motion.button>
            </div>
          </div>

          {/* 3D Stack Container */}
          <div className="relative h-[650px] lg:h-[520px] max-w-[1100px] mx-auto px-6" style={{ perspective: '1200px' }}>
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {projectItems.map((item, idx) => {
                  const diff = idx - activeIndex;
                  const isVisible = Math.abs(diff) <= 2;
                  
                  if (!isVisible && diff !== 0) return null;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ 
                        opacity: 0, 
                        scale: 0.8,
                        y: diff > 0 ? -200 : 800, // Come from stack (top) or below if returning
                        rotateX: 10,
                        rotateY: 0,
                        z: -100
                      }}
                      animate={{ 
                        opacity: diff === 0 ? 1 : diff > 0 ? 1 - (diff * 0.15) : 0, // High opacity for back cards
                        scale: 1 - Math.abs(diff) * 0.05,
                        y: diff * -55, // Stack spacing increased to see back cards properly
                        zIndex: projectItems.length - Math.abs(diff),
                        rotateX: 12 + (diff * -2), 
                        rotateY: 0,
                        z: diff * -80,
                        filter: 'none', // Removed blur so back cards is clearly visible
                        boxShadow: diff > 0 ? '0px -10px 40px rgba(0,0,0,0.1)' : 'none'
                      }}
                      exit={{ 
                        opacity: 1, // physical drop, no fade out
                        scale: 0.9,
                        y: 800, // Drops completely down
                        transition: { duration: 0.4, ease: "circIn" }
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 25 
                      }}
                      drag="y"
                      dragConstraints={{ top: 0, bottom: 0 }}
                      onDragEnd={(_, info) => {
                        if (info.offset.y < -50 && activeIndex < projectItems.length - 1) {
                          setActiveIndex(prev => prev + 1);
                        } else if (info.offset.y > 50 && activeIndex > 0) {
                          setActiveIndex(prev => prev - 1);
                        }
                      }}
                      onMouseEnter={() => {
                        if (diff === 0) {
                          setHoveredProject(item.title);
                          setHoveredLinkLabel(activeIndex < projectItems.length - 1 ? "Next Project" : "Last Project");
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredProject(null);
                        setHoveredLinkLabel(null);
                      }}
                      onMouseMove={(e) => {
                        if (diff === 0) {
                          cursorX.set(e.clientX);
                          cursorY.set(e.clientY);
                        }
                      }}
                      onClick={() => {
                        if (diff === 0 && activeIndex < projectItems.length - 1) {
                           setActiveIndex(prev => prev + 1);
                        }
                      }}
                      className={`absolute w-full max-w-[1000px] h-[580px] lg:h-[480px] group ${diff === 0 ? 'cursor-none lg:cursor-pointer' : 'pointer-events-none'}`}
                    >
                      <div className="block h-full w-full outline-none">
                        <div className="relative h-full w-full rounded-[40px] bg-zinc-50 border-[5px] border-zinc-200 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] flex flex-col lg:flex-row transition-all group-hover:border-zinc-300">
                          {/* Card Content (Preserving existing layout) */}
                          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-20 pointer-events-auto">
                            <div className="flex items-start justify-between mb-8">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-xl">
                                  {(() => {
                                    const IconComponent = iconMap[item.projectIcon as keyof typeof iconMap] || Sparkles;
                                    return <IconComponent className="w-6 h-6" />;
                                  })()}
                                </div>
                                <div>
                                   <a 
                                     href={item.projectLinks?.[0]?.url || item.url || "#"} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="hover:text-blue-600 transition-colors inline-block cursor-pointer"
                                     onClick={(e) => e.stopPropagation()}
                                     onMouseEnter={() => setHoveredLinkLabel("View Project")}
                                     onMouseLeave={() => setHoveredLinkLabel(activeIndex < projectItems.length - 1 ? "Next Project" : "Last Project")}
                                   >
                                     <h3 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-none mb-1">{item.title}</h3>
                                   </a>
                                   <div className="flex items-center gap-3">
                                     {item.techStack?.slice(0, 2).map((tech, tIdx) => (
                                       <span key={tIdx} className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{tech}</span>
                                     ))}
                                   </div>
                                </div>
                              </div>
                              <a 
                                href={item.projectLinks?.[0]?.url || item.url || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full border-2 border-zinc-100 flex items-center justify-center text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 transition-colors cursor-pointer z-30 relative"
                                onClick={(e) => e.stopPropagation()}
                                onMouseEnter={() => setHoveredLinkLabel("View Project")}
                                onMouseLeave={() => setHoveredLinkLabel(activeIndex < projectItems.length - 1 ? "Next Project" : "Last Project")}
                              >
                                <ArrowUpRight className="w-6 h-6" />
                              </a>
                            </div>

                            <p className="text-base md:text-lg text-zinc-600 font-medium leading-relaxed max-w-lg balance mb-8">
                              {item.description}
                            </p>

                            <div className="pt-8 border-t border-zinc-100/50 flex flex-wrap gap-3">
                              {[
                                { icon: Calendar, text: item.date || "Sept 2025" },
                                { icon: Clock, text: item.duration || "2-3 Weeks" },
                                { icon: User, text: item.role || "Lead Designer" }
                              ].map((pill, pIdx) => (
                                <div key={pIdx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-100 shadow-sm">
                                  <pill.icon className="w-3 h-3 text-zinc-400" />
                                  <span className="text-[10px] font-black text-zinc-900 uppercase tracking-wider">{pill.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="lg:w-[45%] h-[300px] lg:h-full relative overflow-hidden bg-white/40 flex items-start justify-center">
                            <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img src="/mockups/hand_held_phone.png" alt="Mockup" className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none scale-100 lg:scale-[1.1] " />
                              <div 
                                className="relative w-[124px] h-[268px] lg:w-[145px] lg:h-[312px] bg-zinc-200 rounded-[28px] overflow-hidden z-10 shadow-inner"
                                style={{ transform: 'perspective(1200px) rotateY(-11deg) rotateX(4deg) translate(-5px, -26px)' }}
                              >
                                {item.videoUrl ? (
                                  <VideoPreview videoUrl={item.videoUrl} poster={item.mockupImage} />
                                ) : item.mockupImage ? (
                                  <img src={item.mockupImage} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-white/20" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Hover Progress Accent */}
                          <motion.div 
                            className="absolute bottom-0 left-0 h-1.5 bg-zinc-950 z-50 text-white"
                            initial={{ width: 0 }}
                            whileHover={{ width: '100%', transition: { duration: 0.8, ease: "circOut" } }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Dynamic Redirect Button */}
          <div className="flex justify-center mt-12">
            <Link href={service.projectsUrl || "/projects"} className="no-underline">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center no-underline transition-all duration-300"
                style={{
                  gap: '15px',
                  background: 'linear-gradient(208.44deg, #444 5%, #111 84%)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  padding: '10px 10px 10px 30px',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  fontSize: '15px',
                  color: '#fff',
                }}
              >
                <span className="min-w-[80px] text-center">{service.projectsLabel || "View More"}</span>
                <span
                  className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
                  style={{ width: '46px', height: '46px' }}
                >
                  <ArrowUpRight className="text-zinc-950 w-[18px] h-[18px]" strokeWidth={2.2} />
                </span>
              </motion.button>
            </Link>
          </div>
        </section>
      )}

      {/* End of Main Content */}
    </div>
  );
}
