"use client";

import Image from "next/image";
import { useState } from "react";

export default function DeskBookSection() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section className="relative w-full min-h-[100dvh] bg-[#ececec] overflow-hidden flex flex-col items-center justify-center py-20 px-2 md:px-8 lg:py-32" style={{ backgroundImage: 'radial-gradient(#d1d1d1 2px, transparent 2px)', backgroundSize: '24px 24px' }}>
      
      {/* Desk Lighting/Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.08)_100%)] z-0"></div>

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

      <p className="z-10 text-gray-500 mb-6 font-mono text-sm tracking-widest uppercase md:mt-0 mt-8">← Interactive Journal →</p>

      {/* THE BOOK CONTAINER */}
      {/* Using perspective to allow 3D page turns. */}
      <div className="relative w-[96vw] max-w-[1000px] aspect-[1/1.2] md:aspect-[1.8/1] min-h-[500px] z-10 flex my-auto perspective-[3000px]">
        
        {/* Book Base / Cover Background */}
        <div className="absolute -inset-2 md:-inset-4 bg-[#3d2e26] rounded-md shadow-2xl z-0 border border-[#2b1f18]">
            {/* Book Spine Center Gap */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-[#201510] via-transparent to-[#201510] opacity-80 border-l border-r border-[#201510]/50 z-0"></div>
        </div>

        {/* Paper Stack Edges (Gives Book Thickness) */}
        <div className="absolute top-1 bottom-1 left-0 right-1/2 bg-[#efefef] rounded-l shadow-[-2px_0px_0_#dcdcdc,-4px_0px_0_#cbcbcb] z-0"></div>
        <div className="absolute top-1 bottom-1 right-0 left-1/2 bg-[#efefef] rounded-r shadow-[2px_0px_0_#dcdcdc,4px_0px_0_#cbcbcb] z-0"></div>

        {/* Main Spread Container */}
        <div className="relative w-full h-full flex z-10">
            
            {/* ---------- SPREAD 1: STATIC LEFT (About Me) ---------- */}
            <div className="w-1/2 h-full bg-[#fcfcfb] shadow-inner flex flex-col relative z-10 overflow-hidden" style={{ borderRight: "1px solid #ddd" }}>
                {/* Center Spine Shadow */}
                <div className="absolute top-0 right-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-transparent to-black/10 z-0 pointer-events-none"></div>
                
                <div className="relative z-10 p-4 md:p-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden flex flex-col justify-center items-center text-center">
                    <h2 className="text-3xl md:text-5xl text-[#222] font-bold mb-4 md:mb-6" style={{ fontFamily: "var(--font-display), \"Caveat\", cursive" }}>Hello!</h2>
                    
                    {/* Inner image */}
                    <div className="w-[85%] max-w-[250px] aspect-[4/4.5] bg-gray-200 mb-4 md:mb-6 rounded-sm shadow-[2px_2px_15px_rgba(0,0,0,0.1)] relative border border-black/5 p-2 pb-6 md:p-3 md:pb-10 transform -rotate-1 hover:rotate-0 transition-transform">
                       <div className="relative w-full h-full bg-[#ddd] overflow-hidden grayscale-[0.2] contrast-110">
                           <Image src="/about/abin-varghese.png" alt="Abin Varghese" fill className="object-cover object-top" unoptimized/>
                       </div>
                    </div>
                    
                    <p className="text-[#333] text-[10px] md:text-base leading-relaxed max-w-[95%] mx-auto opacity-90">
                        Hi, I&apos;m Abin, a creative developer focused on turning ideas into immersive digital experiences. 
                    </p>
                </div>
            </div>

            {/* ---------- SPREAD 2: STATIC RIGHT (Studies & Skills) ---------- */}
            <div className="w-1/2 h-full bg-[#fdfdfc] shadow-inner flex flex-col relative z-0 overflow-hidden" style={{ borderLeft: "1px solid #ddd" }}>
                <div className="absolute top-0 left-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-transparent to-black/10 z-0 pointer-events-none"></div>
                
                <div className="relative z-10 p-3 md:p-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <h2 className="text-xl md:text-4xl text-[#222] font-bold mb-4 md:mb-8 font-serif tracking-tight pr-2">Studies & Skills</h2>
                    
                    <div className="space-y-4 md:space-y-8 pl-1">
                        <div className="relative pl-3 md:pl-5 border-l-2 border-[#b57350]/60">
                            <div className="absolute top-1 -left-[5px] w-2 h-2 rounded-full bg-[#b57350]"></div>
                            <h3 className="text-sm md:text-lg font-bold text-[#333]">Bachelor of Technology</h3>
                            <p className="text-[#965839] text-[9px] md:text-xs font-mono font-semibold tracking-wider my-0.5 uppercase">Engineering • 2018 - 2022</p>
                            <p className="text-gray-600 text-[10px] md:text-sm mt-1 leading-relaxed pr-2">Computer Science & Engineering. Strong foundation in software architecture & algorithms.</p>
                        </div>
                        
                        <div className="relative pl-3 md:pl-5 border-l-2 border-[#b57350]/60 pb-2">
                            <div className="absolute top-1 -left-[5px] w-2 h-2 rounded-full bg-[#b57350]"></div>
                            <h3 className="text-sm md:text-lg font-bold text-[#333]">Core Utilities</h3>
                            <div className="flex flex-wrap gap-1.5 mt-2 pr-2">
                                {["React", "Next.js", "Tailwind CSS", "Three.js", "Framer Motion", "TypeScript", "Figma"].map(s => (
                                    <span key={s} className="px-1.5 py-0.5 md:px-2 md:py-1 bg-[#f4ece8] text-[#704128] border border-[#d9bfae] text-[8px] md:text-[11px] uppercase tracking-wider rounded font-bold">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setIsFlipped(false)} className="mt-8 md:mt-12 text-[#b57350] hover:text-[#8a5235] text-[10px] md:text-sm font-bold flex items-center gap-1 md:gap-2 transition-colors cursor-pointer group">
                       <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Flip back
                    </button>
                </div>
            </div>

            {/* ---------- THE FLIPPER (Page 2 Front / Page 3 Back) ---------- */}
            <div 
                className="absolute top-0 right-0 w-1/2 h-full z-20 origin-left transition-transform duration-[1200ms] ease-[cubic-bezier(0.645,0.045,0.355,1)]"
                style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}
            >
                
                {/* ---------- FRONT of Flipper: The Target Letter (Spread 1 Right) ---------- */}
                <div className="absolute inset-0 bg-[#fefefc] flex flex-col overflow-hidden shadow-[-1px_0_5px_rgba(0,0,0,0.05)_inset,5px_5px_15px_rgba(0,0,0,0.15)]" style={{ backfaceVisibility: "hidden" }}>
                    
                    <div className="absolute top-0 left-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-transparent to-black/10 z-0 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-[#e1e1e1] shadow-sm"></div>

                    <div className="relative z-10 p-3 md:p-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden flex flex-col justify-between group cursor-pointer" onClick={() => setIsFlipped(true)}>
                        
                        <div className="text-[#333] text-[11px] md:text-[1.1rem] leading-[1.6] md:leading-[1.9] tracking-wide space-y-2 md:space-y-4 opacity-90 pl-1 pr-2 md:pr-4" style={{ fontFamily: "\"Caveat\", cursive" }}>
                            <p>Hey everyone—</p>
                            <p>I&apos;m Abin, a creative developer. Web development often gets a bad reputation, but it doesn&apos;t have to.</p>
                            <p>There&apos;s something special about browsing a site you care about, interacting with a product you love, or an interface you trust.</p>
                            <p>Over time, the web became crowded. We lost the delight of exploring, buried under generic blocks.</p>
                            <p>Now, exploring feels more like a burden than a joy. Instead of delighting in the web, we&apos;re just dealing with it.</p>
                            <p>I strongly believe in bringing back the joy, crafting human-centered digital journeys.</p>
                        </div>

                        <div className="mt-4 md:mt-8 pl-1 md:pl-4">
                            <div className="mb-1 md:mb-2 transform -rotate-3 w-20 md:w-32 opacity-80 -ml-2">
                                <svg viewBox="0 0 200 60" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                                    <path d="M10,40 C 20,10 40,0 50,30 C 60,60 80,40 90,20 C 100,0 120,20 130,50 C 140,80 160,30 180,10" />
                                    <path d="M20,50 L 190,50" strokeWidth="1" opacity="0.4" />
                                    <path d="M20,20 L 40,40" strokeWidth="2" />
                                </svg>
                            </div>
                            <span className="font-bold text-[#222] ml-2 md:ml-4 text-sm md:text-xl" style={{ fontFamily: "var(--font-display), \"Caveat\", cursive" }}>Abin Varghese</span>
                            <div className="ml-2 md:ml-4 mt-0.5 md:mt-1 text-[8px] md:text-xs text-gray-500 uppercase tracking-widest font-sans">Creative Developer</div>
                        </div>

                        <div className="absolute right-0 bottom-0 md:right-3 md:bottom-3 opacity-60 md:opacity-30 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 bg-gradient-to-tl from-black/5 to-transparent rounded-tl-full border-t border-l border-white/50">
                            <span className="text-[#64412f] text-sm md:text-xl font-black transform origin-center rotate-[20deg] group-hover:rotate-[45deg] transition-transform duration-300">↗</span>
                        </div>
                    </div>
                </div>

                {/* ---------- BACK of Flipper: Experience (Spread 2 Left) ---------- */}
                <div className="absolute inset-0 bg-[#fdfdfc] flex flex-col overflow-hidden shadow-[1px_0_5px_rgba(0,0,0,0.05)_inset,-5px_5px_15px_rgba(0,0,0,0.15)]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    
                    <div className="absolute top-0 right-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-transparent to-black/10 z-0 pointer-events-none"></div>
                    <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-[#e1e1e1] shadow-[-1px_0_2px_rgba(0,0,0,0.1)]"></div>
                    
                    <div className="relative z-10 p-3 md:p-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        <h2 className="text-xl md:text-4xl text-[#222] font-bold mb-4 md:mb-8 font-serif tracking-tight text-right pr-2 md:pr-4">Experience</h2>
                        
                        <div className="space-y-4 md:space-y-8 pr-2 md:pr-4">
                            <div className="text-right">
                                <div className="flex flex-col xl:flex-row-reverse items-end xl:items-baseline justify-between mb-1 md:mb-2 gap-1 md:gap-4">
                                    <h3 className="text-sm md:text-xl font-bold text-[#333]">Senior Frontend Developer</h3>
                                    <span className="text-[8px] md:text-xs font-mono bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-100 whitespace-nowrap">2023 - Present</span>
                                </div>
                                <h4 className="text-[9px] md:text-sm font-semibold text-gray-500 mb-1 md:mb-2 uppercase tracking-wide">Tech Agency Inc.</h4>
                                <p className="text-gray-600 text-[10px] md:text-sm leading-relaxed border-r-2 border-blue-200 pr-2 md:pr-4">
                                   Leading UI development and architecture. Built complex web applications focusing on performance optimization, animations, and UX.
                                </p>
                            </div>

                            <div className="text-right pt-2">
                                <div className="flex flex-col xl:flex-row-reverse items-end xl:items-baseline justify-between mb-1 md:mb-2 gap-1 md:gap-4">
                                    <h3 className="text-sm md:text-xl font-bold text-[#333]">Digital Designer</h3>
                                    <span className="text-[8px] md:text-xs font-mono bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-100 whitespace-nowrap">2021 - 2023</span>
                                </div>
                                <h4 className="text-[9px] md:text-sm font-semibold text-gray-500 mb-1 md:mb-2 uppercase tracking-wide">Creative Digital Studio</h4>
                                <p className="text-gray-600 text-[10px] md:text-sm leading-relaxed border-r-2 border-amber-200 pr-2 md:pr-4">
                                   Designed modern brands and landing pages. Created wireframes, mockups, and converted them into interactive React applications.
                                </p>
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