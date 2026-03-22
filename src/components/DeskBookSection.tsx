"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function DeskBookSection() {
  // 0: Closed, 1: Opened Page 1, 2: Flipped to Page 2
  const [page, setPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [scrolled1, setScrolled1] = useState(false);
  const [scrolled2, setScrolled2] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const closeBook = (e: React.MouseEvent) => { e.stopPropagation(); setPage(0); };
  const openCover = (e: React.MouseEvent) => { e.stopPropagation(); setPage(1); };
  const turnToPage2 = (e: React.MouseEvent) => { e.stopPropagation(); setPage(2); };
  const turnToPage1 = (e: React.MouseEvent) => { e.stopPropagation(); setPage(1); };

  if (!mounted) return null;

  return (
    <section className="relative w-full min-h-[120dvh] overflow-hidden flex flex-col items-center justify-center py-20 px-2 md:px-8 lg:py-32">
      
      {/* Background Dots with Top Fade to blend seamlessly with hero */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.08) 2px, transparent 2px)', 
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)'
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bookmarkPulse {
          0%, 100% { transform: translateY(-50%) translateX(0) translateZ(-1px); }
          50% { transform: translateY(-50%) translateX(8px) translateZ(-1px); }
        }
        @keyframes pageTentLiftRight {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(-3deg); }
        }
        @keyframes pageTentLiftLeft {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(3deg); }
        }
      `}} />
      {/* Desk Lighting/Vignette */}
      <div className="absolute inset-0 pointer-events-none  z-0"></div>

      {/* BACKGROUND PROPS (Hidden on smaller screens) */}
      
      {/* Right Glasses */}
      <div className="absolute top-[8%] right-[8%] transform rotate-12 hidden lg:block z-0 opacity-80" style={{ filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.2))' }}>
         <svg width="180" height="80" viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="30" r="23" stroke="#222" strokeWidth="4" />
            <circle cx="115" cy="30" r="23" stroke="#222" strokeWidth="4" />
            <path d="M58 30 Q75 22 92 30" stroke="#222" strokeWidth="4" fill="none" />
            <path d="M12 25 L0 5" stroke="#222" strokeWidth="4" strokeLinecap="round" />
            <path d="M138 25 L150 5" stroke="#222" strokeWidth="4" strokeLinecap="round" />
         </svg>
      </div>

      {/* Left Keyboard Edge */}
      <div className="absolute top-[30%] -left-16 lg:left-[-40px] w-[140px] h-[400px] bg-[#e8e8e8] rounded-3xl border-t-2 border-white shadow-[15px_15px_30px_rgba(0,0,0,0.15)] flex-col gap-3 p-4 transform rotate-[-1deg] hidden xl:flex z-0">
        <div className="h-12 w-full bg-[#f8f8f8] rounded shadow-sm border-b-2 border-gray-300"></div>
        <div className="h-12 w-full bg-[#f8f8f8] rounded shadow-sm border-b-2 border-gray-300"></div>
        <div className="h-12 w-full bg-[#f8f8f8] rounded shadow-sm border-b-2 border-gray-300 flex items-center justify-center text-gray-400 text-xs">←</div>
        <div className="h-20 w-full bg-[#f8f8f8] rounded shadow-sm border-b-2 border-gray-300 flex items-center justify-center text-gray-400 text-xs">↑</div>
      </div>

      <p className={`z-10 text-gray-500 font-mono tracking-widest text-[10px] mt-12 md:mt-0 md:text-sm uppercase mb-8 md:mb-12 transition-opacity duration-1000 ${page > 0 ? "opacity-100" : "opacity-80"}`}>
         {page > 0 ? "← Explore the Tome →" : "Open the Tome"}
      </p>

      {/* Book Container - Huge height */}
      <div 
        className="relative perspective-[4000px] transition-transform duration-[1200ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] w-[85vw] sm:w-[400px] md:w-[500px] lg:w-[650px] h-[600px] sm:h-[650px] md:h-[800px]"
        style={{ transform: page === 0 ? "translateX(0%)" : "translateX(50%)" }}
      >
        
        {/* Book Base (Back Cover) - Visible behind all pages */}
        <div 
          className="absolute inset-0 md:-inset-2 bg-[#dcb994] rounded-md shadow-2xl z-0 border border-[#9c7145]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\")" }}
        >
            {/* Dark Spine center gap */}
            <div className="absolute left-0 md:-left-4 lg:-left-6 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-black/40 via-[#8b5a2b] to-black/20 border-r border-[#8b5a2b]/50 z-0"></div>
            {/* Faux paper edges (thickness) */}
            <div className="absolute top-1 bottom-1 right-0 left-4 md:left-12 bg-[#dfc9b1] rounded-r shadow-[4px_0px_0_#b89467,6px_0px_0_#9a7a52] z-0"></div>
        </div>

        {/* The entire interior block, shifted slightly right to account for spine */}
        <div className="absolute inset-y-0 right-0 left-[2%] md:left-[5%] perspective-[4000px]" style={{ transformStyle: "preserve-3d" }}>

          {/* 1. SPREAD 2 (Right Page - Experience / Studies) - Static bottom layer */}
          <div className="absolute inset-0 origin-left flex justify-end" style={{ transform: "translateZ(0px)" }}>
             {/* Left side is hidden practically by spine, but this is the right face */}
             <div className="w-full h-full bg-[#f4e8d1] flex flex-col relative z-0 overflow-hidden rounded-r-xl border-y border-r border-[#d4bc96]" style={{ backgroundImage: "radial-gradient(#dcb180 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
                <div className="absolute top-0 left-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-transparent to-black/30 z-0 pointer-events-none"></div>
                
                  <div className="relative z-10 p-6 md:p-12 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden flex flex-col" onScroll={(e) => setScrolled2(e.currentTarget.scrollTop > 10)}>
                    <h2 className="text-2xl md:text-5xl text-[#382818] font-bold mb-6 md:mb-10 font-serif tracking-tight border-b-2 border-[#b89467] pb-4 uppercase">Chronicles of Work</h2>
                    
                    <div className="space-y-6 md:space-y-10 pl-2">
                        <div className="relative pl-6 md:pl-8 border-l-2 border-[#8b5a2b]/60">
                            <div className="absolute top-1.5 -left-[5px] w-2.5 h-2.5 rounded-full bg-[#8b5a2b] shadow-[0_0_5px_#8b5a2b]"></div>
                            <h3 className="text-lg md:text-2xl font-bold text-[#4a3320] font-serif">Master of Spells (Frontend Dev)</h3>
                            <p className="text-[#965839] text-[10px] md:text-sm font-mono font-semibold tracking-widest my-1 uppercase">Order of Tech • 2023 - Present</p>
                            <p className="text-[#5c4636] text-xs md:text-base mt-2 leading-relaxed">Conjuring intricate web architectures, mastering React incantations, and weaving animations that captivate mortals.</p>
                        </div>
                        
                        <div className="relative pl-6 md:pl-8 border-l-2 border-[#8b5a2b]/60 pb-2">
                            <div className="absolute top-1.5 -left-[5px] w-2.5 h-2.5 rounded-full bg-[#8b5a2b] shadow-[0_0_5px_#8b5a2b]"></div>
                            <h3 className="text-lg md:text-2xl font-bold text-[#4a3320] font-serif">Alchemist of Design</h3>
                            <p className="text-[#965839] text-[10px] md:text-sm font-mono font-semibold tracking-widest my-1 uppercase">Creative Guild • 2021 - 2023</p>
                            <p className="text-[#5c4636] text-xs md:text-base mt-2 leading-relaxed">Transmuting wild wireframes into golden interactive prototypes. Charting User Experience journeys across dimensions.</p>
                        </div>
                    </div>

                    <div className="mt-auto pt-10 flex justify-end items-center opacity-70">
                         <span className="font-serif text-[#8b5a2b] font-bold">Pg. 02</span>
                    </div>
                  </div>

                  {/* Scroll Hint overlay for SPREAD 2 */}
                  <div className={`absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#8b5a2b] transition-opacity duration-700 pointer-events-none z-20 ${!scrolled2 && page === 2 ? 'opacity-80 animate-bounce' : 'opacity-0'}`}>
                      <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold mb-1 font-serif">Scroll</span>
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                  </div>
             </div>
          </div>

          {/* 2. PAGE 1 FLIPPER */}
          <div 
              className="absolute inset-0 origin-left transition-transform duration-[1200ms] ease-[cubic-bezier(0.645,0.045,0.355,1)]"
              style={{ transformStyle: "preserve-3d", transform: page >= 2 ? "rotateY(-180deg) translateZ(-10px)" : "rotateY(0deg) translateZ(10px)" }}
          >
             <div className="w-full h-full origin-left" style={{ transformStyle: "preserve-3d", animation: page === 1 ? 'pageTentLiftRight 3s infinite ease-in-out' : (page === 2 ? 'pageTentLiftLeft 3s infinite ease-in-out' : 'none') }}>
              {/* FRONT FACE: Page 1 (Prologue & Image) */}
              <div 
                className="absolute inset-0 bg-[#f4e8d1] border-y border-r border-[#d4bc96] flex flex-col justify-start items-center rounded-r cursor-pointer z-10 overflow-hidden" 
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(0deg)", backgroundImage: "radial-gradient(#dcb180 1px, transparent 1px)", backgroundSize: "40px 40px" }} 
                onClick={turnToPage2}
              >
                 <div className="absolute top-0 left-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-black/20 to-transparent z-0 pointer-events-none"></div>
                 
<div className="relative z-10 w-full h-full p-8 md:p-12 lg:p-16 overflow-y-auto [&::-webkit-scrollbar]:hidden text-[#382818] flex flex-col" onScroll={(e) => setScrolled1(e.currentTarget.scrollTop > 10)}>
                    
                    {/* Attached Photo with Paperclip ON THE TOP */}
                    <div className="relative self-center md:self-end md:-mr-4 mb-8 transform rotate-3 mt-2 md:mt-0 z-20">
                        {/* Photo Border / Polaroid effect */}
                        <div className="relative w-40 h-52 md:w-56 md:h-64 bg-[#fffcf5] p-2 md:p-3 shadow-[2px_6px_15px_rgba(0,0,0,0.15)] border border-[#e0cfa9]">
                            {/* Paperclip */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-12 bg-transparent border-[3px] border-[#9ca3af] rounded-full shadow-[1px_2px_3px_rgba(0,0,0,0.2)] z-30" style={{ backgroundImage: "linear-gradient(to right, #ccc, #eee, #ccc)" }}></div>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-8 bg-transparent border-t-[3px] border-l-[3px] border-r-[3px] border-[#888] rounded-t-full z-10"></div>
                            
                            {/* Profile Image */}
                            <div className="relative w-full h-full overflow-hidden grayscale-[20%] sepia-[30%] contrast-[1.1]">
                                <Image src="/about/abin-varghese.png" alt="Abin Varghese" fill className="object-cover object-top" unoptimized />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif text-center md:text-left text-[#4a331e]">Prologue</h2>

                    <div className="text-[15px] md:text-[1.2rem] lg:text-[1.3rem] leading-[2.2] space-y-6 flex-grow font-serif relative z-10">
                        <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-[#8b5a2b] first-letter:mr-2 first-letter:float-left first-letter:-mt-1 shadow-sm">
                            Greetings. I am Abin, a creative developer blending logic with imagination. 
                        </p>
                        <p>
                            In a realm cluttered with generic utility blocks, I strive to craft digital artifacts that feel like magic. 
                            The web should not be a chore to navigate, but an experience to behold.
                        </p>
                        <p>
                            Join me as we turn the pages of modern web craftsmanship, weaving elegant interfaces, seamless interactions, and unforgettable journeys.
                        </p>
                    </div>

                    <div className="flex items-center justify-end mt-12 font-serif text-[#b88645] opacity-70">
                          <span>Pg. 01</span>
                    </div>
                  </div>
                   
                   {/* Scroll Hint overlay for Page 1 */}
                   <div className={`absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#8b5a2b] transition-opacity duration-700 pointer-events-none z-20 ${!scrolled1 && page === 1 ? 'opacity-80 animate-bounce' : 'opacity-0'}`}>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold mb-1 font-serif">Scroll</span>
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                   </div>
              </div>
              {/* BACK FACE: Blank Parchment (Left side when open Page 2) */}
              <div 
                className="absolute inset-0 bg-[#f4e8d1] border-y border-l border-[#d4bc96] rounded-l cursor-pointer z-0 overflow-hidden shadow-[-4px_0_15px_rgba(0,0,0,0.1)_inset]" 
                style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }} 
                onClick={turnToPage1}
              >
                 <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-black/20 to-transparent z-0 pointer-events-none border-r border-[#d4bc96]"></div>
                 {/* No text context - just vintage texture! */}
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(45deg, #dcb180 0px, #dcb180 2px, transparent 2px, transparent 10px)` }}></div>
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 text-[#8b5a2b] text-4xl mb-6 font-serif text-center">
                    ( Intentionally Blank )
                 </div>
              </div>
             </div>
          </div>

          {/* 3. COVER FLIPPER */}
          <div 
              className="absolute inset-y-[-10px] right-[-10px] left-[-20px] transition-transform duration-[1400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)]"
              style={{ transformOrigin: "20px center", transformStyle: "preserve-3d", transform: page >= 1 ? "rotateY(-180deg) translateZ(-5px)" : "rotateY(0deg) translateZ(20px)" }}
          >
              {/* Bookmark Ribbon - Temptation to open */}
                    <div className={`absolute top-1/2 -translate-y-1/2 -right-10 md:-right-14 w-16 md:w-20 h-10 md:h-12 bg-[#b24c4c] shadow-[10px_2px_15px_rgba(0,0,0,0.4)] transition-opacity duration-1000 origin-left flex flex-row items-center justify-start pl-4 md:pl-5 z-[5] cursor-pointer hover:bg-[#c95b5b]
                        ${page === 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                        style={{ clipPath: "polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)", animation: page === 0 ? 'bookmarkPulse 2s infinite ease-in-out' : 'none', transform: 'translateY(-50%) translateZ(-1px)' }}
                        onClick={openCover}
                    >
                        <div className="absolute left-2 w-2 h-2 rounded-full bg-[#f4e8d1] opacity-50 shadow-[0_0_5px_rgba(255,255,255,0.8)_inset]"></div>
                        <span className="text-[#f4e8d1] text-[10px] md:text-xs font-serif tracking-[0.2em] opacity-90 drop-shadow-md font-bold">OPEN</span>
                    </div>

                  {/* FRONT COVER (Grainy Paper/Leather) */}
              <div 
                className="absolute inset-0 bg-[#dcb994] rounded-r-xl border-y-[3px] border-r-[3px] border-[#a87b51] shadow-[15px_15px_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center cursor-pointer hover:shadow-[20px_20px_50px_rgba(0,0,0,0.4)] transition-shadow duration-500 z-10 overflow-hidden" 
                style={{ 
                  backfaceVisibility: "hidden", 
                  WebkitBackfaceVisibility: "hidden", 
                  transform: "rotateY(0deg)",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\")"
                }} 
                onClick={openCover}
              >
                    {/* Crease near spine */}
                  <div className="absolute left-1 md:left-4 top-0 bottom-0 w-4 md:w-8 border-r border-[#a87b51]/60 bg-gradient-to-r from-black/20 to-transparent shadow-[2px_0_5px_rgba(0,0,0,0.1)]"></div>
                  
                  {/* Outer Border */}
                  <div className="absolute inset-4 md:inset-8 border-2 border-[#8b5a2b] opacity-60 rounded flex items-center justify-center pointer-events-none">
                     <div className="absolute inset-2 border border-[#8b5a2b] opacity-40"></div>
                  </div>

                  {/* Center Emblem & Title */}
                  <div className="relative z-20 flex flex-col items-center max-w-[85%] text-center mt-8">
                      <div className="w-16 h-16 md:w-20 md:h-20 mb-8 rounded-full border-2 border-[#8b5a2b] flex items-center justify-center bg-[#cda47b] shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]">
                          <svg className="w-8 h-8 md:w-10 md:h-10 text-[#5c3a21] opacity-80" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l4.5 9h-9L12 2zm0 2.5L9.5 9h5L12 4.5zm0 15.5l-4.5-9h9L12 20zM11 17.5l2.5-4.5h-5L12 17.5z"/>
                          </svg>
                      </div>
                      
                      <h1 className="text-[#382010] text-3xl md:text-5xl lg:text-5xl font-serif tracking-wide uppercase mb-6 leading-tight drop-shadow-sm">
                         The Magical<br/>Chronicles
                      </h1>
                      
                      <div className="w-24 h-[1px] bg-[#8b5a2b] my-4 opacity-50"></div>
                      
                      <h2 className="text-[#5c3a21] text-xs md:text-sm lg:text-base font-serif tracking-[0.2em] uppercase pt-4 font-bold opacity-80">
                         Abin Varghese
                      </h2>
                  </div>
              </div>

              {/* COVER BACK (Inside Cover - Blank Textured - Left side when Opened Page 1) */}
              <div 
                className="absolute inset-0 bg-[#d4b492] rounded-l-xl border-y-[3px] border-l-[3px] border-[#a87b51] flex flex-col z-0 shadow-[-15px_15px_40px_rgba(0,0,0,0.3)] cursor-pointer" 
                style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                onClick={closeBook} 
              >
                  {/* Inside cover paper lining layout */}
                  <div className="absolute inset-3 md:inset-6 bg-[#f4e8d1] border border-[#cda47b] shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] opacity-90 overflow-hidden" style={{ backgroundImage: "repeating-linear-gradient(45deg, #f4e8d1, #f4e8d1 10px, #efe0c4 10px, #efe0c4 20px)" }}>
                     <div className="w-full h-full flex items-center justify-center pointer-events-none">
                         <div className="border border-[#cda47b] px-8 py-4 bg-[#fdfaf5] shadow-sm">
                            <span className="text-[#8b5a2b] font-serif text-2xl font-bold opacity-50 uppercase tracking-[0.4em]">Ex Libris</span>
                         </div>
                     </div>
                  </div>
              </div>
          </div>

        </div>

      </div>

    </section>
  );
}
