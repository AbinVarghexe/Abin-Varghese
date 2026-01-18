'use client';

import { memo, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SquaresBackground from './ui/SquaresBackground';
import RotatingText from './ui/RotatingText';
import ScrollingBanner from './ui/ScrollingBanner';
import TextPressure from './ui/TextPressure';

const Herosection = () => {
  // Add state to determine light/dark mode preference on client
  const [isLightMode, setIsLightMode] = useState<boolean>(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(!document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-16 pb-24 md:pb-16 relative min-h-screen overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-main)' }}>
      {/* Squares Background - contained within hero section */}
      <div className="absolute inset-0">
        <SquaresBackground 
          squareSize={50}
          strokeWidth={1}
          maxOpacity={0.15}
          className="dark:opacity-50"
        />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 max-w-4xl">
        <div className="flex flex-col items-center text-center">
          {/* Main Heading - ABIN with TextPressure Effect */}
          <div className="relative mb-1">
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none"
              style={{ 
                fontFamily: 'Vina, sans-serif',
                color: isLightMode ? '#111827' : '#ffffff'
              }}
            >
              <TextPressure 
                text="ABIN" 
                maxScale={1.4}
                minScale={1}
                radius={120}
                strength={0.8}
              />
            </h1>
          </div>

          {/* Main Heading - VARGHESE with TextPressure Effect */}
          <div className="relative mb-12">
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl xl:text-8xl leading-none"
              style={{ 
                fontFamily: 'Vina, sans-serif',
                color: isLightMode ? '#111827' : '#ffffff'
              }}
            >
              <TextPressure 
                text="VARGHESE" 
                maxScale={1.4}
                minScale={1}
                radius={120}
                strength={0.8}
              />
            </h1>
          </div>

          {/* Subtitle with Rotating Text */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap text-xl md:text-2xl">
            {/* fixed Tailwind typo and use isLightMode defined above */}
            <span className="font-medium" style={{ color: isLightMode ? '#111827' : '#ffffff' }}>I'm a</span>
            <motion.span 
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#0020d7] text-white overflow-hidden"
              layout
              transition={{ 
                layout: { 
                  type: 'spring', 
                  damping: 15, 
                  stiffness: 400,
                  duration: 0.3
                } 
              }}
            >
              <RotatingText
                texts={['Developer', 'Designer', 'Creator', 'Builder']}
                rotationInterval={2500}
                splitBy="characters"
                staggerDuration={0.03}
                staggerFrom="first"
                auto={true}
                loop={true}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-120%', opacity: 0 }}
                animatePresenceMode="wait"
                mainClassName="justify-center"
              />
            </motion.span>
          </div>

          {/* Descriptive Paragraph */}
          <p 
            className="text-base md:text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ color: isLightMode ? '#111827' : '#ffffff' }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Contact me Button */}
            <Link
              href="/contact"
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-b from-[#484848] to-[#333333] text-white hover:opacity-90 transition-all"
            >
              <span>Contact me</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>

            {/* Resume Button */}
            <Link
              href="/resume"
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-[#0020d7] text-white hover:opacity-90 transition-all"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
};

export default memo(Herosection);