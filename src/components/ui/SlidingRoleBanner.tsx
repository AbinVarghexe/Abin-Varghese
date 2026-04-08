'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * SlidingRoleBanner — diagonal infinite marquee
 *
 * Architecture: scroll-delta accumulator + rAF tick
 * ─────────────────────────────────────────────────
 * DOM: exactly 2 copies of all items → unit = scrollWidth / 2
 *
 * On each scroll event we add the page-scroll delta (scaled by `speed`)
 * to an accumulator.  On every animation frame we lerp currentX → accumulator
 * and then modulo-wrap so x stays inside [−unit, 0].  When x exits that range
 * the DOM seam is invisible because both copies are identical.
 *
 * Why NOT GSAP tween/modifiers:
 *  - With scrub the total tween distance must be huge (150×) → floats break
 *  - Scrub lag + modulo = apparent teleport every loop → stutter
 *  - rAF + quickSetter is lighter and completely deterministic
 */

const ROLES = ['Web Developer', 'Graphic Designer', 'Video Editor', 'VFX Artist'];

interface SlidingRoleBannerProps {
  /** Which way the text flows when scrolling down */
  direction?: 'left' | 'right';
  /** Strip tilt in degrees (positive = clockwise) */
  rotation?: number;
  /** Pixels moved per 1px of page scroll (tune speed here) */
  speed?: number;
  className?: string;
}

export default function SlidingRoleBanner({
  direction = 'left',
  rotation = 5,
  speed = 0.4,
  className = '',
}: SlidingRoleBannerProps) {
  const stripRef   = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ── scroll-delta marquee ── */
  useEffect(() => {
    const content = contentRef.current;
    const strip   = stripRef.current;
    if (!content || !strip) return;

    /* Apply rotation */
    const isMobile = window.innerWidth < 768;
    const angle    = isMobile ? rotation * 1.8 : rotation;
    strip.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    /* Wait one frame so layout is complete before measuring */
    let rafId: number;
    let cleanupFn: () => void;

    rafId = requestAnimationFrame(() => {
      // unit = half of scrollWidth because DOM has exactly 2 copies
      const unit = content.scrollWidth / 2;
      if (unit <= 0) return;

      const setter = gsap.quickSetter(content, 'x', 'px');

      let  accumulated = 0; // target x (keeps growing / shrinking forever)
      let  currentX    = 0; // smoothed display x
      let  lastScrollY = window.scrollY;
      let  animRafId: number;

      const onScroll = () => {
        const scrollY  = window.scrollY;
        const delta    = scrollY - lastScrollY;
        lastScrollY    = scrollY;
        // direction: scrolling down moves text left or right
        accumulated   += direction === 'left' ? -delta * speed : delta * speed;
      };

      const tick = () => {
        // Lerp for smoothness (mimics scrub feel)
        currentX += (accumulated - currentX) * 0.12;

        // Modulo-wrap so x stays in [-unit, 0]
        // Using JS remainder + correction to always give non-positive value
        let x = currentX % unit;
        if (x > 0) x -= unit;

        setter(x);
        animRafId = requestAnimationFrame(tick);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      animRafId = requestAnimationFrame(tick);

      const handleResize = () => {
        const mob  = window.innerWidth < 768;
        const ang  = mob ? rotation * 1.8 : rotation;
        strip.style.transform = `translate(-50%, -50%) rotate(${ang}deg)`;
      };
      window.addEventListener('resize', handleResize);

      cleanupFn = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animRafId);
      };
    });

    return () => {
      cancelAnimationFrame(rafId);
      cleanupFn?.();
    };
  }, [direction, rotation, speed]);

  // Exactly 2 copies — unit = scrollWidth / 2 — seam is invisible
  const items = [...ROLES, ...ROLES];

  return (
    <div
      className={`relative z-20 w-full overflow-visible pointer-events-none h-[90px] md:h-[110px] ${className}`}
      aria-hidden="true"
    >
      {/* Diagonal strip */}
      <div
        ref={stripRef}
        className="absolute top-1/2 left-1/2 w-[160%] overflow-hidden backdrop-blur-md shadow-lg"
        style={{
          /* rotation applied via JS so resize updates it */
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* Scrolling content — 2 copies for seamless wrap */}
        <div
          ref={contentRef}
          className="inline-flex items-center whitespace-nowrap will-change-transform"
          style={{ paddingTop: '10px', paddingBottom: '10px' }}
        >
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center"
              style={{
                color: '#111827',
                padding: '0 32px',
              }}
            >
              <span
                style={{
                  color: '#111827',
                  fontSize: '1.5rem',
                  marginRight: '24px',
                }}
              >
                ✦
              </span>
              <span className="font-medium text-base md:text-2xl">{item}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
