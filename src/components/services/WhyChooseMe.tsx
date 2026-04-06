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
  Globe,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

interface ComparisonRowProps {
  icon: React.ReactNode;
  label: string;
  others: boolean;
  me: boolean;
}

const ComparisonRow = ({ icon, label, others, me }: ComparisonRowProps) => (
  <div className="grid grid-cols-[2fr_1fr_1.2fr] items-center py-4 border-b border-zinc-200/50 hover:bg-zinc-50/50 transition-colors px-4">
    <div className="flex items-center gap-3">
      <div className="text-zinc-500">{icon}</div>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
    </div>
    <div className="flex justify-center">
      {others ? (
        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center">
          <X className="w-4 h-4 text-zinc-500" />
        </div>
      )}
    </div>
    <div className="flex justify-center">
      {me ? (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Check className="w-4 h-4 text-blue-500" />
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
    <section className="relative w-full py-10 px-4 md:px-8 lg:px-20 bg-transparent overflow-hidden">
      {/* ── Vertical Grid Overlay ─────────────────────────────── */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(115, 115, 115, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100%',
          backgroundPosition: 'center center'
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* --- Header: Centered Pill & Heading --- */}
        <div className="flex flex-col items-center text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full border border-zinc-100 bg-white/50 backdrop-blur-sm text-sm font-bold text-blue-500 uppercase tracking-widest mb-6"
          >
            Me vs Others
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold pb-2 text-black tracking-tight"
          >
            Why I Beat <br className="md:hidden" />
            <span className="text-blue-600 font-serif italic font-medium">Every Competitor</span> 
          </motion.h2>
        </div>

        {/* --- Content Grid: Split Description & Table --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Description & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start gap-8 px-4"
          >
            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl">
              I deliver premium quality results with a focus on high-performance and seamless user experience. 
              Compare my approach with standard industry practices.
            </p>

            <Link
              href="/"
              className="group inline-flex items-center no-underline transition-all duration-300"
              style={{
                gap: '15.945px',
                background: 'linear-gradient(208.44deg, #444 5%, #111 84%)',
                border: '2.657px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                padding: '9.744px 9.744px 9.744px 31.004px',
                fontFamily: 'inherit',
                fontWeight: 500,
                fontSize: '15px',
                color: '#fff',
                textDecoration: 'none',
                transition: 'box-shadow 300ms ease, transform 200ms ease',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 14px 36px rgba(0,0,0,0.22)';
                el.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = 'none';
                el.style.transform = 'scale(1)';
              }}
            >
              <span className="min-w-[80px] text-center">Get Started</span>
              <span
                className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
                style={{ width: '46.949px', height: '46.949px' }}
              >
                <ArrowUpRight className="text-[#0b0b0c] w-[18px] h-[18px]" strokeWidth={2.2} />
              </span>
            </Link>
          </motion.div>

          {/* Right Side: Comparison Table */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="relative px-4"
          >
            {/* Main Card */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 border border-zinc-200 overflow-hidden">
              
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1fr_1.2fr] border-b border-zinc-100 pb-4 pt-8 px-4">
                <div />
                <div className="text-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Others
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                    Me
                  </span>
                </div>
              </div>

              {/* Rows Container */}
              <div className="relative">
                {/* Highlight Column Overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-[31%] bg-linear-to-b from-blue-500 to-indigo-600 z-0" />
                
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
              <div className="flex justify-end p-8 bg-zinc-50/50">
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">
                          Premium Quality Guaranteed
                      </span>
                  </div>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
