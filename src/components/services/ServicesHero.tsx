'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';

const ServicesHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // ── Mouse Tracking for 2.5D Illusion ────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement with springs
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Normalize mouse position from -0.5 to 0.5
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // ── Scroll Tracking ─────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // ── Intensified Parallax Transforms ─────────────────────────
  
  // Layer 1: Sky (Deep Background)
  // Scroll: moves down slowly
  // Mouse: shifts opposite to mouse for depth
  const skyScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const skyMouseX = useTransform(smoothMouseX, [-0.5, 0.5], ["1.5%", "-1.5%"]);
  const skyMouseY = useTransform(smoothMouseY, [-0.5, 0.5], ["1.5%", "-1.5%"]);

  // Layer 1.5: Butterfly Video (Middle-Back)
  // Scroll: floats upwards mid-speed
  // Mouse: shifts more than sky, less than text
  const butterflyScrollY = useTransform(scrollYProgress, [0, 1], ["0px", "-200px"]);
  const butterflyMouseX = useTransform(smoothMouseX, [-0.5, 0.5], ["-15px", "15px"]);
  const butterflyMouseY = useTransform(smoothMouseY, [-0.5, 0.5], ["-10px", "10px"]);

  // Layer 2: Services Text (Middle Layer)
  // Scroll: floats upwards aggressively
  // Mouse: shifts with mouse for "pushed" effect, slight tilt
  const textScrollY = useTransform(scrollYProgress, [0, 1], ["0px", "-450px"]);
  const textMouseX = useTransform(smoothMouseX, [-0.5, 0.5], ["-30px", "30px"]);
  const textMouseY = useTransform(smoothMouseY, [-0.5, 0.5], ["-20px", "20px"]);
  const textRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const textRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);

  // Layer 3: Grass Foreground (Close Layer)
  // Scroll: mostly anchored, slight downward reveal
  // Mouse: shifts more aggressively than text for depth illusion
  const grassMouseX = useTransform(smoothMouseX, [-0.5, 0.5], ["-50px", "50px"]);
  const grassMouseY = useTransform(smoothMouseY, [-0.5, 0.5], ["-25px", "25px"]);
  const grassScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen w-full bg-transparent cursor-default"
      style={{ 
        perspective: "1000px"
      }}
    >
      {/* ── Chroma Key SVG Filter ────────────────────────────────── */}
      <svg className="absolute w-0 h-0 pointer-events-none overflow-hidden">
        <defs>
          <filter id="chromaKey" colorInterpolationFilters="sRGB">
            {/* 1. Generate Mask: Alpha is high for pure green screen, low elsewhere */}
            <feColorMatrix result="mask" values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              -1 3.5 -1.5 0 -1.0"
            />
            {/* 2. Threshold & Invert: Green becomes transparent (0), Subject becomes opaque (1) 
                Using a multi-step table for softer but controlled transitions.
            */}
            <feComponentTransfer in="mask" result="alpha">
              <feFuncA type="table" tableValues="1 1 1 1 0.8 0" />
            </feComponentTransfer>

            {/* 3. Desaturate: Reduce butterfly saturation subtly */}
            <feColorMatrix in="SourceGraphic" type="saturate" values="0.75" result="cleaned" />
            
            {/* 4. Composite: Apply the alpha mask to the cleaned graphic */}
            <feComposite in="cleaned" in2="alpha" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* ── Layer 1: Sky Background (z-0) ────────────────────────── */}
      <motion.div 
        style={{ 
          y: skyScrollY,
          x: skyMouseX,
          translateY: skyMouseY,
          scale: 1.1, // Slight overscale to hide edges during mouse move
          WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
        }} 
        className="absolute inset-0 z-0 h-full w-full"
      >
        <Image
          src="/services/Sky.png"
          alt="Sky Background"
          fill
          className="object-cover object-bottom"
          priority
        />
      </motion.div>

      {/* ── Layer 1.2: Specialized Vertical Grid Overlay (z-[1]) ─── */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(115, 115, 115, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100%',
          backgroundPosition: 'center center'
        }}
      />

      {/* ── Layer 1.5: Butterfly Video (z-5) ──────────────────────── */}
      <motion.div
        style={{
          y: butterflyScrollY,
          x: butterflyMouseX,
          translateY: butterflyMouseY,
          z: 25 // Position between Sky and Text
        }}
        className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none"
      >
        <div 
          className="relative w-full max-w-4xl aspect-video overflow-hidden"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 95%)',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 95%)'
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
            style={{ filter: "url(#chromaKey)" }}
          >
            <source src="/services/butterfly_gs.mp4" type="video/mp4" />
          </video>
        </div>
      </motion.div>

      {/* ── Layer 2: Black Services Text (z-10) ───────────────────── */}
      <motion.div 
        style={{ 
          y: textScrollY,
          x: textMouseX,
          translateY: textMouseY,
          rotateX: textRotateX,
          rotateY: textRotateY,
          z: 50 // Pull forward in 3D space
        }}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10vw] md:text-[11rem] font-bold text-black uppercase tracking-tighter leading-none select-none text-center px-6"
        >
          Services
        </motion.h1>
      </motion.div>

      {/* ── Layer 3: Grass Hill Foreground (z-20) ─────────────────── */}
      <motion.div 
        style={{ 
          x: grassMouseX,
          y: grassMouseY,
          scale: grassScale,
          z: 150, // Pull further forward for strong 2.5D effect
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, rgba(0,0,0,0.5) 90%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 80%, rgba(0,0,0,0.5) 90%, transparent 100%)'
        }}
        className="absolute bottom-0 left-[-5%] right-[-5%] z-20 h-[70vh] md:h-[85vh] pointer-events-none"
      >
        <Image
          src="/services/GrassFade.png"
          alt="Grass Foreground"
          fill
          className="object-cover object-bottom"
          priority
        />
      </motion.div>
      
    </section>
  );
};

export default ServicesHero;
