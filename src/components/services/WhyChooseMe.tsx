"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Sparkles, 
  LayoutGrid, 
  CreditCard, 
  RefreshCw, 
  ShieldCheck, 
  Globe 
} from "lucide-react";

interface ComparisonRowProps {
  icon: React.ReactNode;
  label: string;
  others: boolean;
  me: boolean;
}

const ComparisonRow = ({ icon, label, others, me }: ComparisonRowProps) => (
  <div className="grid grid-cols-[2fr_1fr_1.2fr] items-center py-4 border-b border-neutral-200/50 hover:bg-neutral-50/50 transition-colors px-4">
    <div className="flex items-center gap-3">
      <div className="text-neutral-500">{icon}</div>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
    </div>
    <div className="flex justify-center">
      {others ? (
        <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center">
          <X className="w-4 h-4 text-neutral-500" />
        </div>
      )}
    </div>
    <div className="flex justify-center">
      {me ? (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Check className="w-4 h-4 text-[#3B82F6]" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  </div>
);

export default function WhyChooseMe() {
  const features = [
    { icon: <LayoutGrid className="w-5 h-5" />, label: "Customizable Design", others: true, me: true },
    { icon: <CreditCard className="w-5 h-5" />, label: "Seamless Integration", others: false, me: true },
    { icon: <RefreshCw className="w-5 h-5" />, label: "Advanced Automation", others: true, me: true },
    { icon: <ShieldCheck className="w-5 h-5" />, label: "Premium Security", others: true, me: true },
    { icon: <Globe className="w-5 h-5" />, label: "Global Scalability", others: true, me: true },
  ];

  return (
    <section className="relative w-full py-32 px-4 md:px-8 lg:px-20 bg-transparent overflow-hidden">
      {/* ── Vertical Grid Overlay ─────────────────────────────── */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(115, 115, 115, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100%',
          backgroundPosition: 'center center'
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* ── Left Content: Typography ─────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start gap-8"
        >
          <div className="px-4 py-1.5 rounded-full bg-white shadow-sm border border-neutral-100">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Me vs Others
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
            Why I Beat <br />
            <span className="bg-linear-to-r from-[#3B82F6] to-[#2DD4BF] bg-clip-text text-transparent flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-[#3B82F6] fill-[#3B82F6]/20" />
              Every Competitor
            </span>
          </h2>

          <p className="text-lg text-neutral-500 leading-relaxed max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-2xl font-semibold shadow-lg shadow-black/10 transition-shadow hover:shadow-xl group"
          >
            Get Started
            <Sparkles className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
          </motion.button>
        </motion.div>

        {/* ── Right Content: Comparison Table ───────────────────── */}
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
           className="relative"
        >
          {/* Main Card */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 border border-neutral-100 overflow-hidden">
            
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1.2fr] border-b border-neutral-100 pb-4 pt-8 px-4">
              <div />
              <div className="text-center">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Others
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-widest">
                  Me
                </span>
              </div>
            </div>

            {/* Rows Container */}
            <div className="relative">
              {/* Highlight Column Overlay */}
              <div className="absolute right-0 top-0 bottom-0 w-[31%] bg-linear-to-b from-[#3B82F6] to-[#6366F1] z-0" />
              
              <div className="relative z-10">
                {features.map((feature, idx) => (
                  <ComparisonRow 
                    key={idx}
                    icon={feature.icon}
                    label={feature.label}
                    others={feature.others}
                    me={feature.me}
                  />
                ))}
              </div>
            </div>

            {/* Subtle Brand Footer inside Table */}
            <div className="flex justify-end p-8 bg-neutral-50/50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">
                        Premium Quality Guaranteed
                    </span>
                </div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#3B82F6]/5 blur-3xl rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#2DD4BF]/5 blur-3xl rounded-full" />
        </motion.div>

      </div>
    </section>
  );
}
