'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <footer className="bg-black text-white pt-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 border-t border-white/20 pt-12">
        {/* Left Section */}
        <div className="lg:col-span-4 flex flex-col space-y-8 lg:pr-12">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center font-bold text-2xl">
              A
            </div>
            <div>
              <p className="font-bold text-sm tracking-widest uppercase">UNIQUE DIGITAL EXPERIENCES</p>
              <p className="font-bold text-sm tracking-widest uppercase text-white/50">// IMMERSIVE CRAFT</p>
            </div>
          </div>
          
          <p className="text-white/60 text-sm max-w-sm leading-relaxed">
            Founded by Abin Varghese, we unite decades of technical expertise as visionary developers and practical creators, redefining possibilities in the digital environment.
          </p>

          <div className="space-y-4 pt-4">
            <p className="text-white/80 text-sm">88 Digital Way, Kochi, India</p>
            <p className="text-white/80 text-sm">hello@abinvarghese.art</p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((link, idx) => (
                <Link key={idx} href={link.href} className="text-white/60 hover:text-white transition-colors">
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section - Navigation */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l lg:border-r border-white/20">
          <div className="flex flex-col h-full">
            {navLinks.map((link, idx) => (
              <Link 
                key={idx} 
                href={link.href}
                className="group flex items-center justify-between p-6 border-b border-white/20 hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-lg tracking-wider">{link.name}</span>
                <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
            <p className="text-white/60 text-lg max-w-sm">
              Share your ideas with us, and we'll begin turning your vision into reality today.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mt-20 text-xs tracking-widest text-white/40 uppercase">
            <p>ABIN VARGHESE ART LTD 2026 ©</p>
            <p className="mt-4 md:mt-0">DESIGN BY ORCHIDS</p>
          </div>
        </div>
      </div>

      {/* Bottom Large Text */}
      <div className="mt-20 -mb-4 md:-mb-8 lg:-mb-12">
        <h1 className="text-[12vw] font-bold tracking-tighter leading-none whitespace-nowrap overflow-hidden select-none font-vina uppercase">
          Abin Varghese
        </h1>
      </div>
    </footer>
  );
}
