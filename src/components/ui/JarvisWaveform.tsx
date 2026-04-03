"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * JarvisWaveform: A high-fidelity, fluid SVG sine wave visualizer.
 * Updated to match the official Portfolio Design System (Blue/Indigo/White).
 * Added 'volume' support for real-time voice reactivity.
 */
export default function JarvisWaveform({ 
  isThinking, 
  volume = 0 
}: { 
  isThinking: boolean;
  volume?: number;
}) {
  // Balanced palette using official Blue (#0020d7) and Indigo
  const waves = [
    { color: "#0020d7", opacity: 0.7, duration: 3, delay: 0 },
    { color: "#4f46e5", opacity: 0.5, duration: 4, delay: 0.5 },
    { color: "#06b6d4", opacity: 0.4, duration: 2.5, delay: 1 },
    { color: "#ffffff", opacity: 0.2, duration: 5, delay: 1.5 },
    { color: "#0020d7", opacity: 0.3, duration: 6, delay: 2 },
  ];

  // Base amplitude modified by real-time voice volume
  const amp = 1 + volume * 5; // Scale up to 6x normal height suring speech

  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-gradient(circle, rgba(0,32,215,0.08) 0%, transparent 70%)" />
      
      <svg
        viewBox="0 0 800 200"
        className="w-full max-w-2xl"
        preserveAspectRatio="none"
      >
        {waves.map((wave, i) => (
          <motion.path
            key={i}
            d="M 0 100 Q 100 50 200 100 T 400 100 T 600 100 T 800 100"
            fill="none"
            stroke={wave.color}
            strokeWidth={1.5 + volume * 2} // Lines get thicker as you speak
            strokeLinecap="round"
            style={{ mixBlendMode: "screen" }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: wave.opacity + (volume * 0.3), // Glow brighter as you speak
              d: isThinking || volume > 0.05
                ? [
                    `M 0 100 Q 100 ${100 - (80 * amp)} 200 100 T 400 100 T 600 100 T 800 100`,
                    `M 0 100 Q 100 ${100 + (80 * amp)} 200 100 T 400 100 T 600 100 T 800 100`,
                    `M 0 100 Q 100 ${100 - (80 * amp)} 200 100 T 400 100 T 600 100 T 800 100`,
                  ]
                : [
                    "M 0 100 Q 100 85 200 100 T 400 100 T 600 100 T 800 100",
                    "M 0 100 Q 100 115 200 100 T 400 100 T 600 100 T 800 100",
                    "M 0 100 Q 100 85 200 100 T 400 100 T 600 100 T 800 100",
                  ],
            }}
            transition={{
              d: {
                duration: wave.duration / (isThinking || volume > 0.1 ? 3 : 1),
                repeat: Infinity,
                ease: "easeInOut",
                delay: wave.delay,
              },
              opacity: { duration: 0.5 },
              pathLength: { duration: 1.5 },
            }}
          />
        ))}
      </svg>
      
      {/* Centered Focus Glow */}
      <motion.div 
        animate={{ 
          scale: (isThinking || volume > 0.1) ? [1, 1.5, 1] : [1, 1.1, 1],
          opacity: volume > 0.1 ? [0.4, 0.8, 0.4] : [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute w-24 h-24 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
      />
    </div>
  );
}
