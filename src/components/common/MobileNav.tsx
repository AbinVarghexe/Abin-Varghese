'use client';


import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ThemeToggle } from '../common/Themetoggle';

interface MobileNavProps {
  className?: string;
}

export const MobileNav = ({ className = '' }: MobileNavProps) => {
  const [isLightMode, setIsLightMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // Check theme state
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

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current || !logoRef.current) return;

    // Set initial states
    gsap.set(containerRef.current, {
      y: -100,
      opacity: 0,
    });

    gsap.set(logoRef.current, {
      scale: 0,
    });

    // Animate container
    gsap.to(containerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0.2,
    });

    // Animate logo
    gsap.to(logoRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0.4,
    });
  }, []);

  // Update border and background colors when theme changes
  useEffect(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      borderColor: isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
      backgroundColor: isLightMode ? 'rgba(236, 236, 236, 0.7)' : 'rgba(10, 10, 10, 0.7)',
      duration: 0.3,
      ease: 'power2.inOut',
    });
  }, [isLightMode]);

  return (
    <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div
        ref={containerRef}
        className="flex items-center justify-between gap-6 px-6! py-3! rounded-full shadow-lg min-w-[350px] border"
        style={{
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          ref={logoRef}
          className="flex items-center"
          aria-label="Abin Varghese Home"
        >
          <Image
            src="/Logo.svg"
            alt="Abin Varghese logo"
            width={42}
            height={37}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Theme Toggle Button */}
        <ThemeToggle className="p-2!" />
      </div>
    </div>
  );
};
