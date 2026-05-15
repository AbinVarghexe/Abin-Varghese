'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { homeContentDefaults } from '@/lib/home-content-defaults';
import { 
  siteCopyDefaults, 
  type PublicSiteShellContent 
} from '@/types/site-copy';
import { contactSectionDefaults } from '@/types/contact';
import { InteractiveDotPattern } from '@/components/ui/InteractiveDotPattern';


export default function Footer() {
  const [shellContent, setShellContent] = useState<PublicSiteShellContent>({
    siteCopy: siteCopyDefaults,
    socialLinks: homeContentDefaults.socialLinks,
    contactSettings: contactSectionDefaults,
  });

  useEffect(() => {
    let mounted = true;

    async function loadShellContent() {
      try {
        const response = await fetch("/api/site-shell", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as PublicSiteShellContent;
        if (!mounted) {
          return;
        }

        setShellContent({
          siteCopy: data.siteCopy || siteCopyDefaults,
          socialLinks: data.socialLinks || homeContentDefaults.socialLinks,
          contactSettings: data.contactSettings || contactSectionDefaults,
        });
      } catch {
        // Keep defaults if the request fails.
      }
    }

    void loadShellContent();

    return () => {
      mounted = false;
    };
  }, []);

  const navLinks = shellContent.siteCopy.navLinks.map(link => ({
    name: link.name.toUpperCase(),
    href: link.path,
  }));

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, href: shellContent.socialLinks.instagram },
    { icon: <Linkedin className="w-5 h-5" />, href: shellContent.socialLinks.linkedin },
    { icon: <Mail className="w-5 h-5" />, href: `mailto:${shellContent.siteCopy.footerEmail || shellContent.contactSettings.contactEmail}` },
  ];

  return (
    <footer className="relative w-full min-h-screen bg-transparent overflow-hidden px-6 md:px-12 lg:px-20 pt-12 flex flex-col">
      {/* ── Background Layer (Below Bot at z-10) ────────── */}
      <div className="absolute inset-0 bg-white z-5 pointer-events-none" />

      {/* ── Content Layer (Above Bot at z-10) ────────── */}
      <div className="relative z-20 flex-grow flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 border-t border-black/20 pt-8">
          {/* Left Section */}
          <div className="lg:col-span-4 flex flex-col space-y-8 lg:pr-12">
            <div className="flex items-center">
              <Link href="/" aria-label="Abin Varghese Home" className="transition-opacity hover:opacity-80 flex items-center space-x-2">
                <Image
                  src="/Logo.svg"
                  alt="Abin Varghese logo"
                  width={46}
                  height={40}
                  className="h-12 w-auto"
                />
                <span className="font-bold text-3xl tracking-tight uppercase">ABIN VARGHESE</span>
              </Link>
            </div>
            
            <p className="text-black/60 text-sm max-w-sm leading-relaxed">
              {shellContent.siteCopy.footerSupportCopy}
            </p>

            <div className="space-y-4 pt-4">
              <p className="text-black/80 text-sm">{shellContent.siteCopy.footerLocation}</p>
              <p className="text-black/80 text-sm">{shellContent.siteCopy.footerEmail || shellContent.contactSettings.contactEmail}</p>
              <div className="flex space-x-4 pt-2">
                {socialLinks.map((link, idx) => (
                  <Link key={idx} href={link.href} className="text-black/60 hover:text-black transition-colors">
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section - Navigation */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l lg:border-r border-black/20">
            <div className="flex flex-col h-full">
                {navLinks.map((link, idx) => (
                  <Link 
                    key={idx} 
                    href={link.href}
                    className="group relative flex items-center justify-between p-8 md:p-9 border-b border-black/20 overflow-hidden transition-colors duration-300"
                  >
                    {/* Hover background slide effect */}
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    
                    <span className="relative z-10 font-bold text-lg tracking-wider group-hover:text-white transition-colors duration-300">
                      {link.name}
                    </span>
                    <ArrowUpRight className="relative z-10 w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white transition-all duration-300" />
                  </Link>
                ))}
            </div>
          </div>

          {/* Right Section - CTA */}
          <div className="lg:col-span-4 flex flex-col justify-between lg:pl-12 pt-8 lg:pt-0">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium leading-tight">
                {shellContent.siteCopy.footerCtaHeading}
              </h2>
              <p className="text-black/60 text-xl max-w-sm">
                {shellContent.siteCopy.footerCtaCopy}
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end mt-24 text-xs tracking-widest text-black/40 uppercase">
              <p>{shellContent.siteCopy.footerCopyright}</p>
              {shellContent.siteCopy.footerCredit ? (
                <p className="mt-4 md:mt-0">{shellContent.siteCopy.footerCredit}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom Large Text */}
        <div className="relative mt-auto h-[30vh] md:h-[35vh] -mb-6 md:-mb-12 lg:-mb-16 flex items-center justify-center">
          <div 
            className="absolute inset-0 z-0 overflow-hidden" 
            style={{ 
              maskImage: "linear-gradient(to bottom, transparent, black 15%)", 
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%)" 
            }}
          >
            <InteractiveDotPattern 
              cx={2} 
              cy={2} 
              cr={1.5} 
              width={20} 
              height={20} 
              dotColor="rgba(0, 0, 0, 0.08)" 
              activeDotColor="rgba(0, 0, 0, 0.4)" 
              hoverRadius={120} 
            />
          </div>
          <div className="relative flex items-center justify-center">
            <h1 className="flex text-[13vw] font-bold tracking-tighter leading-none select-none font-vina uppercase pointer-events-none">
              {shellContent.siteCopy.footerLargeText.split("").map((char, i) => (
                <span key={i} className="relative inline-block" style={{ minWidth: char === " " ? "0.3em" : "auto" }}>
                  {/* Stroke Layer */}
                  <motion.span
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 4,
                      delay: i * 0.1,
                      repeat: Infinity,
                      times: [0, 0.1, 0.9, 1],
                      ease: "easeInOut"
                    }}
                    style={{ 
                      WebkitTextStroke: "1px rgba(0, 0, 0, 0.3)",
                      color: "transparent"
                    }}
                  >
                    {char}
                  </motion.span>

                  {/* Fill Layer */}
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: [0, 0, 1, 0],
                      y: [10, 0, 0, -10]
                    }}
                    transition={{
                      duration: 4,
                      delay: i * 0.1 + 0.4,
                      repeat: Infinity,
                      times: [0, 0.2, 0.8, 1],
                      ease: "easeInOut"
                    }}
                    className="text-black"
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
    </footer>
  );
}
