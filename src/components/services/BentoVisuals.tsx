'use client';

import React, { Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, OrbitControls, PresentationControls, useGLTF, Environment } from '@react-three/drei';
import { 
  Zap,
  Loader2,
  Sparkles
} from 'lucide-react';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import Folder from '@/components/ui/Folder';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';

// --- Folder Content ---
const folderPapers: React.ReactNode[] = [
  <div key="ps" className="w-full h-full p-3.5 flex items-center justify-center rounded-md pointer-events-none">
    <img src="https://skillicons.dev/icons?i=ps" alt="Photoshop" className="w-8 h-8 object-contain" />
  </div>,
  <div key="ai" className="w-full h-full p-3.5 flex items-center justify-center rounded-md pointer-events-none">
    <img src="https://skillicons.dev/icons?i=ai" alt="Illustrator" className="w-8 h-8 object-contain" />
  </div>,
  <div key="figma" className="w-full h-full p-3 flex items-center justify-center rounded-md pointer-events-none">
    <img src="https://skillicons.dev/icons?i=figma" alt="Figma" className="w-10 h-10 object-contain" />
  </div>,
];
// --- Lottie JSON Fetch Hook ---
function useLottieData(url: string) {
  const [animationData, setAnimationData] = React.useState<any>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => { if (!cancelled) setAnimationData(data); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [url]);

  return { animationData, error };
}

