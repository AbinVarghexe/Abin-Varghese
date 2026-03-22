"use client";


import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";


const TypewriterSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const typewriterImg = "/typewriter.png";

  // Paper animation and typing effect
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [paperInView, setPaperInView] = useState(false);
  const fullText = `"Design is how it works."\n\n— Steve Jobs`;
  const typewriterFont = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  const paperWidth = 370;
  const paperHeight = 360;
  const paperViewportTop = 130;

  useEffect(() => {
    setPaperInView(true);
  }, []);

  useEffect(() => {
    if (!paperInView) return;
    let index = 0;
    let typingInterval: NodeJS.Timeout;
    setIsTyping(true);
    typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 70);
    return () => clearInterval(typingInterval);
  }, [paperInView, fullText]);

  // Paper animation: y position depends on typing progress
  // Adjusted so the paper starts just inside the roller and comes out above the typewriter
  const paperStartY = 110; // px, just inside the roller
  const paperEndY = -65; // Keep the paper reveal inside this section
  const paperY = paperStartY + ((paperEndY - paperStartY) * (typedText.length / fullText.length));

  // Grainy paper background (SVG data URI)
  const grainyPaper =
    'data:image/svg+xml;utf8,<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/></filter><rect width="100%25" height="100%25" fill="%23f8f6f2"/><rect width="100%25" height="100%25" filter="url(%23grain)" opacity="0.13"/></svg>';

  return (
    <section ref={containerRef} className="relative z-10 w-full pt-48 pb-28 flex items-center justify-center overflow-visible">
      <div className="relative w-[850px] h-[760px] flex justify-center items-end">
        {/* Animated Paper */}
        {/* Paper is now clipped so only the part above the typewriter is visible */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          style={{
            top: paperViewportTop,
            width: paperWidth,
          }}
        >
          <motion.div
            initial={{ y: paperStartY }}
            animate={{ y: paperY }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
            className="rounded-[2px] shadow-[0_-5px_15px_rgba(0,0,0,0.10),0_0_20px_rgba(0,0,0,0.05)] border-t border-x border-[#e8e4d8] flex flex-col justify-start items-start px-10 pt-12 pb-8"
            style={{
              width: paperWidth,
              height: paperHeight,
              background: `url('${grainyPaper}') center/cover, #f8f6f2`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            }}
          >
            <span
              className="block text-[1.28rem] text-[#232323] leading-[2rem] whitespace-pre-wrap select-none"
              style={{
                fontFamily: typewriterFont,
                letterSpacing: '0.04em',
                textShadow: '0 1px 0 #fff, 0 0.5px 0 #eaeaea',
                userSelect: 'none',
              }}
            >
              {typedText}
              {isTyping && (
                <span className="inline-block w-2 h-6 bg-black/80 align-middle ml-1 animate-pulse" />
              )}
            </span>
          </motion.div>
        </div>
        {/* Typewriter image (large, centered) */}
        <img
          src={typewriterImg}
          alt="Vintage 3D Typewriter"
          className="absolute z-20 left-1/2 -translate-x-1/2 bottom-0 w-[550px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] origin-bottom pointer-events-none"
          draggable={false}
        />
        {/* Shadow on the desk */}
        <div className="absolute bottom-[10%] z-0 left-1/2 -translate-x-1/2 w-[450px] h-[35px] bg-black/40 blur-[25px] rounded-[100%]" />
      </div>
    </section>
  );
};

export default TypewriterSection;
