"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useSpring } from "framer-motion";
import CardSwap, { Card } from "@/components/effects/CardSwap";
import { ArchGallery } from "@/components/ui/ArchGallery";
import { MobileProjectStack } from "@/components/ui/MobileProjectStack";
import { CreativeMobileStack } from "@/components/ui/CreativeMobileStack";
import { SiteCopyCreativeCategory } from "@/lib/site-copy-content";

interface RecentProjectsProps {
  heading: string;
  intro: string;
  webTitle: string;
  webCopy: string;
  webCtaLabel: string;
  creativeTitle: string;
  creativeCopy: string;
  creativeCtaLabel: string;
  creativeCategories: SiteCopyCreativeCategory[];
}

export default function RecentProjects({
  heading,
  intro,
  webTitle,
  webCopy,
  webCtaLabel,
  creativeTitle,
  creativeCopy,
  creativeCtaLabel,
  creativeCategories,
}: RecentProjectsProps) {
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [hoveredUrl, setHoveredUrl] = useState("Visit Site");
  const [activeCreativeIndex, setActiveCreativeIndex] = useState(0);

  // Use spring for smooth cursor following
  const cursorX = useSpring(-100, { stiffness: 400, damping: 28 });
  const cursorY = useSpring(-100, { stiffness: 400, damping: 28 });

  const activeCategory = creativeCategories[activeCreativeIndex] || creativeCategories[0];

  return (
    <section className="pt-24 pb-8 px-4 md:px-8 lg:px-20 w-full bg-transparent relative z-20">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* Custom Cursor Bubble */}
        <motion.div
           style={{
             position: 'fixed',
             top: 0,
             left: 0,
             x: cursorX,
             y: cursorY,
             pointerEvents: 'none',
             zIndex: 9999
           }}
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ 
             opacity: isHoveringCard ? 1 : 0, 
             scale: isHoveringCard ? 1 : 0.5 
           }}
           className="w-auto px-6 h-12 bg-[#3b5bdb]/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-sm font-medium shadow-xl whitespace-nowrap"
        >
           {hoveredUrl}
        </motion.div>

        {/* HEADER SECTION */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-black" dangerouslySetInnerHTML={{ __html: heading.replace(/\[(.*?)\]/g, '<span class="text-blue-600 font-serif italic font-medium">$1</span>') }} />
          <p className="text-black/70 text-base md:text-lg leading-relaxed max-w-3xl px-6 lg:px-0 text-justify lg:text-left [text-align-last:center] lg:[text-align-last:auto]">
            {intro}
          </p>
        </div>

        {/* WEB DEVELOPMENT BLOCK */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex flex-col mt-4 md:mt-6 gap-6 overflow-visible relative"
        >
          {/* Section Heading */}
          <div className="flex flex-col gap-3 max-w-[800px] mb-0 items-start text-left px-6 lg:px-0">
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900">
              {webTitle}
            </h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-3xl text-left">
              {webCopy}
            </p>
          </div>

          {/* Large Image Placeholder */}
          {/* DESKTOP VIEW: Hidden on Small Screens, Flex on Large Screens */}
          <div 
            className="hidden lg:flex w-full aspect-video bg-white rounded-2xl overflow-hidden items-center justify-center relative shadow-sm hover:shadow-md transition-shadow z-10 border-[5px] border-zinc-200"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.08) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)
              `,
              backgroundSize: '80px 80px'
            }}
          >
             <div className="absolute inset-0 bg-linear-to-r from-transparent to-blue-100/50 mix-blend-multiply pointer-events-none z-0"></div>
             {/* Text mimicking the mock */}
             <div className="absolute left-16 text-zinc-900 max-w-sm z-30 pointer-events-none flex flex-col items-start">
                <h4 className="text-3xl font-medium mb-2 border-l-4 pl-4 border-zinc-300">Interactive &amp;<br />Dynamic UIs</h4>
                <p className="text-zinc-500 text-sm pl-4 mb-6 leading-relaxed">
                  Explore some of my recent frontend projects, featuring seamless animations, modern architectures, and highly responsive user interfaces tailored for high conversion.
                </p>
                
                <Link
                  href="/projects"
                  className="group inline-flex items-center no-underline pointer-events-auto ml-4 shadow-lg shadow-blue-500/20 px-6 py-2 bg-zinc-900 text-white rounded-full font-medium"
                  style={{
                    background: 'linear-gradient(208.44deg, #5b74ff 5%, #001bb0 84%)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <span className="mr-3">{webCtaLabel}</span>
                  <div className="flex h-8 w-8 items-center justify-center bg-white rounded-full transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="text-[#0b0b0c] w-4 h-4" />
                  </div>
                </Link>
             </div>
             {/* Card Swap Component */}
             <div 
               className="absolute right-12 bottom-0 top-0 w-1/2 flex items-center justify-center opacity-90 cursor-none z-20"
               onMouseEnter={() => setIsHoveringCard(true)}
               onMouseLeave={() => { setIsHoveringCard(false); setHoveredUrl("Visit Site"); }}
               onMouseMove={(e) => {
                 cursorX.set(e.clientX - 48);
                 cursorY.set(e.clientY - 48);
               }}
             >
               <CardSwap pauseOnHover={false}>
                 <Card className="overflow-hidden shadow-lg w-[360px] h-[260px]">
                   <a 
                     href="https://awwwards.com" target="_blank" rel="noopener noreferrer" 
                     className="flex flex-col w-full h-full cursor-none pointer-events-auto"
                     onMouseEnter={() => setHoveredUrl("awwwards.com")}
                     onMouseLeave={() => setHoveredUrl("Visit Site")}
                   >
                     <div className="w-full h-[40px] flex items-center px-4 bg-zinc-100/80 backdrop-blur-sm border-b border-zinc-200 shrink-0">
                         <div className="flex gap-1.5 shrink-0">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                         </div>
                         <div className="mx-auto bg-white px-4 py-1 text-xs rounded-md text-zinc-500 border border-zinc-200 shadow-sm flex items-center gap-1 font-mono tracking-tighter">
                             awwwards.com
                         </div>
                         <div className="w-7"></div>
                     </div>
                     <div className="flex-1 w-full relative bg-zinc-200">
                         <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" alt="Web Dev 1" className="absolute inset-0 w-full h-full object-cover object-top" />
                     </div>
                   </a>
                 </Card>
                 <Card className="overflow-hidden shadow-lg w-[360px] h-[260px]">
                   <a 
                     href="https://dribbble.com" target="_blank" rel="noopener noreferrer" 
                     className="flex flex-col w-full h-full cursor-none pointer-events-auto"
                     onMouseEnter={() => setHoveredUrl("dribbble.com")}
                     onMouseLeave={() => setHoveredUrl("Visit Site")}
                   >
                     <div className="w-full h-[40px] flex items-center px-4 bg-zinc-100/80 backdrop-blur-sm border-b border-zinc-200 shrink-0">
                         <div className="flex gap-1.5 shrink-0">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                         </div>
                         <div className="mx-auto bg-white px-4 py-1 text-xs rounded-md text-zinc-500 border border-zinc-200 shadow-sm flex items-center gap-1 font-mono tracking-tighter">
                             dribbble.com
                         </div>
                         <div className="w-7"></div>
                     </div>
                     <div className="flex-1 w-full relative bg-zinc-200">
                         <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" alt="Web Dev 2" className="absolute inset-0 w-full h-full object-cover object-top" />
                     </div>
                   </a>
                 </Card>
                 <Card className="overflow-hidden shadow-lg w-[360px] h-[260px]">
                   <a 
                     href="https://behance.net" target="_blank" rel="noopener noreferrer" 
                     className="flex flex-col w-full h-full cursor-none pointer-events-auto"
                     onMouseEnter={() => setHoveredUrl("behance.net")}
                     onMouseLeave={() => setHoveredUrl("Visit Site")}
                   >
                     <div className="w-full h-[40px] flex items-center px-4 bg-zinc-100/80 backdrop-blur-sm border-b border-zinc-200 shrink-0">
                         <div className="flex gap-1.5 shrink-0">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                         </div>
                         <div className="mx-auto bg-white px-4 py-1 text-xs rounded-md text-zinc-500 border border-zinc-200 shadow-sm flex items-center gap-1 font-mono tracking-tighter">
                             behance.net
                         </div>
                         <div className="w-7"></div>
                     </div>
                     <div className="flex-1 w-full relative bg-zinc-200">
                         <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format&fit=crop" alt="Web Dev 3" className="absolute inset-0 w-full h-full object-cover object-top" />
                     </div>
                   </a>
                 </Card>
               </CardSwap>
             </div>
          </div>

          {/* MOBILE VIEW: Hidden on Large Screens, Block on Small Screens */}
          {/* MOBILE VIEW: Hidden on Large Screens, Block on Small Screens */}
          {/* MOBILE VIEW: Hidden on Large Screens, Block on Small Screens */}
          <div className="lg:hidden w-full flex flex-col gap-8 pb-10 relative z-10 px-4 mt-0">
             {/* 3D Staggered Card Stack - Bespoke Mobile Engine */}
             <div className="relative w-full overflow-visible">
                <MobileProjectStack 
                  projects={[
                    { id: 1, url: "awwwards.com", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800" },
                    { id: 2, url: "dribbble.com", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800" },
                    { id: 3, url: "behance.net", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800" }
                  ]}
                  autoPlayInterval={4000}
                />
             </div>

             {/* View Project Button: Creative Stuff Style */}
             <div className="flex justify-center w-full mt-2">
               <Link
                 href="/projects"
                 className="group inline-flex items-center justify-between no-underline pointer-events-auto shadow-xl transition-all active:scale-95"
                 style={{
                   gap: '12px',
                   background: 'linear-gradient(208.44deg, #5b74ff 5%, #001bb0 84%)', 
                   border: '1.5px solid rgba(255,255,255,0.1)',
                   borderRadius: '9999px',
                   padding: '8px 8px 8px 24px',
                   fontFamily: 'var(--font-sans)', 
                   fontWeight: 500,
                   fontSize: '15px', 
                   color: '#fff', 
                   textDecoration: 'none',
                 }}
               >
                 <span style={{ minWidth: '80px', textAlign: 'center' }}>View Project</span>
                 <span
                   className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-active:rotate-45"
                   style={{ width: '42px', height: '42px' }}
                 >
                   <ArrowUpRight className="text-[#0b0b0c]" style={{ width: '20px', height: '20px' }} strokeWidth={2.4} />
                 </span>
               </Link>
             </div>
          </div>
        </motion.div>

        {/* CREATIVE STUFF BLOCK */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-full flex flex-col mt-4 md:mt-8 gap-6 overflow-visible relative"
        >
          {/* Section Heading */}
          <div className="flex flex-col gap-3 max-w-[800px] mb-4 items-start text-left px-6 lg:px-0">
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900">
              {creativeTitle}
            </h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-3xl text-left">
              {creativeCopy}
            </p>
          </div>

          <div className="w-full relative overflow-visible flex flex-col items-center justify-end pb-12 md:pb-24 pt-[440px] lg:pt-[450px] min-h-[620px] lg:min-h-[650px]">
             
             {/* Arched Gallery Background (Desktop Only) */}
             <div className="hidden lg:block absolute inset-0">
               <ArchGallery 
                  categories={creativeCategories} 
                  selectedIndex={activeCreativeIndex} 
                  onSelect={(idx: number) => setActiveCreativeIndex(idx)} 
               />
             </div>

             {/* Mobile Stack (Mobile Only) */}
             <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center pt-8">
               <CreativeMobileStack 
                  items={creativeCategories}
                  currentIndex={activeCreativeIndex}
                  onIndexChange={(idx: number) => setActiveCreativeIndex(idx)}
               />
             </div>

             {/* Center Call to Action Text with Navigation */}
             <div className="z-20 text-center flex flex-col items-center max-w-2xl px-6 relative pointer-events-auto">
                 {/* Navigation Buttons above the heading */}
                 <div className="flex items-center gap-4 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveCreativeIndex((prev) => (prev - 1 + creativeCategories.length) % creativeCategories.length)}
                      className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-sm hover:shadow-md transition-all"
                      aria-label="Previous"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveCreativeIndex((prev) => (prev + 1) % creativeCategories.length)}
                      className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-sm hover:shadow-md transition-all"
                      aria-label="Next"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </motion.button>
                 </div>
                 
                 <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                   {activeCategory.title}
                 </h3>

                 <p className="text-zinc-600 text-sm md:text-base mb-10 max-w-md mx-auto leading-relaxed">
                   {activeCategory.description}
                 </p>
                 
                 <Link
                   href="/contact"
                   className="group inline-flex items-center justify-center no-underline pointer-events-auto shadow-xl"
                   style={{
                     gap: '12px',
                     background: 'linear-gradient(208.44deg, #5b74ff 5%, #001bb0 84%)', 
                     border: '1.5px solid rgba(255,255,255,0.1)',
                     borderRadius: 'var(--radius-full)',
                     padding: '8px 8px 8px 24px',
                     fontFamily: 'var(--font-sans)', fontWeight: 500,
                     fontSize: '14px', color: '#fff', textDecoration: 'none',
                     transition: 'transform 200ms ease',
                   }}
                   onMouseEnter={e => {
                     const el = e.currentTarget as HTMLElement;
                     el.style.transform = 'scale(1.03)';
                   }}
                   onMouseLeave={e => {
                     const el = e.currentTarget as HTMLElement;
                     el.style.transform = 'scale(1)';
                   }}
                 >
                   <span style={{ minWidth: '80px', textAlign: 'center' }}>{creativeCtaLabel}</span>
                   <span
                     className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
                     style={{ width: '38px', height: '38px' }}
                   >
                     <ArrowUpRight className="text-[#0b0b0c]" style={{ width: '18px', height: '18px' }} strokeWidth={2.2} />
                   </span>
                 </Link>
             </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
