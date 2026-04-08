"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import KeyboardDemo from "@/components/about/keyboard-demo";
import type { SiteCopyContent } from "@/lib/site-copy-content";

type DeskBookSectionProps = {
  copy: Pick<
    SiteCopyContent,
    "aboutIntroTitle" | "aboutIntroBody" | "aboutBookImage" | "aboutTimelineTitle" | "aboutTimelineEntries"
  >;
};

export default function DeskBookSection({ copy }: DeskBookSectionProps) {
  // 0: Closed, 1: Opened Page 1, 2: Flipped to Page 2
  const [page, setPage] = useState(0);
  const [scrolled1, setScrolled1] = useState(false);
  const [scrolled2, setScrolled2] = useState(false);
  const [keyboardEngaged, setKeyboardEngaged] = useState(false);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBookSound = useCallback((type: "open" | "turn" | "close") => {
    if (typeof window === "undefined") return;

    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = audioContextRef.current ?? new AudioCtx();
    audioContextRef.current = ctx;

    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.28, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(type === "turn" ? 900 : 700, ctx.currentTime);
    filter.Q.setValueAtTime(0.6, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(type === "turn" ? 0.05 : 0.04, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (type === "turn" ? 0.22 : 0.26));

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.3);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!keyboardRef.current || (target && keyboardRef.current.contains(target))) {
        return;
      }

      setKeyboardEngaged(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const closeBook = (e: React.MouseEvent) => { e.stopPropagation(); playBookSound("close"); setPage(0); };
  const openCover = (e: React.MouseEvent) => { e.stopPropagation(); playBookSound("open"); setPage(1); };
  const turnToPage2 = (e: React.MouseEvent) => { e.stopPropagation(); playBookSound("turn"); setPage(2); };
  const turnToPage1 = (e: React.MouseEvent) => { e.stopPropagation(); playBookSound("turn"); setPage(1); };
  const introParagraphs = copy.aboutIntroBody
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

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
        @keyframes paperclipGlint {
          0%, 100% { transform: translateX(-50%) rotate(7deg); }
          50% { transform: translateX(-50%) rotate(11deg) translateY(-1px); }
        }
      `}} />
      {/* Desk Lighting/Vignette */}
      <div className="absolute inset-0 pointer-events-none  z-0"></div>

      {/* BACKGROUND PROPS (Hidden on smaller screens) */}
      
      {/* Right Glasses */}
      <div className="group absolute top-[8%] right-[8%] hidden lg:block z-0 opacity-90 transition-transform duration-500 hover:-translate-y-1 hover:rotate-[10deg]" style={{ transform: "rotate(12deg)", filter: 'drop-shadow(10px 16px 16px rgba(0,0,0,0.18))' }}>
         <svg width="190" height="92" viewBox="0 0 190 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="frameMetal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#655d58" />
                <stop offset="28%" stopColor="#1f1b18" />
                <stop offset="52%" stopColor="#8b8178" />
                <stop offset="100%" stopColor="#241f1c" />
              </linearGradient>
              <linearGradient id="lensTint" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(210,220,226,0.42)" />
                <stop offset="100%" stopColor="rgba(120,132,140,0.15)" />
              </linearGradient>
            </defs>
            <ellipse cx="52" cy="44" rx="31" ry="27" fill="url(#lensTint)" stroke="url(#frameMetal)" strokeWidth="5"/>
            <ellipse cx="138" cy="44" rx="31" ry="27" fill="url(#lensTint)" stroke="url(#frameMetal)" strokeWidth="5"/>
            <path d="M82 43C89 38 101 38 108 43" stroke="url(#frameMetal)" strokeWidth="4.5" strokeLinecap="round"/>
            <path d="M22 39L6 14" stroke="url(#frameMetal)" strokeWidth="5" strokeLinecap="round"/>
            <path d="M168 39L184 14" stroke="url(#frameMetal)" strokeWidth="5" strokeLinecap="round"/>
            <path d="M36 31C41 24 47 22 57 23" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" className="transition-opacity duration-300 group-hover:opacity-90" />
            <path d="M122 31C127 24 133 22 143 23" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" className="transition-opacity duration-300 group-hover:opacity-90" />
         </svg>
      </div>

      {/* Left Keyboard Edge */}
      <div
        ref={keyboardRef}
        className={`group absolute top-[31%] w-[820px] h-[380px] hidden xl:flex pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          keyboardEngaged
            ? "left-1/2 z-30 -translate-x-1/2 translate-y-[34px] rotate-0"
            : "left-[-190px] z-0 -translate-x-9 -rotate-[8deg]"
        }`}
      >
        <div className="relative w-full h-full">
          <div
            className={`absolute bottom-3 h-12 rounded-full bg-black/15 blur-md transition-all duration-700 ${
              keyboardEngaged ? "left-14 right-14 opacity-90" : "inset-x-24 opacity-100"
            }`}
          />
          <div
            className={`absolute inset-0 origin-center drop-shadow-[18px_22px_28px_rgba(0,0,0,0.16)] transition-transform duration-700 ${
              keyboardEngaged ? "scale-[1.24]" : "scale-[0.98]"
            }`}
          >
            <KeyboardDemo
              className="h-full min-h-0 py-0 md:min-h-0"
              onKeyInteraction={() => setKeyboardEngaged(true)}
            />
          </div>
        </div>
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
                    <h2 className="text-2xl md:text-5xl text-[#382818] font-bold mb-6 md:mb-10 font-serif tracking-tight border-b-2 border-[#b89467] pb-4 uppercase">{copy.aboutTimelineTitle}</h2>
                    
                    <div className="space-y-6 md:space-y-10 pl-2">
                        {copy.aboutTimelineEntries.map((entry, index) => (
                          <div
                            key={`${entry.role}-${entry.organization}-${index}`}
                            className={`relative pl-6 md:pl-8 border-l-2 border-[#8b5a2b]/60 ${index === copy.aboutTimelineEntries.length - 1 ? "pb-2" : ""}`}
                          >
                            <div className="absolute top-1.5 -left-[5px] w-2.5 h-2.5 rounded-full bg-[#8b5a2b] shadow-[0_0_5px_#8b5a2b]"></div>
                            <h3 className="text-lg md:text-2xl font-bold text-[#4a3320] font-serif">{entry.role}</h3>
                            <p className="text-[#965839] text-[10px] md:text-sm font-mono font-semibold tracking-widest my-1 uppercase">
                              {entry.organization} • {entry.duration}
                            </p>
                            <p className="text-[#5c4636] text-xs md:text-base mt-2 leading-relaxed">{entry.copy}</p>
                          </div>
                        ))}
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
                        <div className="group relative w-40 h-52 md:w-56 md:h-64 bg-[#fffcf5] p-2 md:p-3 shadow-[2px_6px_15px_rgba(0,0,0,0.15)] border border-[#e0cfa9] transition-transform duration-500 hover:-translate-y-1">
                            {/* Paperclip */}
                            <div
                              className="absolute -top-6 left-1/2 w-6 h-12 bg-transparent border-[3px] border-[#9ca3af] rounded-full shadow-[1px_2px_3px_rgba(0,0,0,0.2)] z-30 transition-transform duration-300 group-hover:scale-[1.04]"
                              style={{
                                transform: "translateX(-50%) rotate(7deg)",
                                transformOrigin: "top center",
                                backgroundImage: "linear-gradient(to right, #c9c9c9, #f3f3f3 45%, #a6a6a6)",
                                animation: "paperclipGlint 3.2s ease-in-out infinite",
                              }}
                            ></div>
                            <div
                              className="absolute -top-3 left-1/2 w-3 h-8 bg-transparent border-t-[3px] border-l-[3px] border-r-[3px] border-[#7e7e7e] rounded-t-full z-10"
                              style={{ transform: "translateX(-50%) rotate(7deg)" }}
                            ></div>
                            
                            {/* Profile Image */}
                            <div className="relative w-full h-full overflow-hidden grayscale-[20%] sepia-[30%] contrast-[1.1]">
                                <Image src={copy.aboutBookImage} alt="Abin Varghese" fill className="object-cover object-top" unoptimized />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif text-center md:text-left text-[#4a331e]">{copy.aboutIntroTitle}</h2>

                    <div className="text-[15px] md:text-[1.2rem] lg:text-[1.3rem] leading-[2.2] space-y-6 flex-grow font-serif relative z-10">
                        {introParagraphs.map((paragraph, index) => (
                          <p
                            key={`${paragraph.slice(0, 24)}-${index}`}
                            className={index === 0 ? "first-letter:text-6xl first-letter:font-bold first-letter:text-[#8b5a2b] first-letter:mr-2 first-letter:float-left first-letter:-mt-1 shadow-sm" : ""}
                          >
                            {paragraph}
                          </p>
                        ))}
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
