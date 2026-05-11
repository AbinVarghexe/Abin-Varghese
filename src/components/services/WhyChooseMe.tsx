"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  LayoutGrid, 
  CreditCard, 
  RefreshCw, 
  ShieldCheck, 
  Globe,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { splitAccentHeading } from "@/lib/accent-heading";
import type { SiteCopyComparisonFeature } from "@/types/site-copy";

interface ComparisonRowProps {
  icon: React.ReactNode;
  label: string;
  others: boolean;
  me: boolean;
}

const ComparisonRow = ({ icon, label, others, me }: ComparisonRowProps) => (
  <div className="grid grid-cols-[1.5fr_1fr_1fr] md:grid-cols-[2fr_1fr_1.2fr] items-center py-3 md:py-4 border-b border-zinc-200/50 hover:bg-zinc-50/50 transition-colors px-2 md:px-4">
    <div className="flex items-center gap-2 md:gap-3">
      <div className="text-zinc-500 scale-90 md:scale-100">{icon}</div>
      <span className="text-xs md:text-sm font-medium text-zinc-700 leading-snug">{label}</span>
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

const featureIcons = [
  <LayoutGrid className="w-5 h-5" key="layout" />,
  <CreditCard className="w-5 h-5" key="credit" />,
  <RefreshCw className="w-5 h-5" key="refresh" />,
  <ShieldCheck className="w-5 h-5" key="shield" />,
  <Globe className="w-5 h-5" key="globe" />,
];

type WhyChooseMeProps = {
  eyebrow: string;
  heading: string;
  intro: string;
  ctaLabel: string;
  ctaUrl: string;
  features: SiteCopyComparisonFeature[];
};

export default function WhyChooseMe({
  eyebrow,
  heading,
  intro,
  ctaLabel,
  ctaUrl,
  features,
}: WhyChooseMeProps) {
  const headingParts = splitAccentHeading(heading);
  const featureRows = features.map((feature, index) => ({
    ...feature,
    icon: featureIcons[index % featureIcons.length],
  }));

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
        <div className="flex flex-col items-start lg:items-center text-left lg:text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="self-center px-4 py-1.5 rounded-full border border-zinc-100 bg-white/50 backdrop-blur-sm text-sm font-semibold text-blue-500 uppercase tracking-widest mb-6"
          >
            {eyebrow}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold pb-2 text-black tracking-tight"
          >
            {headingParts.before}
            {headingParts.accent ? (
              <span className="text-blue-600 font-serif italic font-medium">{headingParts.accent}</span>
            ) : null}
            {headingParts.after}
          </motion.h2>
        </div>

        {/* --- Content Grid: Split Description & Table --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Left Side: Description & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start gap-8 px-4"
          >
            <div className="flex flex-col gap-6">
              <p className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-xl text-left">
                {intro}
              </p>
              
              <p className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-xl text-left">
                We combine performance-driven thinking with scalable architecture and clean code to create future-proof solutions. Our agile model ensures every project is optimized for growth, accessibility, and an intuitive user experience.
              </p>
            </div>

            <Link
              href={ctaUrl}
              className="group inline-flex items-center no-underline transition-all duration-300 gap-[10px] md:gap-[15.945px] pl-5 md:pl-[31px] pr-1.5 md:pr-[10px] py-1.5 md:py-[10px] text-[13px] md:text-[15px]"
              style={{
                background: 'linear-gradient(208.44deg, #444 5%, #111 84%)',
                border: '1.5px md:border-[2.657px] solid rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                fontFamily: 'inherit',
                fontWeight: 500,
                color: '#fff',
                textDecoration: 'none',
                transition: 'box-shadow 300ms ease, transform 200ms ease',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 10px 25px rgba(0,0,0,0.18)';
                el.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = 'none';
                el.style.transform = 'scale(1)';
              }}
            >
              <span className="min-w-[70px] md:min-w-[80px] text-center">{ctaLabel}</span>
              <span
                className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45 w-8 h-8 md:w-[46.949px] md:h-[46.949px]"
              >
                <ArrowUpRight className="text-[#0b0b0c] w-[16px] h-[16px] md:w-[18px] md:h-[18px]" strokeWidth={2.2} />
              </span>
            </Link>
          </motion.div>

          {/* Right Side: Comparison Table */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="relative px-0 md:px-4"
          >
            {/* Main Card */}
            <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-black/5 border border-zinc-200 overflow-hidden">
              
              {/* Table Header */}
              <div className="grid grid-cols-[1.5fr_1fr_1fr] md:grid-cols-[2fr_1fr_1.2fr] border-b border-zinc-100 pb-3 pt-6 md:pb-4 md:pt-8 px-2 md:px-4">
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
                  {featureRows.map((feature, idx) => (
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
              <div className="flex justify-center md:justify-end p-5 md:p-8 bg-zinc-50/50">
                  <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500" />
                      <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">
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
