"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle } from "lucide-react";
import Link from "next/link";
import { splitAccentHeading } from "@/lib/accent-heading";
import type { SiteCopyFaqItem } from "@/types/site-copy";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <div 
    className={`bg-white rounded-xl border border-zinc-200 shadow-sm transition-all duration-300 ${isOpen ? 'ring-2 ring-blue-500/10' : 'hover:shadow-md'}`}
  >
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 text-left group"
    >
      <span className="text-base font-semibold text-zinc-800 group-hover:text-blue-600 transition-colors pr-8">
        {question}
      </span>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100'}`}>
        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 pt-0">
            <p className="text-zinc-500 leading-relaxed">
              {answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

type FAQProps = {
  eyebrow: string;
  heading: string;
  intro: string;
  items: SiteCopyFaqItem[];
  ctaText: string;
  ctaLabel: string;
};

export default function FAQ({
  eyebrow,
  heading,
  intro,
  items,
  ctaText,
  ctaLabel,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headingParts = splitAccentHeading(heading);

  return (
    <section className="relative w-full pt-10 pb-20 px-4 md:px-8 lg:px-20 bg-transparent overflow-hidden">
      {/* ── Vertical Grid Overlay ─────────────────────────────── */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(115, 115, 115, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100%',
          backgroundPosition: 'center center'
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">
        
        {/* --- Header: Center-Aligned and Consistent --- */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full border border-zinc-100 bg-white/50 backdrop-blur-sm text-sm font-bold text-blue-500 uppercase tracking-widest mb-6"
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
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-zinc-500 text-lg max-w-xl leading-relaxed"
          >
            {intro}
          </motion.p>
        </div>

        {/* --- FAQ List: Single Column Alignment --- */}
        <div className="flex flex-col gap-4 w-full max-w-[800px] mb-12">
          {items.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <FAQItem 
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === idx}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            </motion.div>
          ))}

          {/* ── Special CTA Item ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: items.length * 0.05 }}
            className="w-full"
          >
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 h-full">
              <span className="text-base font-semibold text-zinc-600 text-center sm:text-left">
                {ctaText}
              </span>
              <Link
                href="/contact"
                className="group inline-flex items-center no-underline transition-all duration-300"
                style={{
                  gap: '12px',
                  background: 'linear-gradient(208.44deg, #444 5%, #111 84%)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  padding: '8px 8px 8px 24px',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'box-shadow 300ms ease, transform 200ms ease',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                  el.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = 'none';
                  el.style.transform = 'scale(1)';
                }}
              >
                {ctaLabel}
                <span 
                  className="flex items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110"
                  style={{
                    width: '32px',
                    height: '32px'
                  }}
                >
                  <MessageCircle className="w-4 h-4 text-black" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
