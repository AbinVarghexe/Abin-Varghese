'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { 
  RevenueFunnel, 
  RealTimeGraph, 
  PaymentStatusList, 
  CheckoutPreview, 
  OrbitLogos, 
  SetupStack, 
  CTAGradient 
} from './BentoVisuals';

interface BentoCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  visualBg?: string;
  darkText?: boolean;
  fullVisual?: boolean;
  delay?: number;
}

const BentoCard = ({ 
  children, 
  title, 
  description, 
  className = '', 
  visualBg = 'bg-white',
  darkText = false,
  fullVisual = false,
  delay = 0
}: BentoCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`group relative rounded-[32px] overflow-hidden border border-zinc-100 shadow-sm transition-all hover:shadow-xl hover:border-zinc-200 bg-white flex flex-col ${className}`}
  >
    <div className={`relative flex-1 ${visualBg} overflow-hidden`}>
      {children}
    </div>
    
    <div className={`p-8 pt-0 ${fullVisual ? 'absolute bottom-0 left-0 right-0 z-20' : 'relative'}`}>
      <h3 className={`text-xl font-bold tracking-tight mb-2 ${darkText ? 'text-white' : 'text-zinc-900 group-hover:text-blue-600 transition-colors'}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${darkText ? 'text-white/80' : 'text-zinc-500'}`}>
        {description}
      </p>
    </div>
  </motion.div>
);

export default function BentoServices() {
  return (
    <section className="relative w-full pt-48 pb-24 px-4 md:px-8 lg:px-20 bg-transparent overflow-hidden">
      {/* Grid Overlay for the Bento Section */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(115, 115, 115, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100%',
          backgroundPosition: 'center center'
        }}
      />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* --- Header --- */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full border border-zinc-100 bg-white/50 backdrop-blur-sm text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6"
          >
            Capabilities
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight leading-[1.1]"
          >
            Built to Help You <br className="md:hidden" />
            <span className="relative inline-block px-2">
              <Sparkles className="absolute -top-6 -right-6 w-8 h-8 text-blue-500 opacity-40" />
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Grow</span>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-zinc-500 text-lg max-w-xl leading-relaxed"
          >
            We handle the technical complexity so you can focus on scaling your vision. 
            High-performance systems built for the modern web.
          </motion.p>
        </div>

        {/* --- Bento Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Card 1: Revenue Funnel (3 Col, 3 Row) */}
          <BentoCard
            title="Predictable, Recurring Revenue"
            description="Turn one-time visitors into loyal advocates. We help you build steady growth with minimal friction."
            className="md:col-span-3 lg:col-span-4 md:row-span-3"
            delay={0.1}
          >
            <RevenueFunnel />
          </BentoCard>

          {/* Card 2: Real-Time Graph (3 Col, 2 Row) */}
          <BentoCard
            title="Real-Time Performance Insights"
            description="Track every interaction. Understand user behavior through intuitive, real-time data visualization."
            className="md:col-span-3 lg:col-span-4 md:row-span-2"
            delay={0.2}
          >
            <RealTimeGraph />
          </BentoCard>

          {/* Card 3: Failed Payments (3 Col, 3 Row) */}
          <BentoCard
            title="Fewer Failed Interactions"
            description="We optimize every touchpoint automatically, reducing drop-offs and ensuring smooth user journeys."
            className="md:col-span-3 lg:col-span-4 md:row-span-3"
            delay={0.3}
          >
            <PaymentStatusList />
          </BentoCard>

          {/* Card 4: Checkout UI (3 Col, 2 Row) */}
          <BentoCard
            title="Higher Conversion at Checkout"
            description="Our custom-built flows are optimized to convert more leads and increase average order value seamlessly."
            className="md:col-span-3 lg:col-span-4 md:row-span-2"
            delay={0.4}
          >
            <CheckoutPreview />
          </BentoCard>

          {/* Card 5: Orbiting Logos (3 Col, 2 Row) */}
          <BentoCard
            title="Less Busywork, More Growth"
            description="We automate your integrations, sync your data, and manage the backend so you can scale safely."
            className="md:col-span-3 lg:col-span-4 md:row-span-2"
            delay={0.5}
          >
            <OrbitLogos />
          </BentoCard>

          {/* Card 6: Setup Stack (3 Col, 2 Row) */}
          <BentoCard
            title="Fast Setup, No Headaches"
            description="Get launched in days, not months. We handle the entire deployment pipeline with zero downtime."
            className="md:col-span-3 lg:col-span-4 md:row-span-2"
            delay={0.15}
          >
            <SetupStack />
          </BentoCard>

          {/* Card 7: Large CTA Gradient (Full Width Bottom) */}
          <BentoCard
            title="Enhance Profits From Your Ecosystem Via Memberships"
            description="Our platforms are built for ambitious leaders who want to achieve exponential growth and retention."
            className="md:col-span-6 lg:col-span-12 md:row-span-2"
            visualBg="bg-blue-600"
            darkText={true}
            fullVisual={true}
            delay={0.6}
          >
            <CTAGradient />
            <div className="absolute bottom-8 right-8 z-30">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl"
              >
                Book a call now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
