'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'WHAT WE DO', href: '/services' },
    { name: 'ABOUT ME', href: '/about' },
    { name: 'GET IN TOUCH', href: '/contact' },
  ];

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, href: '#' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#' },
    { icon: <Mail className="w-5 h-5" />, href: 'mailto:hello@abinvarghese.art' },
  ];

  return (
    <footer className="relative w-full bg-transparent overflow-hidden px-6 md:px-12 lg:px-20 pt-20">
      {/* ── Background Layer (Below Bot at z-10) ────────── */}
      <div className="absolute inset-0 bg-white z-5 pointer-events-none" />

      {/* ── Content Layer (Above Bot at z-10) ────────── */}
      <div className="relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 border-t border-black/20 pt-12">
          {/* Left Section */}
          <div className="lg:col-span-4 flex flex-col space-y-8 lg:pr-12">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center font-bold text-2xl">
                A
              </div>
              <div>
                <p className="font-bold text-sm tracking-widest uppercase">UNIQUE DIGITAL EXPERIENCES</p>
                <p className="font-bold text-sm tracking-widest uppercase text-black/50">// IMMERSIVE CRAFT</p>
              </div>
            </div>
            
            <p className="text-black/60 text-sm max-w-sm leading-relaxed">
              Founded by Abin Varghese, we unite decades of technical expertise as visionary developers and practical creators, redefining possibilities in the digital environment.
            </p>

            <div className="space-y-4 pt-4">
              <p className="text-black/80 text-sm">88 Digital Way, Kochi, India</p>
              <p className="text-black/80 text-sm">hello@abinvarghese.art</p>
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
                    className="group relative flex items-center justify-between p-6 border-b border-black/20 overflow-hidden transition-colors duration-300"
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
              <h2 className="text-4xl md:text-5xl font-medium leading-tight">
                Ready to kick start a discovery session?
              </h2>
              <p className="text-black/60 text-lg max-w-sm">
                Share your ideas with us, and we'll begin turning your vision into reality today.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end mt-20 text-xs tracking-widest text-black/40 uppercase">
              <p>ABIN VARGHESE ART LTD 2026 ©</p>
              <p className="mt-4 md:mt-0">DESIGN BY ORCHIDS</p>
            </div>
          </div>
        </div>

        {/* Bottom Large Text */}
        <div className="mt-20 -mb-4 md:-mb-8 lg:-mb-12">
          <h1 className="text-[12vw] font-bold tracking-tighter leading-none whitespace-nowrap overflow-hidden select-none font-vina uppercase text-black transition-colors duration-300">
            Abin Varghese
          </h1>
        </div>
      </div>
    </footer>
  );
}
