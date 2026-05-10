"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useSpring } from "framer-motion";
import CardSwap, { Card } from "@/components/effects/CardSwap";
import { ArchGallery } from "@/components/ui/ArchGallery";
import { MobileProjectStack } from "@/components/ui/MobileProjectStack";
import { CreativeMobileStack } from "@/components/ui/CreativeMobileStack";

import { siteCopyDefaults } from "@/types/site-copy";

import { splitAccentHeading } from "@/lib/accent-heading";

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
  projects = []
}: any) {
  const getHostname = (url: string) => {
    if (!url) return "Visit Site";
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return "Visit Site";
    }
  };
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [hoveredUrl, setHoveredUrl] = useState("Visit Site");
  const [activeCreativeIndex, setActiveCreativeIndex] = useState(3);

  // Use spring for smooth cursor following
  const cursorX = useSpring(-100, { stiffness: 400, damping: 28 });
  const cursorY = useSpring(-100, { stiffness: 400, damping: 28 });

  const displayCategories = creativeCategories && creativeCategories.length > 0 ? creativeCategories : siteCopyDefaults.homeCreativeCategories;
  const activeCategory = displayCategories[activeCreativeIndex];

  const headingParts = splitAccentHeading(heading);
  const webTitleParts = splitAccentHeading(webTitle);
  const creativeTitleParts = splitAccentHeading(creativeTitle);

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
           className="hidden md:flex w-auto px-6 h-12 bg-[#3b5bdb]/90 backdrop-blur-sm rounded-full items-center justify-center text-white text-sm font-medium shadow-xl whitespace-nowrap"
        >
           {hoveredUrl}
        </motion.div>

        {/* HEADER SECTION */}
        <div className="flex flex-col items-center text-center w-full mb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-black">
            {headingParts.before}
            {headingParts.accent ? (
              <span className="text-blue-600 font-serif italic font-medium">{headingParts.accent}</span>
            ) : null}
            {headingParts.after}
          </h2>
          <p className="text-black/70 text-base md:text-lg leading-relaxed max-w-3xl">
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
          <div className="flex flex-col gap-3 max-w-[800px] mb-4">
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900">
              {webTitleParts.before}
              {webTitleParts.accent ? (
                <span className="text-blue-600 font-serif italic font-medium">{webTitleParts.accent}</span>
              ) : null}
              {webTitleParts.after}
            </h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-3xl">
              {webCopy}
            </p>
          </div>

          {/* Mobile View: Website Cards */}
          <div className="md:hidden w-full flex flex-col gap-10 mt-2 mb-12">
            <MobileProjectStack 
              projects={projects.slice(0, 4).map((p: any) => ({
                id: p.id,
                url: getHostname(p.liveUrl || p.githubUrl),
                image: p.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"
              }))} 
            />
            <div className="flex justify-center -mt-6">
              <Link
                href="/projects"
                className="group inline-flex items-center no-underline shadow-lg shadow-blue-500/20"
                style={{
                  gap: '12px',
                  background: 'linear-gradient(208.44deg, #5b74ff 5%, #001bb0 84%)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-full)',
                  padding: '8px 8px 8px 24px',
                  fontFamily: 'var(--font-sans)', fontWeight: 500,
                  fontSize: '14px', color: '#fff', textDecoration: 'none',
                }}
              >
                <span style={{ minWidth: '80px', textAlign: 'center' }}>{webCtaLabel}</span>
                <span
                  className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
                  style={{ width: '38px', height: '38px' }}
                >
                  <ArrowUpRight className="text-[#0b0b0c]" style={{ width: '18px', height: '18px' }} strokeWidth={2.2} />
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop View: Interactive UI Block */}
          <div 
            className="hidden md:flex w-full aspect-video md:aspect-21/9 bg-white rounded-[24px] overflow-hidden items-center justify-center relative shadow-sm hover:shadow-md transition-shadow z-10 border-[5px] border-zinc-200"
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
             <div className="absolute left-8 md:left-16 text-zinc-900 max-w-sm z-30 w-2/3 md:w-auto pointer-events-none flex flex-col items-start">
                <h4 className="text-xl md:text-3xl font-medium mb-2 border-l-4 pl-4 border-zinc-300">Interactive &amp;<br />Dynamic UIs</h4>
                <p className="text-zinc-500 text-xs md:text-sm pl-4 mb-6 leading-relaxed">
                  Explore some of my recent frontend projects, featuring seamless animations, modern architectures, and highly responsive user interfaces tailored for high conversion.
                </p>
                
                <Link
                  href="/projects"
                  className="group inline-flex items-center no-underline pointer-events-auto ml-4 shadow-lg shadow-blue-500/20"
                  style={{
                    gap: '12px',
                    background: 'linear-gradient(208.44deg, #5b74ff 5%, #001bb0 84%)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 8px 8px 24px',
                    fontFamily: 'var(--font-sans)', fontWeight: 500,
                    fontSize: '14px', color: '#fff', textDecoration: 'none',
                    transition: 'box-shadow 300ms ease, transform 200ms ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = '0 14px 36px rgba(0,0,0,0.22)';
                    el.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = 'none';
                    el.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ minWidth: '80px', textAlign: 'center' }}>{webCtaLabel}</span>
                  <span
                    className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
                    style={{ width: '38px', height: '38px' }}
                  >
                    <ArrowUpRight className="text-[#0b0b0c]" style={{ width: '18px', height: '18px' }} strokeWidth={2.2} />
                  </span>
                </Link>
             </div>
             {/* Card Swap Component */}
             <div 
               className="absolute right-0 md:right-4 lg:right-12 bottom-0 top-0 w-[60%] md:w-1/2 flex items-center justify-center opacity-90 cursor-none z-20"
               onMouseEnter={() => setIsHoveringCard(true)}
               onMouseLeave={() => { setIsHoveringCard(false); setHoveredUrl("Visit Site"); }}
               onMouseMove={(e) => {
                 // Update the spring coordinates dynamically whenever the mouse moves inside this container
                 cursorX.set(e.clientX - 48);
                 cursorY.set(e.clientY - 48);
               }}
             >
               <CardSwap pauseOnHover={false}>
                 {projects.slice(0, 3).map((project: any, index: number) => {
                   const siteHostname = project.liveUrl ? getHostname(project.liveUrl) : (project.githubUrl ? getHostname(project.githubUrl) : "Visit Site");
                   
                   return (
                     <Card key={project.id || index} className="overflow-hidden shadow-lg w-[260px] h-[190px] md:w-[320px] md:h-[240px] lg:w-[360px] lg:h-[260px]">
                       <a 
                         href={project.liveUrl || project.githubUrl || "#"} target="_blank" rel="noopener noreferrer" 
                         className="flex flex-col w-full h-full cursor-none pointer-events-auto"
                         onMouseEnter={() => setHoveredUrl(siteHostname)}
                         onMouseLeave={() => setHoveredUrl("Visit Site")}
                       >
                         <div className="w-full h-[36px] md:h-[40px] flex items-center px-4 bg-zinc-100/80 backdrop-blur-sm border-b border-zinc-200 shrink-0">
                             <div className="flex gap-1.5 shrink-0">
                                 <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                             </div>
                             <div className="mx-auto bg-white px-4 py-1 text-[10px] md:text-xs rounded-md text-zinc-500 border border-zinc-200 shadow-sm flex items-center gap-1 font-mono tracking-tighter truncate max-w-[150px]">
                                 {siteHostname}
                             </div>
                             <div className="w-7 shrink-0"></div>
                         </div>
                         <div className="flex-1 w-full relative bg-zinc-200">
                             <Image src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"} alt={project.title || "Web Project"} fill sizes="(max-width: 768px) 100vw, 33vw" className="absolute inset-0 w-full h-full object-cover object-top" />
                         </div>
                       </a>
                     </Card>
                   );
                 })}
               </CardSwap>
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
          <div className="flex flex-col gap-3 max-w-[800px] mb-4">
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900">
              {creativeTitleParts.before}
              {creativeTitleParts.accent}
              {creativeTitleParts.after}
            </h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-3xl">
              {creativeCopy}
            </p>
          </div>

          {/* Mobile View: Creative Stack */}
          <div className="md:hidden w-full flex flex-col gap-12 mt-4 mb-8">
            <div className="flex flex-col items-center">
              <CreativeMobileStack 
                items={displayCategories}
                currentIndex={activeCreativeIndex}
                onIndexChange={setActiveCreativeIndex}
              />
            </div>
            
            <div className="text-center flex flex-col items-center px-4 -mt-4">
                <h3 className="text-3xl font-bold text-zinc-900 mb-4 leading-tight">
                  {activeCategory?.title}
                </h3>
                <p className="text-zinc-600 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
                  {activeCategory?.description}
                </p>
                
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center no-underline shadow-xl"
                  style={{
                    gap: '12px',
                    background: 'linear-gradient(208.44deg, #5b74ff 5%, #001bb0 84%)', 
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 8px 8px 24px',
                    fontFamily: 'var(--font-sans)', fontWeight: 500,
                    fontSize: '14px', color: '#fff', textDecoration: 'none',
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

          {/* Desktop View: Arched Gallery */}
          <div className="hidden md:flex w-full relative overflow-visible flex-col items-center justify-end pb-12 md:pb-24 pt-[350px] md:pt-[450px] min-h-[550px] md:min-h-[650px]">
             
             {/* Arched Gallery Background */}
             <ArchGallery 
                categories={displayCategories} 
                selectedIndex={activeCreativeIndex} 
                onSelect={(idx: number) => setActiveCreativeIndex(idx)} 
             />

             {/* Center Call to Action Text with Navigation */}
             <div className="z-20 text-center flex flex-col items-center max-w-2xl px-6 relative pointer-events-auto">
                 {/* Navigation Buttons above the heading */}
                 <div className="flex items-center gap-4 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveCreativeIndex((prev) => (prev - 1 + displayCategories.length) % displayCategories.length)}
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
                      onClick={() => setActiveCreativeIndex((prev) => (prev + 1) % displayCategories.length)}
                      className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-sm hover:shadow-md transition-all"
                      aria-label="Next"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </motion.button>
                 </div>

                 
                 <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                   {activeCategory?.title}
                 </h3>

                 <p className="text-zinc-600 text-sm md:text-base mb-10 max-w-md mx-auto leading-relaxed">
                   {activeCategory?.description}
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
