'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle2, Zap, Film, Palette, Globe, Cpu, Eye, Box, ExternalLink, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Service } from '@/constants/services';

const iconMap = {
  Zap,
  Film,
  Palette,
  Globe,
  Cpu,
  Eye,
  Box,
  Sparkles
};

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
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(3);

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

      {/* Hero Section */}
      <section className="relative pt-52 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">
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
        className="relative py-20 px-6 md:px-12 lg:px-24 bg-white border-t border-zinc-100 overflow-hidden"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 lg:gap-y-48 gap-x-12 relative z-10">
                    {service.providedServices.map((subService, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9, rotate: i % 2 === 0 ? -4 : 4 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: (i % 2 === 0 ? -1.2 : 1.2) }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                        whileHover={{ y: -15, rotate: 0, transition: { duration: 0.4 } }}
                        className="relative group bg-white p-10 pt-16 rounded-[44px] shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-zinc-100 flex flex-col items-center text-center gap-8"
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

      {/* Visual Showcase (Featured Content) */}
      {service.contents && service.contents.length > 0 && (
        <section className="py-32 px-6 md:px-12 lg:px-24 border-t border-zinc-100 overflow-hidden bg-white">
          <div className="max-w-[1200px] mx-auto text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">Featured Projects</h2>
            <p className="text-zinc-500 mt-4 max-w-xl mx-auto text-lg leading-relaxed">Deep dive into recent successful deliveries and project processes.</p>
          </div>

          <div className="max-w-[1200px] mx-auto flex flex-col gap-20">
            {service.contents.slice(0, displayLimit).map((item, i) => {
              if (item.type === 'project') {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    whileHover="hover"
                    onMouseEnter={() => setHoveredProject(item.title)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onMouseMove={handleMouseMove}
                    className="relative group w-full"
                  >
                    <a 
                      href={item.url || "#"} 
                      target={item.url ? "_blank" : undefined}
                      rel={item.url ? "noopener noreferrer" : undefined}
                      className={item.url ? "cursor-none block" : "block"}
                    >
                      <motion.div 
                        variants={{
                          hover: { y: -8, transition: { duration: 0.4, ease: 'easeOut' } }
                        }}
                        className="relative rounded-[28px] border-[5px] border-zinc-200 bg-white overflow-hidden transition-all hover:shadow-2xl hover:border-zinc-300 shadow-sm"
                      >
                        {/* Technical Stripe Background (Layered Design) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] z-0" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id={`stripes-proj-unified-${i}`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                              <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="2" className="text-zinc-600" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#stripes-proj-unified-${i})`} />
                        </svg>

                        {/* Accent sliding top bar */}
                        <motion.div
                          className="absolute top-0 left-0 h-[3px] rounded-full z-40 bg-zinc-950"
                          variants={{ 
                            initial: { width: '0%' }, 
                            hover: { width: '100%', transition: { duration: 0.4 } } 
                          }}
                        />

                        {/* Content Grid */}
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
                          {/* Left: Project Info */}
                          <div className="p-8 md:p-10 flex flex-col justify-center gap-6 lg:border-r border-zinc-100 bg-white/50 backdrop-blur-[2px]">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-4">
                                {/* Project Icon */}
                                <motion.div 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  whileInView={{ scale: 1, opacity: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: 0.2 }}
                                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 bg-zinc-900"
                                  style={{ 
                                    boxShadow: `0 4px 12px -2px rgba(0,0,0,0.2)`
                                  }}
                                >
                                  {(() => {
                                    const IconComponent = iconMap[item.projectIcon as keyof typeof iconMap] || Sparkles;
                                    return <IconComponent className="w-5 h-5" />;
                                  })()}
                                </motion.div>
                                
                                <h3 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">{item.title}</h3>
                              </div>
                              
                              <p className="text-base text-zinc-500 leading-relaxed max-w-md font-medium">
                                {item.description}
                              </p>
                            </div>

                            {/* Metadata Pills */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100">
                              {[item.date, item.duration, item.role].filter(Boolean).map((tag, tagIndex) => (
                                <div 
                                  key={tagIndex}
                                  className="px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-600 text-xs font-semibold tracking-wide shadow-sm"
                                >
                                  {tag}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: Project Visual */}
                          <div 
                            className="p-10 md:p-12 flex items-center justify-center bg-zinc-50/10 relative overflow-hidden"
                            style={{ backgroundColor: `${item.bgColor || '#f9fafb'}08` }}
                          >
                            {/* Top/Bottom Seamless Fades */}
                            <div className="absolute top-0 left-0 right-0 h-20 z-10 bg-linear-to-b from-white to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 left-0 right-0 h-20 z-10 bg-linear-to-t from-white to-transparent pointer-events-none" />

                            <div className="relative z-10 w-full max-w-[480px] aspect-4/3">
                              {/* Device Mockup Placeholder - Tablet / Pad style */}
                              <div className="absolute inset-0 bg-zinc-900 rounded-[2.5rem] border-8 border-zinc-800 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-8 bg-zinc-800 flex items-center px-5 gap-2.5">
                                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                                  <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                                  <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
                                </div>
                                <div className="absolute inset-0 top-8 bg-zinc-800/50 flex flex-col items-center justify-center p-8">
                                  <motion.div 
                                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-32 h-2 bg-zinc-700 rounded-full mb-5" 
                                  />
                                  <div className="w-14 h-14 rounded-full border-2 border-zinc-700 flex items-center justify-center">
                                    <Sparkles className="w-7 h-7 text-zinc-600" />
                                  </div>
                                </div>
                              </div>
                              
                              {item.mockupImage && (
                                <img 
                                  src={item.mockupImage} 
                                  alt={item.title}
                                  className="absolute inset-0 w-full h-full object-cover rounded-[2.5rem] opacity-0 transition-opacity"
                                  onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                              )}

                              {/* Behance Indicator Badge */}
                              {item.url?.includes('behance.net') && (
                                <div className="absolute top-12 right-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold tracking-widest shadow-lg">
                                  BEHANCE <ExternalLink className="w-3 h-3" />
                                </div>
                              )}
                            </div>

                            {/* Floating Accent Glow */}
                            <div 
                              className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-[0.05] pointer-events-none z-0 bg-zinc-400"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </a>
                  </motion.div>
                );
              }

              // Fallback to simpler card for other content types
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover="hover"
                  className="relative rounded-[32px] border-[5px] border-zinc-200 bg-white overflow-hidden group shadow-md max-w-xl mx-auto transition-all hover:border-zinc-300 hover:shadow-xl"
                >
                  {/* Technical Stripe Background */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] z-0" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`stripes-fallback-${i}`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="2" className="text-zinc-600" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#stripes-fallback-${i})`} />
                  </svg>

                  {/* Accent sliding top bar */}
                  <motion.div
                    className="absolute top-0 left-0 h-[4px] rounded-full z-40 bg-zinc-950"
                    variants={{ 
                      initial: { width: '0%' }, 
                      hover: { width: '100%', transition: { duration: 0.4 } } 
                    }}
                  />

                  <div className="aspect-video bg-zinc-100 relative overflow-hidden z-10">
                    {item.type === 'video' ? (
                       <video 
                        src={item.url} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-50 font-bold text-zinc-300">
                        {item.title}
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
                    <p className="text-zinc-500 mt-2">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Load More Button */}
          {service.contents && service.contents.length > displayLimit && (
            <div className="flex justify-center mt-24">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setDisplayLimit(service.contents!.length)}
                whileHover={{ scale: 1.03, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center no-underline transition-all duration-300"
                style={{
                  gap: '15.945px',
                  background: 'linear-gradient(208.44deg, #444 5%, #111 84%)',
                  border: '2.657px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  padding: '9.744px 9.744px 9.744px 31.004px',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  fontSize: '15px',
                  color: '#fff',
                }}
              >
                <span className="min-w-[80px] text-center">Load More Projects</span>
                <span
                  className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
                  style={{ width: '46.949px', height: '46.949px' }}
                >
                  <ArrowUpRight className="text-[#0b0b0c] w-[18px] h-[18px]" strokeWidth={2.2} />
                </span>
              </motion.button>
            </div>
          )}
        </section>
      )}

      {/* Floating Project Cursor Bubble */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-0 left-0 pointer-events-none z-100 px-4 py-2 bg-zinc-900 text-white rounded-full text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 border border-white/20"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: 20, // Offset horizontally
              translateY: 20, // Offset vertically
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {hoveredProject}
            <ExternalLink className="w-3 h-3 text-zinc-400 ml-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