// --- Reusable Lottie Component ---
const LottiePlayer = ({ url, isLarge = false }: { url: string; isLarge?: boolean }) => {
  const { animationData, error } = useLottieData(url);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-300 opacity-20 scale-75">
        <Zap className="w-12 h-12" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex items-center justify-center p-6 ${isLarge ? 'pb-28' : 'pb-24'}`}>
      <div className="w-full h-full">
        {animationData ? (
          <Lottie 
            animationData={animationData} 
            loop={true} 
            autoplay={true}
            className={`w-full h-full object-contain ${isLarge ? 'scale-125' : 'scale-110'}`}
          />
        ) : (
          <div className="w-32 h-32 rounded-2xl bg-zinc-100 animate-pulse opacity-50" />
        )}
      </div>
    </div>
  );
};

// --- 1. Motion Graphics ---
export const MotionGraphics = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-transparent pb-16">
      <span className="pointer-events-none whitespace-pre-wrap bg-linear-to-b from-zinc-900 to-zinc-400 bg-clip-text text-center text-7xl font-semibold leading-none text-transparent opacity-5 uppercase tracking-tighter">
        MOTION
      </span>

      {/* Inner Circles — Design Tools */}
      <OrbitingCircles iconSize={40} radius={65} duration={18} speed={1.2}>
        <div className="flex items-center justify-center w-10 h-10 transition-transform hover:scale-110">
          <img src="https://skillicons.dev/icons?i=figma" alt="Figma" className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center justify-center w-10 h-10 transition-transform hover:scale-110">
          <img src="https://skillicons.dev/icons?i=blender" alt="Blender" className="w-full h-full object-contain" />
        </div>
      </OrbitingCircles>

      {/* Outer Circles — Motion & Publishing */}
      <OrbitingCircles iconSize={52} radius={125} duration={25} reverse speed={0.8}>
        <div className="flex items-center justify-center w-12 h-12 p-2 transition-transform hover:scale-110">
          <img src="https://skillicons.dev/icons?i=ae" alt="After Effects" className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center justify-center w-12 h-12 p-2 transition-transform hover:scale-110">
          <img src="https://skillicons.dev/icons?i=pr" alt="Premiere Pro" className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center justify-center w-12 h-12 p-2 transition-transform hover:scale-110">
          <img src="https://cdn.simpleicons.org/davinciresolve" alt="DaVinci Resolve" className="w-full h-full object-contain" />
        </div>
      </OrbitingCircles>
    </div>
  );
};

// --- 2. Video Editing ---
export const VideoEditing = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center pt-8 pb-32 px-6 overflow-hidden bg-transparent">
      {/* Simplified Video Preview "Screen" */}
      <motion.div 
        className="w-48 h-32 rounded-xl bg-zinc-900 border-4 border-zinc-800 shadow-2xl relative overflow-hidden mb-6 flex items-center justify-center p-4"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Abstract moving visuals in the screen */}
        <motion.div 
          className="w-full h-full rounded-md bg-linear-to-tr from-amber-500/20 to-orange-500/20 relative overflow-hidden"
        >
          <motion.div 
            className="absolute top-2 left-2 right-2 h-1.5 rounded-full bg-white/20"
            animate={{ width: ["10%", "80%", "30%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-2 left-2 w-12 h-12 rounded-lg bg-orange-500/30 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-6 h-6 text-orange-400" />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-orange-500/10 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Editing Timeline Animation */}
      <div className="w-full flex flex-col gap-2 relative">
        {/* Timeline Ruler */}
        <div className="w-full h-4 border-b border-zinc-200 mb-1 flex justify-between px-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`w-px ${i % 2 === 0 ? 'h-full bg-zinc-300' : 'h-1/2 bg-zinc-200 mt-auto'}`} />
          ))}
        </div>

        {[
          { color: '#f59e0b', width: '40%', x: '10%', delay: 0 },
          { color: '#f97316', width: '30%', x: '55%', delay: 0.2 },
          { color: '#ef4444', width: '25%', x: '20%', delay: 0.4 },
        ].map((track, i) => (
          <div key={i} className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200/50 shadow-inner">
            <motion.div 
              className="absolute h-full rounded-full shadow-sm"
              style={{ backgroundColor: track.color, left: track.x, width: track.width }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: track.delay }}
            />
          </div>
        ))}

        {/* Moving Playhead */}
        <motion.div 
          className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
          animate={{ left: ["0%", "100%", "0%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rotate-45 bg-red-500 shadow-sm" />
        </motion.div>
      </div>

      {/* Global VFX Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {isMounted && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-orange-400/30"
            initial={{ 
              x: Math.random() * 300 - 150 + 150, 
              y: Math.random() * 300 - 150 + 150, 
              opacity: 0 
            }}
            animate={{ 
              y: [0, -50, -100], 
              opacity: [0, 1, 0],
              scale: [0, 1, 0] 
            }}
            transition={{ 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
          />
        ))}
      </div>
    </div>
  );
};

// --- 3. Graphics Design ---
export const GraphicDesign = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden bg-transparent">
      {/* Artboard Background with Grid */}
      <div 
        className="absolute inset-4 rounded-xl border border-zinc-200 bg-zinc-50/50 shadow-inner overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Animated Pen Tool Path */}
        <svg className="w-full h-full pointer-events-none opacity-40">
          <motion.path
            d="M 50 150 Q 150 50 250 150 T 450 150"
            fill="transparent"
            stroke="#be4bdb"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Bezier Nodes */}
          {[50, 250, 450].map((x, i) => (
            <motion.rect
              key={i}
              x={x - 4}
              y={146}
              width="8"
              height="8"
              fill="white"
              stroke="#be4bdb"
              strokeWidth="2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </svg>
      </div>

      {/* Floating Layer Cards (Illustrator Style) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="absolute -right-2 top-1/4 w-32 h-40 bg-white rounded-lg border border-zinc-200 shadow-xl p-3 flex flex-col gap-2 opacity-90 scale-90"
          animate={{ x: [0, -10, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-2 rounded-full bg-zinc-100 mb-2" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-be4bdb opacity-60' : 'bg-zinc-100'}`} style={i === 0 ? { backgroundColor: '#be4bdb' } : {}} />
              <div className="flex-1 h-1.5 rounded-full bg-zinc-50" />
            </div>
          ))}
        </motion.div>

        <motion.div 
          className="absolute -left-4 bottom-1/4 w-28 h-28 bg-white rounded-lg border-2 border-dashed border-zinc-300 flex items-center justify-center opacity-80"
          animate={{ scale: [0.95, 1, 0.95], rotate: [2, 0, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-12 h-12 rounded-full border-4 border-be4bdb/30" style={{ borderColor: '#be4bdb33' }} />
        </motion.div>
      </div>
    </div>
  );
};

// --- 4. UI UX Design ---
export const UIUXDesign = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-animate the folder open/close on a loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen(prev => !prev);
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center pb-24">
      <motion.div
        className="w-full h-full flex items-center justify-center"
        animate={{
          y: isOpen ? 45 : 0, 
          rotateZ: isOpen ? -1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Folder color="#3b5bdb" size={1.0} items={folderPapers} isOpen={isOpen} />
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- 5. Web Design ---
export const WebDesign = () => {
  return <LottiePlayer url="https://assets3.lottiefiles.com/packages/lf20_4kx2q32n.json" />;
};

// --- 6. Visual Effects ---
export const VisualEffects = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden bg-transparent">
      {/* Node-based Compositing Graph */}
      <div className="w-full h-full relative border border-zinc-100 rounded-2xl bg-zinc-50/20 shadow-inner">
        {/* Animated Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.path
            d="M 60 80 L 160 140 M 60 200 L 160 140 M 160 140 L 280 140"
            stroke="rgba(224, 49, 49, 0.2)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          {/* Animated Glow "Pulse" Traveling along lines */}
          <motion.circle
            r="4"
            fill="#e03131"
            filter="blur(4px)"
            animate={{ 
              cx: [60, 160, 280],
              cy: [80, 140, 140],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Floating Composite Nodes */}
        <div className="absolute inset-0">
          {[
            { x: '15%', y: '25%', label: 'MASK' },
            { x: '15%', y: '65%', label: 'BG' },
            { x: '50%', y: '45%', label: 'MERGE' },
            { x: '85%', y: '45%', label: 'OUT' },
          ].map((node, i) => (
            <motion.div
              key={i}
              className="absolute w-12 h-6 bg-white border border-zinc-200 rounded shadow-sm flex items-center justify-center"
              style={{ left: node.x, top: node.y }}
              animate={{ 
                y: [0, i % 2 === 0 ? -3 : 3, 0],
                boxShadow: i === 2 
                  ? ['0 0 0px rgba(224, 49, 49, 0)', '0 0 10px rgba(224, 49, 49, 0.3)', '0 0 0px rgba(224, 49, 49, 0)']
                  : ['0 0 0px rgba(0,0,0,0)', '0 0 0px rgba(0,0,0,0)', '0 0 0px rgba(0,0,0,0)']
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            >
              <span className="text-[6px] font-bold text-zinc-400 tracking-tighter">{node.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 7. 3D Designing ---
const Scene = () => {
  const { scene } = useGLTF('/3d_model/cube_cascade.glb');

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <Environment preset="city" />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <primitive 
          object={scene} 
          scale={0.8} 
          position={[0, -0.5, 0]} 
          rotation={[0.3, 0.5, 0]} 
        />
      </Float>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
    </>
  );
};

export const ThreeDDesigning = () => {
  return (
    <div className="w-full h-full pb-28">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload('/3d_model/cube_cascade.glb');
