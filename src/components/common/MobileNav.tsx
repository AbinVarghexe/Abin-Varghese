'use client';


import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

interface MobileNavProps {
  className?: string;
}

export const MobileNav = ({ className = '' }: MobileNavProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

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

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      borderColor: 'rgba(0, 0, 0, 0.1)',
      backgroundColor: 'rgba(236, 236, 236, 0.7)',
      duration: 0.3,
      ease: 'power2.inOut',
    });
  }, []);

  return (
    <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-[110] ${className}`}>
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
      </div>
    </div>
  );
};
