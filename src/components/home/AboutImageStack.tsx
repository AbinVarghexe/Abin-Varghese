'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type CardId = 'left' | 'right' | 'center';
type State = 'default' | 'hover';

const IMAGES = [
  { id: 'center', src: '/about/About_Image.png', priority: true },
  { id: 'left', src: '/about/Abin_2.png', priority: false },
  { id: 'right', src: '/about/Abin_3.png', priority: false },
];

const CONFIG: Record<State, Record<string, object>> = {
  default: {
    left: { rotation: -13, scale: 0.85, x: -80, y: 14, opacity: 0.82, zIndex: 1 },
    right: { rotation: 13, scale: 0.85, x: 80, y: 14, opacity: 0.82, zIndex: 2 },
    center: { rotation: 0, scale: 1.00, x: 0, y: 0, opacity: 1.00, zIndex: 3 },
  },
  hover: {
    left: { rotation: -16, scale: 0.85, x: -95, y: 18, opacity: 0.75, zIndex: 1 },
    right: { rotation: 16, scale: 0.85, x: 95, y: 18, opacity: 0.75, zIndex: 2 },
    center: { rotation: 0, scale: 1.05, x: 0, y: -8, opacity: 1.00, zIndex: 3 },
  },
};

const EASE = 'power2.out';
const DUR = 0.38;

export default function AboutImageStack() {
  const [cards, setCards] = useState(IMAGES);
  // Threshold increased to 1024px to cover Tablets/iPads with the Swipe interaction
  const [useSwipe, setUseSwipe] = useState(false);

  // Refs for GSAP Desktop
  const stackRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkViewport = () => setUseSwipe(window.innerWidth < 1024);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const applyState = useCallback((state: State) => {
    if (useSwipe) return;

    const cfg = CONFIG[state];
    ['left', 'right', 'center'].forEach((id) => {
      const el = id === 'left' ? leftRef.current : id === 'right' ? rightRef.current : centerRef.current;
      if (!el) return;
      gsap.to(el, { ...cfg[id], ease: EASE, duration: DUR, overwrite: 'auto' });
    });
  }, [useSwipe]);

  useEffect(() => {
    if (useSwipe) return;

    const left = leftRef.current;
    const right = rightRef.current;
    const center = centerRef.current;
    const stack = stackRef.current;

    if (!left || !right || !center || !stack) return;

    const ctx = gsap.context(() => {
      gsap.set([left, right, center], { transformOrigin: 'bottom center' });
      const def = CONFIG.default;
      gsap.set(left, def.left);
      gsap.set(right, def.right);
      gsap.set(center, def.center);
      
      // Removed opacity: 0 to ensure visibility on tablets/desktops by default
      gsap.set(stack, { opacity: 1 });

      ScrollTrigger.create({
        trigger: stack,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          // Entrance animation now starts from a fanned state or subtle collapse
          // to ensure if the animation fails, we already have photos visible.
          const tl = gsap.timeline();
          tl.from(center, { opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out(1.6)' });
          tl.from(left, { opacity: 0, x: 0, rotation: 0, duration: 0.4 }, '-=0.3');
          tl.from(right, { opacity: 0, x: 0, rotation: 0, duration: 0.4 }, '-=0.3');
        },
      });
    });
    return () => ctx.revert();
  }, [useSwipe]);

  const handleSwipe = (direction: 'left' | 'right') => {
    setCards((prev) => {
      const newCards = [...prev];
      const swipedCard = newCards.shift();
      if (swipedCard) newCards.push(swipedCard);
      return newCards;
    });
  };

  return (
    <div className="w-full lg:w-[45%] flex items-center justify-center order-1 lg:order-2 overflow-visible min-h-[400px]">
      {useSwipe ? (
        <div className="relative w-[300px] h-[390px]">
          <AnimatePresence mode="popLayout">
            {cards.map((card, index) => (
              <SwipeCard 
                key={card.src} 
                card={card} 
                index={index} 
                total={cards.length}
                onSwipe={handleSwipe}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div
          ref={stackRef}
          className="relative w-[300px] h-[390px] cursor-default"
          onMouseEnter={() => applyState('hover')}
          onMouseLeave={() => applyState('default')}
        >
          <div ref={leftRef} className="absolute inset-0 rounded-[12px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.22)]">
            <Image src="/about/Abin_2.png" alt="" fill className="object-cover object-top" sizes="300px" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div ref={rightRef} className="absolute inset-0 rounded-[12px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.22)]">
            <Image src="/about/Abin_3.png" alt="" fill className="object-cover object-top" sizes="300px" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div ref={centerRef} className="absolute inset-0 rounded-[12px] overflow-hidden shadow-[0_18px_52px_rgba(0,0,0,0.34)]">
            <Image src="/about/About_Image.png" alt="Abin Varghese" fill className="object-cover object-top" sizes="300px" priority />
          </div>
        </div>
      )}
    </div>
  );
}

function SwipeCard({ card, index, total, onSwipe }: { card: any, index: number, total: number, onSwipe: (dir: any) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);
  
  const isTop = index === 0;

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        zIndex: total - index,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe('right');
        else if (info.offset.x < -100) onSwipe('left');
      }}
      animate={{
        scale: 1 - index * 0.05,
        y: index * 12,
        x: index === 0 ? 0 : index % 2 === 0 ? 40 : -40,
        rotate: index === 0 ? 0 : index % 2 === 0 ? 14 : -14,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      exit={{ x: x.get() < 0 ? -500 : 500, opacity: 0, transition: { duration: 0.4 } }}
      className="absolute inset-0 rounded-[12px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white cursor-grab active:cursor-grabbing touch-none"
    >
      <Image 
        src={card.src} 
        alt="" 
        fill 
        className="object-cover object-top pointer-events-none" 
        sizes="300px" 
        priority={card.priority} 
      />
      {index > 0 && <div className="absolute inset-0 bg-black/10 transition-opacity duration-300" />}
    </motion.div>
  );
}
