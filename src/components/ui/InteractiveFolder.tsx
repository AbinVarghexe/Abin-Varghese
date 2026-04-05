'use client';

import React from 'react';
import { motion } from 'framer-motion';

const InteractiveFolder = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center py-10 perspective-distant select-none">
      
      {/* 3D Wrapper — NO whileHover here; variants propagate from the parent card */}
      <motion.div 
        className="relative w-48 h-36 flex items-end justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* Main Folder Back Panel */}
        <div 
          className="absolute inset-x-0 bottom-0 h-full bg-zinc-900 rounded-[24px] shadow-3xl"
          style={{ 
            background: 'linear-gradient(135deg, #1e1e20 0%, #0a0a0b 100%)',
            boxShadow: '0 20px 50px -12px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)'
          }}
        />

        {/* 🚀 THE POPUP UI CARD (UI/UX Themed) */}
        <motion.div
          variants={{
            initial: { y: 0, scale: 0.9, opacity: 0, rotateX: 0 },
            visible: { y: 0, scale: 0.9, opacity: 0, rotateX: 0 },
            hover: { 
              y: -80, 
              scale: 1.1, 
              opacity: 1,
              rotateX: -12,
              transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } 
            }
          }}
          className="absolute z-20 w-40 h-48 bg-white rounded-2xl border border-zinc-100 p-4 flex flex-col gap-3 overflow-hidden origin-bottom"
          style={{ 
            boxShadow: '0 30px 60px -10px rgba(59, 91, 219, 0.3)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Mini UI Layout Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200">
               {/* Avatar placeholder */}
               <div className="w-full h-full bg-linear-to-br from-blue-400 to-indigo-500 opacity-60" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="w-16 h-2 bg-zinc-200 rounded-full" />
              <div className="w-10 h-1.5 bg-zinc-100 rounded-full" />
            </div>
          </div>

          {/* Stats / Progress Bar View */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center">
              <div className="w-12 h-1.5 bg-zinc-100 rounded-full" />
              <div className="text-[10px] font-bold text-blue-500 uppercase">82%</div>
            </div>
            <div className="w-full h-2.5 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
              <motion.div 
                variants={{
                  initial: { width: 0 },
                  visible: { width: 0 },
                  hover: { width: '82%', transition: { duration: 0.8, delay: 0.2 } }
                }}
                className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full" 
              />
            </div>
          </div>

          {/* Grid Blocks */}
          <div className="grid grid-cols-2 gap-2 mt-1">
             <div className="h-10 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center shadow-xs">
                <div className="w-4 h-4 rounded-full bg-blue-500/10" />
             </div>
             <div className="h-10 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center shadow-xs">
                <div className="w-4 h-4 rounded-full bg-indigo-500/10" />
             </div>
          </div>

           {/* Stylized UI lines */}
           <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-indigo-500 opacity-20" />
        </motion.div>

        {/* Inner Document layers (Subtle depth) */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-2 opacity-40">
           <div className="w-32 h-32 bg-zinc-200 rounded-xl -rotate-6 translate-x-2" />
           <div className="w-32 h-32 bg-zinc-300 rounded-xl rotate-3 -translate-x-2 translate-y-1" />
        </div>

        {/* 🎨 Folder Front Panels (3D Skew Effect) */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] z-30 flex flex-col pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
           {/* Tab Top */}
           <div className="w-16 h-5 bg-zinc-800/80 backdrop-blur-md rounded-t-2xl ml-6 border-t border-x border-white/10" />
           
           {/* Main Front Body - Left Flap (Skewed) */}
           <motion.div 
             className="absolute inset-0 origin-bottom"
             variants={{ 
                initial: { skewX: 0, scaleY: 1 },
                visible: { skewX: 0, scaleY: 1 },
                hover: { 
                  skewX: -15,
                  scaleY: 0.6,
                  transition: { duration: 0.35, ease: 'easeOut' }
                }
             }}
             style={{ 
                background: 'linear-gradient(135deg, rgba(55,55,60,0.85) 0%, rgba(25,25,28,0.95) 100%)',
                borderRadius: '5px 10px 10px 10px',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 10px 20px rgba(0,0,0,0.4)'
             }}
           />

           {/* Main Front Body - Right Flap (Skewed) */}
           <motion.div 
             className="absolute inset-0 origin-bottom"
             variants={{ 
                initial: { skewX: 0, scaleY: 1 },
                visible: { skewX: 0, scaleY: 1 },
                hover: { 
                  skewX: 15,
                  scaleY: 0.6,
                  transition: { duration: 0.35, ease: 'easeOut' }
                }
             }}
             style={{ 
                background: 'linear-gradient(225deg, rgba(45,45,50,0.75) 0%, rgba(18,18,22,0.95) 100%)',
                borderRadius: '5px 10px 10px 10px',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)'
             }}
           />
        </div>

      </motion.div>
    </div>
  );
};

export default InteractiveFolder;
