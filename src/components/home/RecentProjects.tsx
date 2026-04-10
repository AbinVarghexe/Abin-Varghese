"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useSpring } from "framer-motion";
import CardSwap, { Card } from "@/components/effects/CardSwap";
import { ArchGallery } from "@/components/ui/ArchGallery";

const CREATIVE_CATEGORIES = [
  {
    title: "Motion Graphics",
    description: "Bringing static designs to life with fluid animations and cinematic storytelling that captivates audiences.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600"
  },
  {
    title: "UI/UX Design",
    description: "Crafting intuitive, user-centered interfaces that blend aesthetic beauty with seamless functional experiences.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600"
  },
  {
    title: "Video Production",
    description: "High-quality video editing and direction, focusing on rhythm, color grading, and impactful visual narratives.",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600"
  },
  {
    title: "VFX Animation",
    description: "Creating mind-bending visual effects and high-fidelity animations for a truly immersive digital experience.",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600"
  },
  {
    title: "3D Modeling",
    description: "Developing detailed 3D assets and environments with realistic textures, lighting, and spatial depth.",
    image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=600"
  },
  {
    title: "Visual Branding",
    description: "Designing cohesive brand identities that tell a unique story through color, typography, and iconography.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600"
  },
  {
    title: "Character Design",
    description: "Giving personality to digital entities through expressive character concepts and detailed illustrations.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600"
  }
];

