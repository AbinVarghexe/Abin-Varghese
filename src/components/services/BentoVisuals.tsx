'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ShoppingCart, Zap } from 'lucide-react';

// ─── 1. Revenue Funnel (Top Left Visual) ──────────────────────
export const RevenueFunnel = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center pt-8 overflow-hidden">
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Funnel SVG / Shape */}
      <svg className="absolute w-[180%] h-[180%] opacity-10 pointer-events-none" viewBox="0 0 200 200" fill="none">
        <path d="M20 20 C100 20, 100 180, 180 180" stroke="currentColor" strokeWidth="1" className="text-blue-500" />
      </svg>
      
      {/* Avatars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, x: Math.random() * 200 - 100, y: -150 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
            x: 0,
            y: 0
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "circIn"
          }}
          className="absolute w-10 h-10 rounded-full border-2 border-white shadow-md bg-zinc-100 overflow-hidden"
        >
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
        </motion.div>
      ))}

      {/* Central Hub */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative z-10 w-20 h-20 rounded-full bg-blue-600 shadow-xl flex items-center justify-center border-4 border-white"
      >
        <div className="text-white font-bold text-2xl">cp</div>
      </motion.div>

      {/* New Subscriber Badge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: [0, 1, 1, 0], y: [30, 20, 20, 10] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className="absolute bottom-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-zinc-100 flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-[10px] font-medium text-zinc-600">New Subscriber</span>
      </motion.div>
    </div>
  </div>
);

// ─── 2. Real-Time Insights (Top Middle Visual) ────────────────
export const RealTimeGraph = () => (
  <div className="w-full h-full flex flex-col items-center justify-end p-6 gap-3">
    <div className="flex items-end gap-1.5 h-32 w-full max-w-[200px]">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            height: [
              `${30 + Math.random() * 70}%`, 
              `${40 + Math.random() * 50}%`, 
              `${20 + Math.random() * 80}%`,
              `${30 + Math.random() * 70}%`
            ] 
          }}
          transition={{ 
            duration: 1.5 + Math.random(), 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="flex-1 rounded-t-sm"
          style={{ 
            backgroundColor: i % 2 === 0 ? '#10b981' : '#6ee7b7',
            opacity: 0.6 + (i / 12) * 0.4 
          }}
        />
      ))}
    </div>
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-emerald-600 self-start">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Live
    </div>
  </div>
);

// ─── 3. Payment Status List (Top Right Visual) ───────────────
export const PaymentStatusList = () => (
  <div className="relative w-full h-full p-6 pt-10 flex flex-col gap-4 overflow-hidden">
    {[
      { status: 'failed', amount: '$85.50', time: '12:45' },
      { status: 'failed', amount: '$74.20', time: '13:02' },
      { status: 'success', amount: '$120.00', time: '14:20' },
      { status: 'success', amount: '$45.99', time: '15:10' },
      { status: 'success', amount: '$85.50', time: '16:05' },
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="flex items-center justify-between w-full opacity-40 group-hover:opacity-60 transition-opacity"
      >
        <div className="flex items-center gap-3">
          {item.status === 'failed' ? (
            <XCircle className="w-5 h-5 text-red-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-900 leading-none">
              {item.status === 'failed' ? 'Payment Failed' : 'Payment Successful'}
            </span>
            <span className="text-[10px] text-zinc-400">{item.time}</span>
          </div>
        </div>
        <span className="text-xs font-medium text-zinc-600">{item.amount}</span>
      </motion.div>
    ))}

    {/* Brand band */}
    <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 bg-blue-500/20 backdrop-blur-md border-y border-white/30 z-10 flex items-center justify-center">
      <motion.div 
        animate={{ opacity: [1, 0.8, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-white font-bold text-2xl tracking-tighter"
      >
        opptics
      </motion.div>
    </div>
  </div>
);

// ─── 4. Checkout UI (Bottom Left Visual) ──────────────────────
export const CheckoutPreview = () => (
  <div className="w-full h-full flex items-center justify-center pt-8 pr-12 pb-24">
    <div className="w-full max-w-[200px] bg-white rounded-xl shadow-2xl border border-zinc-100 overflow-hidden">
      <div className="p-4 border-b border-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-bold text-zinc-700">Your cart</span>
        </div>
        <span className="text-[10px] text-zinc-400">2 items</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {[
          { label: 'Black T-shirt', price: '$40.40', size: 'XL', img: 'shirt' },
          { label: 'White Hoodie', price: '$75.00', size: 'M', img: 'hoodie' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center`}>
              <div className="w-6 h-6 bg-zinc-200 rounded-sm" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-zinc-800">{item.label}</span>
                <span className="text-[11px] text-zinc-500">{item.price}</span>
              </div>
              <span className="text-[10px] text-zinc-400">{item.size}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 pt-0">
        <div className="w-full h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-600">
          FREE SHIPPING!
        </div>
      </div>
    </div>
  </div>
);

// ─── 5. Orbiting Logos (Bottom Middle Visual) ─────────────────
export const OrbitLogos = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none pb-20">
    {/* Concentric circles */}
    <div className="absolute w-48 h-48 border border-zinc-100 rounded-full" />
    <div className="absolute w-72 h-72 border border-zinc-50 rounded-full" />
    
    {/* Logos */}
    {[
      { icon: 'paypal', x: 24, y: 24 },
      { icon: 'visa', x: -36, y: -36 },
      { icon: 'stripe', x: 48, y: -24 },
      { icon: 'applepay', x: -48, y: 48 },
    ].map((logo, i) => (
      <motion.div
        key={i}
        animate={{ 
          rotate: 360 
        }}
        transition={{ 
          duration: 20 + i * 5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute w-full h-full flex items-center justify-center"
      >
        <div 
          className="w-10 h-10 bg-white rounded-lg shadow-md border border-zinc-50 flex items-center justify-center p-2"
          style={{ transform: `translate(${logo.x * 2.5}px, ${logo.y * 2.5}px)` }}
        >
          <img src={`https://cdn.simpleicons.org/${logo.icon}`} alt={logo.icon} className="w-full h-full object-contain grayscale opacity-60" />
        </div>
      </motion.div>
    ))}

    {/* Central Logo */}
    <div className="relative z-10 w-16 h-16 rounded-2xl bg-blue-600 shadow-2xl flex items-center justify-center">
      <div className="text-white font-black text-xl italic uppercase">cp</div>
    </div>
  </div>
);

// ─── 6. Setup Stack (Middle Bottom Visual) ───────────────────
export const SetupStack = () => (
  <div className="w-full h-full flex flex-col items-center justify-center pt-8 pb-32 gap-0 overflow-hidden">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1 - i * 0.2, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="w-48 h-10 bg-white border border-zinc-100 rounded-lg shadow-sm -mt-4 relative"
        style={{ zIndex: 10 - i, scale: 1 - i * 0.05 }}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-50" />
        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-20 h-2 rounded-full bg-zinc-50" />
        {i === 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </motion.div>
    ))}
  </div>
);

// ─── 7. CTA Large Icon (Bottom Right Visual) ─────────────────
export const CTAGradient = () => (
  <div className="absolute inset-0 z-0 bg-linear-to-br from-blue-400 via-indigo-400 to-cyan-400 pointer-events-none opacity-90">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent)]" />
    <div className="absolute top-8 left-8 w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
      <Zap className="w-6 h-6 text-white" />
    </div>
  </div>
);
