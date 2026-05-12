'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollingBannerProps {
  items?: string[];
  speed?: number;
  className?: string;
}

const defaultItems = [
  'Web Developer',
  'Graphic Designer',
  'Video Editor',
  'VFX Artist',
  'Web Developer',
  'Graphic Designer',
  'Video Editor',
  'VFX Artist',
];

export const ScrollingBanner = ({
  items = defaultItems,
  speed = 30,
  className = '',
}: ScrollingBannerProps) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const topBannerRef = useRef<HTMLDivElement>(null);
  const bottomBannerRef = useRef<HTMLDivElement>(null);
  const topContentRef = useRef<HTMLDivElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topContent  = topContentRef.current;
    const bottomContent = bottomContentRef.current;
    const topBanner   = topBannerRef.current;
    const bottomBanner = bottomBannerRef.current;
    if (!topContent || !bottomContent || !topBanner || !bottomBanner) return;

    const isMobile = window.innerWidth < 768;
    const rotationAngle = isMobile ? 15 : 8;
    gsap.set(topBanner,    { rotation:  rotationAngle });
    gsap.set(bottomBanner, { rotation: -rotationAngle });

    let rafId: number;
    let cleanupFn: () => void;

    // Wait one frame for layout to settle before measuring
    rafId = requestAnimationFrame(() => {
      // DOM has 4 copies → unit = 1/4 of total scrollWidth
      const topUnit    = topContent.scrollWidth / 4;
      const bottomUnit = bottomContent.scrollWidth / 4;
      if (topUnit <= 0 || bottomUnit <= 0) return;

      const topSetter    = gsap.quickSetter(topContent,    'x', 'px');
      const bottomSetter = gsap.quickSetter(bottomContent, 'x', 'px');

      let topX      = 0, topTarget      = 0;
      let bottomX   = 0, bottomTarget   = 0;
      let lastScrollY = window.scrollY;
      let animRafId: number;

      const onScroll = () => {
        const scrollY = window.scrollY;
        const delta   = scrollY - lastScrollY;
        lastScrollY   = scrollY;
        // top strip: left on scroll-down; bottom strip: right on scroll-down
        topTarget    -= delta * 0.4;
        bottomTarget += delta * 0.4;
      };

      const tick = () => {
        topX    += (topTarget    - topX)    * 0.12;
        bottomX += (bottomTarget - bottomX) * 0.12;

        let tx = topX    % topUnit;
        let bx = bottomX % bottomUnit;
        if (tx > 0) tx -= topUnit;
        if (bx < 0) bx += bottomUnit;

        topSetter(tx);
        bottomSetter(bx);
        animRafId = requestAnimationFrame(tick);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      animRafId = requestAnimationFrame(tick);

      const handleResize = () => {
        const mob = window.innerWidth < 768;
        const ang = mob ? 15 : 8;
        gsap.set(topBanner,    { rotation:  ang });
        gsap.set(bottomBanner, { rotation: -ang });
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
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [items, speed]);

  // Quadruple items for seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      ref={bannerRef}
      className={`relative w-full overflow-visible pointer-events-none h-[180px] md:h-[260px] ${className}`}
      style={{
        zIndex: 40,
      }}
    >
      {/* Top Banner - Rotated +8deg - Scrolls Left to Right */}
      <div
        ref={topBannerRef}
        className="absolute top-1/2 left-1/2 w-[150%] overflow-hidden backdrop-blur-md shadow-lg"
        style={{
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          ref={topContentRef}
          className="inline-flex items-center px-4 py-2 md:px-8 md:py-4 font-medium text-base md:text-2xl whitespace-nowrap will-change-transform"
        >
          {duplicatedItems.map((item, index) => (
            <span key={`top-${index}`} className="inline-flex items-center mx-2 md:mx-8" style={{ color: '#111827' }}>
              <span className="text-lg md:text-3xl mx-2 md:mx-4" style={{ color: '#111827' }}>✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Banner - Rotated -8deg - Scrolls Right to Left */}
      <div
        ref={bottomBannerRef}
        className="absolute top-1/2 left-1/2 w-[150%] overflow-hidden backdrop-blur-md shadow-lg"
        style={{
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          ref={bottomContentRef}
          className="inline-flex items-center px-4 py-2 md:px-8 md:py-4 font-medium text-base md:text-2xl whitespace-nowrap will-change-transform"
          style={{ color: '#111827' }}
        >
          {duplicatedItems.map((item, index) => (
            <span key={`bottom-${index}`} className="inline-flex items-center mx-2 md:mx-8" style={{ color: '#111827' }}>
              <span className="text-lg md:text-3xl mx-2 md:mx-4" style={{ color: '#111827' }}>✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingBanner;
