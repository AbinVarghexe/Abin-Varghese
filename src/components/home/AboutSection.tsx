'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitAccentHeading } from '@/lib/accent-heading';

gsap.registerPlugin(ScrollTrigger);

/* ─── Hover state → transform config ─────────────────────────── */
type CardId = 'left' | 'right' | 'center';
type State  = 'default' | 'hover';

const CONFIG: Record<State, Record<CardId, object>> = {
  default: {
    left:   { rotation: -13, scale: 0.85, x: -80, y: 14, opacity: 0.82, zIndex: 1 },
    right:  { rotation:  13, scale: 0.85, x:  80, y: 14, opacity: 0.82, zIndex: 2 },
    center: { rotation:   0, scale: 1.00, x:   0, y:  0, opacity: 1.00, zIndex: 3 },
  },
  hover: {
    left:   { rotation: -16, scale: 0.85, x: -95, y: 18, opacity: 0.75, zIndex: 1 },
    right:  { rotation:  16, scale: 0.85, x:  95, y: 18, opacity: 0.75, zIndex: 2 },
    center: { rotation:   0, scale: 1.05, x:   0, y: -8, opacity: 1.00, zIndex: 3 },
  },
};

const EASE = 'power2.out';
const DUR  = 0.38;

import AboutImageStack from './AboutImageStack';

type AboutSectionProps = {
  heading: string;
  body: string;
  ctaLabel: string;
};

export default function AboutSection({ heading, body, ctaLabel }: AboutSectionProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(text,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: text,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const headingParts = splitAccentHeading(heading);

  return (
    <section
      id="about"
      className="relative z-20 w-full px-10 md:px-16 lg:px-32 py-16 md:py-28 overflow-visible"
    >
      <div aria-hidden className="pointer-events-none select-none absolute" style={{
        top: '-40px', right: '-20px', fontSize: '260px', fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        background: 'linear-gradient(208.44deg,#5b74ff 5%,#001bb0 84%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1, filter: 'blur(4px)', opacity: 0.16, userSelect: 'none', zIndex: 0,
      }}>✧</div>

      <div className="relative z-20 max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Right column: Image Stack (Swipeable on Mobile, Interactive on Desktop) */}
        <AboutImageStack />

        {/* Left column: text */}
        <div ref={textRef} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 w-full lg:w-[55%] pointer-events-auto order-2 lg:order-1">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
            {headingParts.before}
            {headingParts.accent ? (
              <span className="text-blue-600 font-serif italic font-medium">{headingParts.accent}</span>
            ) : null}
            {headingParts.after}
          </h2>

          <p 
            className="text-black/70 text-base md:text-lg leading-relaxed max-w-[560px] text-justify md:text-left [text-align-last:center] md:[text-align-last:auto]"
          >
            {body}
          </p>

          <Link
            href="/about"
            className="lg:self-start group inline-flex items-center no-underline pointer-events-auto shadow-xl transition-transform duration-200 hover:scale-[1.03]"
            style={{
              gap: '12px',
              background: 'var(--gradient-gray)',
              border: '2.657px solid var(--color-border-light)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 8px 8px 24px',
              fontFamily: 'var(--font-sans)', fontWeight: 500,
              fontSize: '14px', color: '#fff', textDecoration: 'none',
            }}
          >
            <span style={{ minWidth: '80px', textAlign: 'center' }}>{ctaLabel}</span>
            <span
              className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
              style={{ width: '38px', height: '38px' }}
            >
              <ArrowUpRight className="text-[#0b0b0c]" style={{ width: '18px', height: '18px' }} strokeWidth={2.2} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
