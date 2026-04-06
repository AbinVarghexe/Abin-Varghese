"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle, HelpCircle } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <div 
    className={`bg-white rounded-2xl border border-neutral-100 shadow-sm transition-all duration-300 ${isOpen ? 'ring-2 ring-[#3B82F6]/10' : 'hover:shadow-md'}`}
  >
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 text-left group"
    >
      <span className="text-base font-semibold text-neutral-800 group-hover:text-[#3B82F6] transition-colors pr-8">
        {question}
      </span>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#3B82F6] text-white rotate-180' : 'bg-neutral-50 text-neutral-400 group-hover:bg-neutral-100'}`}>
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
            <p className="text-neutral-500 leading-relaxed">
              {answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { question: "How do I sign up?", answer: "Getting started is simple. You can reach out through the contact form or book a direct discovery call through my calendar link." },
    { question: "How much does it cost?", answer: "Pricing is value-based and depends on the scope of the project. I offer competitive rates for single projects as well as specialized retainers for ongoing creative support." },
    { question: "What niches are supported?", answer: "I specialize in SaaS, E-commerce, and FinTech, but I've worked across diverse industries from Healthcare to Creative Professional services." },
    { question: "How does it work with my business?", answer: "I act as an extension of your team. We start with a strategy workshop, followed by iterative design sprints and regular status updates." },
    { question: "What if I don't like the designs?", answer: "We follow a modular, feedback-driven process with defined revision cycles. Your satisfaction is guaranteed through clear communication at every stage." },
    { question: "Can I see examples of work?", answer: "Absolutely! Feel free to browse the case studies on this portfolio or request a private walkthrough of my latest high-fidelity projects." },
    { question: "What makes this different?", answer: "A unique blend of performance marketing, high-fidelity design, and technical implementation that drives actual business results, not just 'pretty' visuals." },
    { question: "How long does a website take?", answer: "A typical high-quality website project takes between 4 to 8 weeks depending on complexity, features, and content readiness." },
    { question: "is it compliant and secure?", answer: "Yes, I build with the latest security standards, WCAG accessibility compliance, and performance optimization as standard practice." },
    { question: "What if my competitor is using you?", answer: "I maintain strict confidentiality and typically offer industry-exclusive slots to ensure your brand always has a distinct competitive edge." },
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

      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">
        
        {/* ── Header ───────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-20 space-y-6"
        >
          <div className="px-5 py-1.5 rounded-full bg-white shadow-sm border border-neutral-100">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
              FAQs
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight flex items-center justify-center gap-4">
            Curated 
            <span className="text-[#3B82F6] flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              Questions
            </span>
          </h2>

          <p className="text-lg text-neutral-500 max-w-xl leading-relaxed">
            Book a call or reach out anytime, we&apos;re here to help.
          </p>
        </motion.div>

        {/* ── FAQ Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-12">
          {faqs.map((faq, idx) => (
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
            transition={{ duration: 0.4, delay: faqs.length * 0.05 }}
            className="lg:col-span-1"
          >
            <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 h-full">
              <span className="text-base font-semibold text-neutral-600 text-center sm:text-left">
                Couldn&apos;t find an answer you&apos;re looking for?
              </span>
              <button className="flex items-center gap-3 px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-black/5 hover:scale-105 active:scale-95 transition-all group">
                Contact Us
                <MessageCircle className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