export default function RecentProjects({
  heading,
  intro,
  webTitle,
  webCopy,
  webCtaLabel,
  creativeTitle,
  creativeCopy,
  creativeCtaLabel,
  creativeCategories
}: any) {
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [hoveredUrl, setHoveredUrl] = useState("Visit Site");
  const [activeCreativeIndex, setActiveCreativeIndex] = useState(3);

  // Use spring for smooth cursor following
  const cursorX = useSpring(-100, { stiffness: 400, damping: 28 });
  const cursorY = useSpring(-100, { stiffness: 400, damping: 28 });

  const activeCategory = CREATIVE_CATEGORIES[activeCreativeIndex];

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
        <div className="flex flex-col items-center text-center w-full mb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-black">
            My Recent <span className="text-blue-600 font-serif italic font-medium">Project&apos;s</span>
          </h2>
          <p className="text-black/70 text-base md:text-lg leading-relaxed max-w-3xl">
            Exploring the intersection of high-performance engineering and creative visual storytelling across multiple digital disciplines.
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
              Web Development
            </h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-3xl">
              Building highly-performant, responsive web applications using modern technologies like React, Next.js, and Tailwind CSS. I specialize in turning complex requirements into seamless digital experiences.
            </p>
          </div>

          {/* Large Image Placeholder */}
          <div 
            className="w-full aspect-video md:aspect-21/9 bg-white rounded-[24px] overflow-hidden flex items-center justify-center relative shadow-sm hover:shadow-md transition-shadow z-10 border-[5px] border-zinc-200"
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
                  <span style={{ minWidth: '80px', textAlign: 'center' }}>View Projects</span>
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
                 <Card className="overflow-hidden shadow-lg w-[260px] h-[190px] md:w-[320px] md:h-[240px] lg:w-[360px] lg:h-[260px]">
                   <a 
                     href="https://awwwards.com" target="_blank" rel="noopener noreferrer" 
                     className="flex flex-col w-full h-full cursor-none pointer-events-auto"
                     onMouseEnter={() => setHoveredUrl("awwwards.com")}
                     onMouseLeave={() => setHoveredUrl("Visit Site")}
                   >
                     <div className="w-full h-[36px] md:h-[40px] flex items-center px-4 bg-zinc-100/80 backdrop-blur-sm border-b border-zinc-200 shrink-0">
                         <div className="flex gap-1.5 shrink-0">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                         </div>
                         <div className="mx-auto bg-white px-4 py-1 text-[10px] md:text-xs rounded-md text-zinc-500 border border-zinc-200 shadow-sm flex items-center gap-1 font-mono tracking-tighter truncate max-w-[150px]">
                             awwwards.com
                         </div>
                         <div className="w-7 shrink-0"></div>
                     </div>
                     <div className="flex-1 w-full relative bg-zinc-200">
                         <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" alt="Web Dev 1" className="absolute inset-0 w-full h-full object-cover object-top" />
                     </div>
                   </a>
                 </Card>
                 <Card className="overflow-hidden shadow-lg w-[260px] h-[190px] md:w-[320px] md:h-[240px] lg:w-[360px] lg:h-[260px]">
                   <a 
                     href="https://dribbble.com" target="_blank" rel="noopener noreferrer" 
                     className="flex flex-col w-full h-full cursor-none pointer-events-auto"
                     onMouseEnter={() => setHoveredUrl("dribbble.com")}
                     onMouseLeave={() => setHoveredUrl("Visit Site")}
                   >
                     <div className="w-full h-[36px] md:h-[40px] flex items-center px-4 bg-zinc-100/80 backdrop-blur-sm border-b border-zinc-200 shrink-0">
                         <div className="flex gap-1.5 shrink-0">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                         </div>
                         <div className="mx-auto bg-white px-4 py-1 text-[10px] md:text-xs rounded-md text-zinc-500 border border-zinc-200 shadow-sm flex items-center gap-1 font-mono tracking-tighter truncate max-w-[150px]">
                             dribbble.com
                         </div>
                         <div className="w-7 shrink-0"></div>
                     </div>
                     <div className="flex-1 w-full relative bg-zinc-200">
                         <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" alt="Web Dev 2" className="absolute inset-0 w-full h-full object-cover object-top" />
                     </div>
                   </a>
                 </Card>
                 <Card className="overflow-hidden shadow-lg w-[260px] h-[190px] md:w-[320px] md:h-[240px] lg:w-[360px] lg:h-[260px]">
                   <a 
                     href="https://behance.net" target="_blank" rel="noopener noreferrer" 
                     className="flex flex-col w-full h-full cursor-none pointer-events-auto"
                     onMouseEnter={() => setHoveredUrl("behance.net")}
                     onMouseLeave={() => setHoveredUrl("Visit Site")}
                   >
                     <div className="w-full h-[36px] md:h-[40px] flex items-center px-4 bg-zinc-100/80 backdrop-blur-sm border-b border-zinc-200 shrink-0">
                         <div className="flex gap-1.5 shrink-0">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                         </div>
                         <div className="mx-auto bg-white px-4 py-1 text-[10px] md:text-xs rounded-md text-zinc-500 border border-zinc-200 shadow-sm flex items-center gap-1 font-mono tracking-tighter truncate max-w-[150px]">
                             behance.net
                         </div>
                         <div className="w-7 shrink-0"></div>
                     </div>
                     <div className="flex-1 w-full relative bg-zinc-200">
                         <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format&fit=crop" alt="Web Dev 3" className="absolute inset-0 w-full h-full object-cover object-top" />
                     </div>
                   </a>
                 </Card>
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
              Creative Stuff
            </h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-3xl">
              Beyond engineering, I dive deep into visual aesthetics and digital artistry. From cinematic motion graphics to immersive 3D environments, these pieces represent my passion for pushing the boundaries of creative storytelling.
            </p>
          </div>

          <div className="w-full relative overflow-visible flex flex-col items-center justify-end pb-12 md:pb-24 pt-[350px] md:pt-[450px] min-h-[550px] md:min-h-[650px]">
             
             {/* Arched Gallery Background */}
             <ArchGallery 
                categories={CREATIVE_CATEGORIES} 
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
                      onClick={() => setActiveCreativeIndex((prev) => (prev - 1 + CREATIVE_CATEGORIES.length) % CREATIVE_CATEGORIES.length)}
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
                      onClick={() => setActiveCreativeIndex((prev) => (prev + 1) % CREATIVE_CATEGORIES.length)}
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
                   <span style={{ minWidth: '80px', textAlign: 'center' }}>Contact me</span>
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
