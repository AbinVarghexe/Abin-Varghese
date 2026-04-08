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

/* ─────────────── Resume dropdown options ─────────────── */
const resumeOptions = [
  {
    label: 'Designer Portfolio',
    description: 'UI/UX & visual design work',
    icon: Palette,
    file: '/resume-designer.pdf',
    filename: 'Abin_Varghese_Designer_Portfolio.pdf',
  },
  {
    label: 'Developer Portfolio',
    description: 'Engineering & code projects',
    icon: Code2,
    file: '/resume/Abin_Varghese_Resume.pdf',
    filename: 'Abin_Varghese_Resume.pdf',
  },
];

/* ─────────────────── Gradient CTA Button ─────────────────────── */
function ResumeButton() {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => Math.min(prev + 1, resumeOptions.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open) {
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          const option = resumeOptions[focusedIndex];
          const link = document.createElement('a');
          link.href = option.file;
          link.download = option.filename;
          link.click();
          setOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Focus items on index change
  useEffect(() => {
    if (open && focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll<HTMLElement>('[role="option"]');
      items[focusedIndex]?.focus();
    }
  }, [focusedIndex, open]);

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <motion.button
        ref={triggerRef}
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) setFocusedIndex(-1);
        }}
        whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(0,32,215,0.35)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="inline-flex appearance-none items-center gap-1.5 rounded-full border-none px-4 py-2.5 font-['Poppins',sans-serif] text-[13px] font-medium text-white cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ background: 'linear-gradient(180deg, #5B74FF 0%, #001BB0 100%)' }}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="resume-listbox"
        aria-label="Download portfolio"
      >
        <Download className="h-5 w-5" strokeWidth={2} />
        Resume
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="inline-flex"
        >
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.4} />
        </motion.span>
      </motion.button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="absolute right-0 mt-4 w-64 rounded-lg overflow-visible shadow-xl z-50"
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(0,0,0,0.08)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Upward-pointing arrow */}
            <span
              className="absolute -top-[7px] right-6 w-3 h-3 rotate-45 z-[51]"
              style={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderLeft: '1px solid rgba(0,0,0,0.08)',
                borderTop: '1px solid rgba(0,0,0,0.08)',
              }}
            />
            <p
              className="px-4 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: '#9ca3af' }}
            >
              Download as
            </p>

            <ul ref={listRef} role="listbox" id="resume-listbox" className="list-none m-0 p-0">
              {resumeOptions.map(({ label, description, icon: Icon, file, filename }, idx) => (
                <li
                  key={label}
                  role="option"
                  tabIndex={-1}
                  aria-selected={focusedIndex === idx}
                  className="outline-none"
                >
                  <motion.a
                    href={file}
                    download={filename}
                    onClick={() => {
                      setOpen(false);
                      setFocusedIndex(-1);
                    }}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer outline-none"
                    style={{
                      color: '#111827',
                      backgroundColor:
                        focusedIndex === idx
                          ? 'rgba(0,32,215,0.05)'
                          : 'transparent',
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                    tabIndex={-1}
                  >
                    {/* icon circle */}
                    <span
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: 'linear-gradient(180deg, #5B74FF 0%, #001BB0 100%)',
                      }}
                    >
                      <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                    </span>

                    <span className="flex flex-col">
                      <span className="text-[14px] font-medium">{label}</span>
                      <span
                        className="text-[11px]"
                        style={{ color: '#6b7280' }}
                      >
                        {description}
                      </span>
                    </span>

                    <Download
                      className="ml-auto h-3.5 w-3.5 flex-shrink-0"
                      style={{ color: '#9ca3af' }}
                      strokeWidth={2}
                    />
                  </motion.a>
                </li>
              ))}
            </ul>

            <div className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
