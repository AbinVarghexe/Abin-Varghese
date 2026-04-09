// Navbar component - Desktop-only floating navigation
// Mobile uses MobileNav (top) and MobileDock (bottom) components instead
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download, Palette, Code2 } from 'lucide-react';

/* ─────────────────── NavLink ─────────────────────── */
interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

function NavLink({ href, label, isActive }: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li>
      <Link
        href={href}
        className={`relative text-[18px] transition-all duration-200 ${
          isActive ? 'font-semibold' : 'font-normal'
        }`}
        style={{ color: '#111827' }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          e.currentTarget.style.color = '#374151';
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          e.currentTarget.style.color = '#111827';
        }}
      >
        <motion.span
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="inline-block"
        >
          {label}
        </motion.span>

        {/* hover dot */}
        {!isActive && (
          <motion.span
            className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#111827' }}
            initial={{ scale: 0, x: '-50%', opacity: 0 }}
            animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          />
        )}
      </Link>
    </li>
  );
}

/* ─────────────────── Shared Resume Button ─────────────────────── */
import { ResumeDropdown } from '@/components/common/ResumeDropdown';

function ResumeButton() {
  return (
    <ResumeDropdown align="right">
      <motion.div
        whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(0,32,215,0.35)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="inline-flex appearance-none items-center gap-1.5 rounded-full border-none px-4 py-2.5 font-['Poppins',sans-serif] text-[13px] font-medium text-white cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ background: 'linear-gradient(180deg, #5B74FF 0%, #001BB0 100%)' }}
      >
        <Download className="h-5 w-5" strokeWidth={2} />
        Resume
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.4} />
      </motion.div>
    </ResumeDropdown>
  );
}

/* ═══════════════════════ Navbar ═══════════════════════ */
export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[110] flex justify-center pointer-events-none">
        <motion.nav
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 60,
            scale: 0.95,
            width: '75%',
            height: '80px',
            borderRadius: '60px',
            borderWidth: '1px',
            borderColor: 'rgba(0,0,0,0.1)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 30, opacity: { duration: 0.5 } }}
          className="w-full pointer-events-auto shadow-lg"
          style={{
            borderStyle: 'solid',
            backgroundColor: 'rgba(236,236,236,0.7)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            color: '#111827',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full">
              {/* Logo */}
              <Link
                href="/"
                className="relative z-10 transition-opacity hover:opacity-80"
                aria-label="Abin Varghese Home"
              >
                <Image
                  src="/Logo.svg"
                  alt="Abin Varghese logo"
                  width={46}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>

              {/* Centered nav links */}
              <ul className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    isActive={pathname === link.href}
                  />
                ))}
              </ul>

              {/* Gradient resume button */}
              <ResumeButton />
            </div>
          </div>
        </motion.nav>
      </div>
    </>
  );
}
