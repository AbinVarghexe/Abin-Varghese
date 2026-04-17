"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { SiteCopyContent, SiteCopyTimelineEntry } from "@/types/site-copy";

type DeskBookSectionProps = {
  copy: Pick<
    SiteCopyContent,
    "aboutIntroTitle" | "aboutIntroBody" | "aboutBookImage" | "aboutTimelineTitle" | "aboutTimelineEntries" | "homeReviewsItems"
  >;
};

type PageContent = {
  type: "text" | "timeline" | "certificates";
  title?: string;
  isChapterStart?: boolean;
  body?: string[];
  items?: SiteCopyTimelineEntry[];
  achievements?: Array<{ name: string; content: string; designation?: string }>;
  image?: string;
  subtitle?: string;
};

export default function DeskBookSection({ copy }: DeskBookSectionProps) {
  const [spread, setSpread] = useState(0);
  const [keyboardEngaged, setKeyboardEngaged] = useState(false);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Pagination Logic - Dynamic Flow Engine
  const pages = useMemo(() => {
    const list: PageContent[] = [];

    // Capacity defines how much text fits on each specific page index
    const getCapacity = (index: number) => {
        if (index === 0) return 450; // Wider image takes more space
        if (index === 1) return 800;
        return 750; // Reverted to spacious two-entry capacity
    };

    // Flow paragraph text across pages
    const flowText = (text: string, title?: string, image?: string) => {
        let remaining = text;
        let isFirstPage = true;
        while (remaining.length > 0) {
            const limit = getCapacity(list.length);
            const paragraphs = remaining.split(/\n\s*\n/).filter(Boolean);
            let currentChunk = "";
            let pIndex = 0;

            while (pIndex < paragraphs.length) {
                const p = paragraphs[pIndex];
                if (currentChunk.length + p.length <= limit) {
                    currentChunk += (currentChunk ? "\n\n" : "") + p;
                    pIndex++;
                } else if (!currentChunk && p.length > limit) {
                    // Split at the last space within the character limit to maximize space usage
                    let breakPoint = p.lastIndexOf(" ", limit);
                    if (breakPoint === -1) breakPoint = limit;
                    currentChunk = p.substring(0, breakPoint + 1).trim();
                    paragraphs[pIndex] = p.substring(breakPoint + 1).trim();
                    break;
                } else break;
            }

            list.push({
                type: "text",
                title: isFirstPage ? title : undefined,
                isChapterStart: isFirstPage && !!title,
                body: [currentChunk],
                image: isFirstPage ? image : undefined,
            });

            remaining = paragraphs.slice(pIndex).join("\n\n").trim();
            isFirstPage = false;
        }
    };

    // Flow timeline entries across pages
    const flowTimeline = (items: SiteCopyTimelineEntry[], title: string, subtitle?: string) => {
        let remaining = [...items];
        let isFirst = true;

        while (remaining.length > 0) {
            const limit = getCapacity(list.length);
            let currentList: SiteCopyTimelineEntry[] = [];
            let currentChars = 0;
            let consumed = 0;

            for (const entry of remaining) {
                // Ensure max 2 entries per page for better spacing
                if (currentList.length >= 2) break;

                // Calculation refined: limit copy contribution to 200 due to line-clamp-4 protection
                // Increased buffer to 120 for more aggressive page breaks on long technical roles
                const entryWeight = entry.role.length + entry.organization.length + Math.min(entry.copy.length, 200) + 120;
                if (currentChars + entryWeight <= limit || currentList.length === 0) {
                    currentList.push(entry);
                    currentChars += entryWeight;
                    consumed++;
                } else break;
            }

            list.push({
                type: "timeline",
                title: isFirst ? title : `${title} (Cont.)`,
                subtitle: isFirst ? subtitle : undefined,
                isChapterStart: isFirst,
                items: currentList,
            });

            remaining = remaining.slice(consumed);
            isFirst = false;
        }
    };

    // Flow certifications across pages
    const flowCertifications = (certs: any[], title: string, subtitle?: string) => {
        let remaining = [...certs];
        let isFirst = true;

        while (remaining.length > 0) {
            const limit = getCapacity(list.length);
            let currentList: any[] = [];
            let currentWeight = 0;
            let consumed = 0;

            for (const cert of remaining) {
                // Ensure max 2 certifications per page
                if (currentList.length >= 2) break;

                // Approximate weight for a certificate entry (+250 for layout overhead)
                const weight = cert.name.length + cert.content.length + 250;
                if (currentWeight + weight <= limit || currentList.length === 0) {
                    currentList.push(cert);
                    currentWeight += weight;
                    consumed++;
                } else break;
            }

            list.push({
                type: "certificates",
                title: isFirst ? title : `${title} (Cont.)`,
                subtitle: isFirst ? subtitle : undefined,
                achievements: currentList,
                isChapterStart: isFirst
            });

            remaining = remaining.slice(consumed);
            isFirst = false;
        }
    };

    // 1. ABOUT ME
    flowText(copy.aboutIntroBody, "About me", copy.aboutBookImage);

    // 2. EDUCATION
    const edu = copy.aboutTimelineEntries.filter(e => 
        e.organization.toLowerCase().match(/college|university|school/) || 
        e.role.toLowerCase().includes("b.tech")
    );
    if (edu.length) flowTimeline(edu, "Academic Foundation");

    // 3. EXPERIENCE
    const exp = copy.aboutTimelineEntries.filter(e => !edu.includes(e));
    if (exp.length) flowTimeline(exp, "Professional Journey");

    // 4. CERTIFICATIONS
    const certs = copy.homeReviewsItems || [];
    if (certs.length) flowCertifications(certs, "Certifications");

    return list;
  }, [copy]);

  const totalSpreads = pages.length;

  const playBookSound = useCallback((type: "open" | "turn" | "close") => {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = audioContextRef.current ?? new AudioCtx();
    audioContextRef.current = ctx;
    if (ctx.state === "suspended") void ctx.resume();

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
      if (!keyboardRef.current || (target && keyboardRef.current.contains(target))) return;
      setKeyboardEngaged(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const closeBook = (e: React.MouseEvent) => { e.stopPropagation(); playBookSound("close"); setSpread(0); };
  const openCover = (e: React.MouseEvent) => { e.stopPropagation(); playBookSound("open"); setSpread(1); };
  const nextSpread = (e: React.MouseEvent) => { e.stopPropagation(); if (spread <= totalSpreads) { playBookSound("turn"); setSpread(s => s + 1); } };
  const prevSpread = (e: React.MouseEvent) => { e.stopPropagation(); if (spread > 1) { playBookSound("turn"); setSpread(s => s - 1); } else { closeBook(e); } };

  const renderPage = (content: PageContent, pageNum: number) => {
    return (
      <div className="w-full h-full flex flex-col px-10 md:px-14 lg:px-16 pt-12 md:pt-16 pb-12 relative z-10 text-[#382818] bg-[#f4e8d1] shadow-inner overflow-hidden select-none">
        <div className="absolute inset-y-0 left-0 bg-linear-to-r from-black/20 to-transparent w-16 pointer-events-none opacity-40"></div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
        {content.title && (
          <header className="mb-6 md:mb-10 relative">
            <h2 className={`font-serif font-bold text-[#4a331e] border-b-2 border-[#d4bc96] pb-3 uppercase tracking-tight ${content.isChapterStart ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl opacity-70'}`}>
              {content.title}
            </h2>
            {content.subtitle && (
              <p className="mt-4 text-[#5c4636]/80 italic font-serif text-sm md:text-base leading-relaxed text-justify">
                {content.subtitle}
              </p>
            )}
          </header>
        )}
        
        {content.type === "text" && content.body && (
          <div className={`font-serif leading-relaxed text-justify text-[#4a3320] ${pageNum <= 2 
            ? 'space-y-6 md:space-y-8 text-base md:text-lg lg:text-[1.15rem]' 
            : 'space-y-6 md:space-y-8 text-sm md:text-base lg:text-lg'}`}>
            
            {content.image && (
              <div className="flex justify-center w-full mt-4 mb-8 transform rotate-0 z-20">
                <div className="relative w-32 h-36 md:w-48 md:h-52 bg-[#fffcf5] p-1.5 shadow-lg border border-[#e0cfa9]">
                  <div className="relative w-full h-full overflow-hidden grayscale-5 sepia-15">
                    <Image src={content.image} alt="Abin Varghese" fill className="object-cover object-top" unoptimized />
                  </div>
                </div>
              </div>
            )}

            {content.body.map((chunk, idx) => (
              <div key={idx} className={pageNum <= 2 ? "space-y-4" : "space-y-6"}>
                {chunk.split(/\n\s*\n/).map((p, i) => (
                    <p key={i} className={i === 0 && idx === 0 && pageNum === 1 
                        ? `${pageNum <= 2 ? "first-letter:text-5xl" : "first-letter:text-6xl"} first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#8b5a2b] first-letter:mt-1 shadow-sm` 
                        : ""}>
                        {p}
                    </p>
                ))}
              </div>
            ))}
          </div>
        )}

        {content.type === "timeline" && content.items && (
          <div className="space-y-5 pl-1">
            {content.items.map((entry, i) => (
              <div key={i} className="relative pl-6 md:pl-10 border-l-2 border-[#8b5a2b]/30 pb-1">
                <div className="absolute top-2 -left-[7px] w-3 h-3 rounded-full bg-[#8b5a2b] shadow-sm"></div>
                
                <div className="flex flex-col gap-1">
                  <h3 className="text-base md:text-xl font-bold font-serif text-[#4a3320] leading-tight">{entry.role}</h3>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b5a2b] opacity-60"></div>
                    <p className="bg-[#8b5a2b]/10 px-2 py-0.5 rounded-sm text-[#965839] text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase opacity-90">
                      {entry.organization} <span className="mx-1 opacity-40">•</span> {entry.duration}
                    </p>
                  </div>
                </div>

                <p className="text-[#5c4636] font-serif text-sm md:text-[1.1rem] mt-2 leading-relaxed opacity-90 text-justify line-clamp-4">{entry.copy}</p>
              </div>
            ))}
          </div>
        )}

        {content.type === "certificates" && content.achievements && (
          <div className="space-y-6">
            {content.achievements.map((item, i) => (
              <div key={i} className="relative p-5 bg-[#fffcf5]/40 border border-[#d4bc96]/60 rounded-sm shadow-sm transition-all hover:bg-[#fffcf5]/60">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#8b5a2b]/20"></div>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-base md:text-lg font-bold font-serif text-[#4a3320] leading-snug">
                      {item.name}
                    </h4>
                    {item.designation && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="w-1 h-1 rounded-full bg-[#8b5a2b]/40"></div>
                        <span className="text-[10px] md:text-xs font-mono font-bold tracking-tight uppercase text-[#965839] opacity-80">
                          {item.designation}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full border border-[#8b5a2b]/30 flex items-center justify-center bg-[#8b5a2b]/5">
                    <span className="text-[#8b5a2b] text-[10px] font-bold">CERT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

        <div className="mt-auto pt-8 flex justify-between items-center text-[10px] md:text-xs font-serif text-[#8b5a2b] opacity-50 font-bold tracking-widest border-t border-[#d4bc96]/50">
          <span className="uppercase">Issue 2026 Archive</span>
          <span>PG. {pageNum.toString().padStart(2, '0')}</span>
        </div>
      </div>
    );
  };

  const renderBlankPage = () => (
    <div className="w-full h-full bg-[#f4e8d1] flex items-center justify-center p-10 relative overflow-hidden" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(205,164,123,0.04) 0px, rgba(205,164,123,0.04) 1px, transparent 1px, transparent 15px)" }}>
         <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-black/10 to-transparent opacity-40"></div>
         <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-black/20 to-transparent"></div>
         <div className="border-2 border-[#d4bc96]/30 px-10 py-6 bg-[#fdfaf5] shadow-sm transform -rotate-1 opacity-20">
            <span className="text-[#8b5a2b] font-serif text-2xl uppercase tracking-[0.6em] font-bold">Chronicles</span>
         </div>
    </div>
  );

  return (
    <section 
      className="relative min-h-screen bg-[#fdfaf5] py-24 px-4 flex flex-col items-center overflow-hidden"
      style={{ 
        backgroundImage: 'radial-gradient(circle, rgba(139, 90, 43, 0.15) 1.5px, transparent 1.5px)',
        backgroundSize: '32px 32px',
        backgroundPosition: 'center center'
      }}
    >
      <button 
        onClick={spread === 0 ? openCover : undefined}
        className={`z-30 font-mono tracking-[0.4em] text-[10px] uppercase mb-16 transition-all duration-500 ${spread === 0 ? 'text-[#8b5a2b] opacity-100 hover:scale-110 cursor-pointer animate-pulse' : 'text-gray-400 opacity-20 cursor-default'}`}
      >
         {spread > 0 ? "Chronicle in Progress" : "Click to Unlock the tome"}
      </button>

      <div 
        className="relative perspective-[3000px] transition-all duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)] w-[95vw] sm:w-[650px] md:w-[850px] lg:w-[1050px] h-[500px] sm:h-[600px] md:h-[750px]"
        style={{ 
            transformStyle: "preserve-3d",
            transform: spread === 0 ? "translateX(-25%)" : "translateX(0)"
        }}
      >
        <div className={`absolute inset-y-0 right-0 z-0 bg-[#dcb994] rounded shadow-[0_45px_100px_-20px_rgba(0,0,0,0.5)] border border-[#9c7145] overflow-hidden transition-all duration-1000 ${spread === 0 ? 'left-1/2' : 'left-0'}`}>
             <div className={`absolute left-0 top-0 bottom-0 w-10 md:w-16 bg-linear-to-r from-black/40 via-[#8b5a2b] to-black/40 z-10 border-r border-black/10 transition-opacity duration-1000 ${spread === 0 ? 'opacity-0' : 'opacity-100'}`}></div>
             <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}></div>
             
             <div className="flex h-full">
                <div className={`w-1/2 h-full bg-[#e8ccad] border-r border-[#9c7145]/20 transition-opacity duration-1000 ${spread === 0 ? 'opacity-0' : 'opacity-30'}`}></div>
                <div className="w-1/2 h-full bg-[#f4e8d1] flex items-center justify-center opacity-30">
                    <span className="font-serif italic text-xs text-[#8b5a2b] tracking-widest uppercase">The End of the Tome</span>
                </div>
             </div>
        </div>

        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {[...Array(totalSpreads + 1)].map((_, i) => {
                const zIndex = 100 - i;
                const isFlipped = spread > i;
                return (
                    <div 
                        key={i}
                        className="absolute inset-y-0 right-0 w-1/2 origin-left transition-transform duration-1400 ease-[cubic-bezier(0.645,0.045,0.355,1)] cursor-pointer"
                        style={{ 
                            transformStyle: "preserve-3d", 
                            transform: isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)",
                            zIndex: isFlipped ? i : zIndex,
                            pointerEvents: (spread === i || spread === i + 1) ? 'auto' : 'none'
                        }}
                        onClick={spread === i ? (i === 0 ? openCover : nextSpread) : (spread === i + 1 ? prevSpread : undefined)}
                    >
                        <div 
                            className="absolute inset-0 bg-[#dcb994] shadow-md border-y border-r border-[#a87b51] flex flex-col overflow-hidden" 
                            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "translateZ(1px)" }}
                        >
                            {i === 0 ? (
                                <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#dcb994]">
                                    <div className="absolute inset-6 md:inset-10 border-2 border-[#8b5a2b]/30 pointer-events-none"></div>
                                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-linear-to-r from-black/20 via-black/10 to-transparent"></div>
                                    <div className="w-20 h-20 md:w-28 md:h-28 mb-10 rounded-full border-4 border-[#8b5a2b]/40 flex items-center justify-center bg-[#cda47b] shadow-inner transform -rotate-12 transition-transform hover:rotate-0 duration-700">
                                        <svg className="w-10 h-10 md:w-14 md:h-14 text-[#5c3a21] opacity-70" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l4.5 9h-9L12 2zm0 2.5L9.5 9h5L12 4.5zm0 15.5l-4.5-9h9L12 20zM11 17.5l2.5-4.5h-5L12 17.5z"/></svg>
                                    </div>
                                    <h1 className="text-[#382010] text-3xl md:text-5xl font-serif uppercase mb-8 leading-tight tracking-[0.08em] font-bold">
                                        The Magical<br/><span className="text-[#8b5a2b]">Chronicles</span>
                                    </h1>
                                    <div className="w-32 h-[2px] bg-[#8b5a2b] opacity-40 mb-8 mx-auto"></div>
                                    <span className="text-[#5c3a21] text-xs md:text-sm font-serif tracking-[0.4em] font-bold opacity-80 decoration-wavy">ABIN VARGHESE</span>
                                </div>
                            ) : (
                                pages[i-1] ? renderPage(pages[i-1], i) : <div className="w-full h-full bg-[#f4e8d1]" />
                            )}
                        </div>

                        <div 
                            className="absolute inset-0 bg-[#f4e8d1] shadow-md border-y border-l border-[#d4bc96] flex flex-col overflow-hidden" 
                            style={{ transform: "rotateY(180deg) translateZ(1px)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                        >
                            {i === 0 ? (
                                <div className="w-full h-full flex items-center justify-center bg-[#f4e8d1] p-12 relative" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(205,164,123,0.06) 0px, rgba(205,164,123,0.06) 1px, transparent 1px, transparent 12px)" }}>
                                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-black/20 via-black/10 to-transparent"></div>
                                    <div className="border border-[#cda47b]/40 px-12 py-6 bg-[#fdfaf5]/80 shadow-sm transform -rotate-2 backdrop-blur-[1px]">
                                        <span className="text-[#8b5a2b] font-serif text-3xl opacity-40 uppercase tracking-[0.6em] font-bold">Ex Libris</span>
                                    </div>
                                </div>
                            ) : (
                                renderBlankPage()
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        <div className={`absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[4px] bg-black/20 z-200 transition-opacity duration-1000 ${spread > 0 ? 'opacity-100' : 'opacity-0'} pointer-events-none`}></div>
      </div>

      <div className="mt-24 flex flex-col items-center gap-10 z-50">
          <div className="flex gap-8 md:gap-14 items-center">
            <button 
                onClick={prevSpread} 
                disabled={spread === 0}
                className="group flex items-center gap-4 px-8 py-3 bg-[#fdfaf5]/60 border border-[#8b5a2b]/30 text-[#8b5a2b] font-serif text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] disabled:opacity-5 transition-all hover:bg-[#8b5a2b] hover:text-[#fdfaf5] hover:border-[#8b5a2b] hover:-translate-x-1 shadow-sm hover:shadow-md cursor-pointer rounded-full"
            >
                <span className="text-sm">←</span> Prev
            </button>
            
            <div className="w-px h-8 bg-[#8b5a2b]/20"></div>
            
            <button 
                onClick={nextSpread} 
                disabled={spread > totalSpreads}
                className="group flex items-center gap-4 px-8 py-3 bg-[#fdfaf5]/60 border border-[#8b5a2b]/30 text-[#8b5a2b] font-serif text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] disabled:opacity-5 transition-all hover:bg-[#8b5a2b] hover:text-[#fdfaf5] hover:border-[#8b5a2b] hover:translate-x-1 shadow-sm hover:shadow-md cursor-pointer rounded-full"
            >
                Next <span className="text-sm">→</span>
            </button>
          </div>
      </div>

    </section>
  );
}
