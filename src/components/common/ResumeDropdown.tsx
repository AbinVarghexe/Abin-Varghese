'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronDown } from 'lucide-react';
import { resumeOptions } from '@/lib/resume-data';

interface ResumeDropdownProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export const ResumeDropdown: React.FC<ResumeDropdownProps> = ({ 
  children, 
  align = 'right',
  className = "" 
}) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
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
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      setFocusedIndex(0);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, resumeOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          const option = resumeOptions[focusedIndex];
          const link = document.createElement('a');
          link.href = option.file;
          link.download = option.filename;
          link.click();
          setOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setFocusedIndex(-1);
        break;
      case 'Tab':
        setOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Alignment classes
  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  const arrowClasses = {
    left: 'left-6',
    right: 'right-6',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div 
      ref={ref} 
      className={`relative inline-block ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* The trigger component */}
      <div 
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {children}
        {/* We assume the trigger might want a Chevron, but we can also just let the child handle its own Chevron if it wants */}
      </div>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`absolute mt-4 w-56 md:w-64 rounded-lg overflow-visible shadow-xl z-50 ${alignClasses[align]}`}
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(0,0,0,0.08)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Upward-pointing arrow */}
            <span
              className={`absolute -top-[7px] w-3 h-3 rotate-45 z-51 ${arrowClasses[align]}`}
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

            <ul ref={listRef} role="listbox" className="list-none m-0 p-0">
              {resumeOptions.map(({ label, description, icon: Icon, file, filename }, idx) => (
                <li
                  key={label}
                  role="option"
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
                    className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 cursor-pointer outline-none"
                    style={{
                      color: '#111827',
                      backgroundColor:
                        focusedIndex === idx
                          ? 'rgba(0,32,215,0.05)'
                          : 'transparent',
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                  >
                    {/* icon circle */}
                    <span
                      className="flex h-8 md:h-9 w-8 md:w-9 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: 'linear-gradient(180deg, #5B74FF 0%, #001BB0 100%)',
                      }}
                    >
                      <Icon className="h-3.5 md:h-4 w-3.5 md:w-4 text-white" strokeWidth={2} />
                    </span>

                    <span className="flex flex-col">
                      <span className="text-[13px] md:text-[14px] font-medium">{label}</span>
                      <span
                        className="text-[10px] md:text-[11px]"
                        style={{ color: '#6b7280' }}
                      >
                        {description}
                      </span>
                    </span>

                    <Download
                      className="ml-auto h-3.5 w-3.5 shrink-0"
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
};
