'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  content: string;
  rating: number;
  designation?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Roohika',
    content: "I'm happy to be healthy and fit. I lost 12 kgs in just 3 months and feel so much smarter and more popular now! My relatives don't even recognise me. Your speciality is the school tiffin food.\n\nThank you so much!",
    rating: 5,
    designation: 'CEO, Wellness Solutions',
  },
  {
    id: 2,
    name: 'Stephen A.',
    content: 'Within minutes the friendly sales assistant had secured me a spectacular restaurant at The Pullman Hotel which was right slap bang in the M&S Bank Arena limit, a 2 second walk !!!',
    rating: 5,
    designation: 'Product Designer, Indie Inc.',
  },
  {
    id: 3,
    name: 'Barry W.',
    content: 'Really useful system. We got an amazing service for our company hotel bookings for our up and coming events.',
    rating: 5,
    designation: 'Co-Founder, Tech Harbor',
  },
  {
    id: 4,
    name: 'Sarah J.',
    content: "Super professional, organised and great to work with. These guys were invaluable on our last major project. Can't recommend enough.",
    rating: 5,
    designation: 'Project Lead, Creative Agency',
  },
  {
    id: 5,
    name: 'Simon F.',
    content: 'Sorted accommodation in Scotland for me and were very timely and professional. Excellent rates and more discounted than anywhere else :)',
    rating: 5,
    designation: 'Director, Logistics Group',
  },
];

const BlueGradientBackground = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
  </svg>
);

const PaperClip = () => (
  <svg width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -left-4 -top-8 rotate-12 z-50 drop-shadow-md">
    <path d="M12 25V55C12 60.5228 16.4772 65 22 65C27.5228 65 32 60.5228 32 55V15C32 9.47715 27.5228 5 22 5C16.4772 5 12 9.47715 12 15V50C12 52.7614 14.2386 55 17 55C19.7614 55 22 52.7614 22 50V25" stroke="url(#blueGradient)" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const BackgroundAnimations = () => {
  const starsList = [
    { x: 100, y: 150, size: 2, connects: [1, 2] },
    { x: 300, y: 220, size: 3, connects: [2, 3] },
    { x: 220, y: 400, size: 2, connects: [0, 3] },
    { x: 150, y: 550, size: 3, connects: [1, 4] },
    { x: 450, y: 320, size: 2, connects: [] },
    { x: 800, y: 180, size: 3, connects: [6, 7] },
    { x: 1050, y: 120, size: 2, connects: [7, 8] },
    { x: 950, y: 350, size: 3, connects: [5, 8] },
    { x: 1100, y: 500, size: 2, connects: [6, 9] },
    { x: 850, y: 650, size: 2, connects: [7, 5] },
  ];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none opacity-40">
      <svg className="absolute w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Constellation Network */}
        {starsList.map((star, i) => (
          <g key={`star-group-${i}`}>
            {star.connects.map((neighborIdx) => (
              <motion.line
                key={`line-${i}-${neighborIdx}`}
                x1={star.x}
                y1={star.y}
                x2={starsList[neighborIdx].x}
                y2={starsList[neighborIdx].y}
                stroke="#3b82f6"
                strokeWidth="0.5"
                strokeOpacity="0.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.3, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              />
            ))}
            <motion.circle
              cx={star.x}
              cy={star.y}
              r={star.size}
              fill="#3b82f6"
              filter="url(#starGlow)"
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.25, 1] }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
            />
          </g>
        ))}
      </svg>
      
      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            initial={{ x: `${10 + Math.random() * 80}%`, y: `${10 + Math.random() * 80}%`, opacity: 0 }}
            animate={{ y: [null, '-15%'], opacity: [0, 0.4, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 7 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 10 }}
          >
            <div className="w-1 h-1 bg-blue-300 rounded-full blur-[1px]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ReviewCard = ({ 
  testimonial, 
  index, 
  total, 
  activeIndex,
  onClick
}: { 
  testimonial: Testimonial, 
  index: number, 
  total: number, 
  activeIndex: number,
  onClick?: () => void
}) => {
  const isTop = index === activeIndex;
  const position = index - activeIndex;
  const isPast = position < 0;

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isTop ? 1 : 1 - Math.abs(position) * 0.05,
        x: position * 40,
        y: position * 10,
        rotate: position * -2,
        opacity: isPast ? 0 : 1,
        zIndex: total - index,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={isTop ? onClick : undefined}
      className={`absolute w-[90%] max-w-[550px] aspect-[1.4/1] bg-[#fdfaf6] rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-stone-200 pointer-events-auto flex flex-col justify-between overflow-visible ${isTop ? 'cursor-pointer active:scale-[0.98]' : 'pointer-events-none'}`}
    >
      {/* Background & Noise Container (Clips noise but not paperclip) */}
      <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
      </div>

      {/* Blue Gradient Paperclip on Top Card */}
      {isTop && <PaperClip />}

      <div className="flex flex-col items-center grow pt-6 md:pt-10 relative z-10 px-8 md:px-12 select-none">
        {/* Blue Stars */}
        <div className="flex gap-1.5 mb-6 md:mb-8 items-center justify-center">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={22} fill="url(#blueGradient)" className="text-[#3b82f6]" strokeWidth={0} />
          ))}
        </div>

        {/* Content - Serif Font with reduced size */}
        <p className="font-serif text-black text-sm md:text-[1.05rem] leading-[1.6] text-center italic opacity-90 whitespace-pre-line max-w-[420px]">
          {testimonial.content}
        </p>
      </div>

      <div className="flex flex-col items-end mb-6 md:mb-10 relative z-10 select-none px-8 md:px-12">
        {/* Name - Original large script font */}
        <span className="font-script text-black text-3xl md:text-5xl">—{testimonial.name}</span>
        
        {/* Designation at bottom */}
        {testimonial.designation && (
          <span className="text-black/40 text-[10px] md:text-xs mt-3 md:mt-4 tracking-[0.3em] font-medium uppercase text-right">
            {testimonial.designation}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default function ReviewsSection() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!mounted || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [mounted, isPaused, handleNext]);

  if (!mounted) return <div className="h-[600px] w-full" />;

  return (
    <section 
      ref={sectionRef}
      id="reviews" 
      className="relative z-20 py-24 px-4 md:px-8 lg:px-20 w-full overflow-hidden"
    >

      <BlueGradientBackground />
      
      <div className="relative z-20">
        <div className="w-full mb-16 relative">
          <div className="absolute inset-0 -z-10 overflow-visible pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute -left-1/4 top-0 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px]"
            />
            
            <div className="absolute inset-0 flex justify-between px-4 md:px-0 opacity-[0.05]">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-px h-full bg-black ml-[8.33%]" />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col items-start px-4 md:px-8 lg:px-16 xl:px-32 pl-[40px] md:pl-[40px] lg:pl-[40px] xl:pl-[calc(8rem+40px)] relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-2 tracking-tight">
              Client <span className="text-blue-600 font-serif italic font-medium">Testimonials</span>
            </h2>
            <p className="text-black/70 text-base max-w-[600px] leading-relaxed">
              A curated collection of feedback from clients and partners I've had the pleasure 
              of working with to bring their visions to life, from design to development.
            </p>
          </motion.div>
        </div>

        <div className="relative w-full flex items-center justify-center -mt-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="hidden md:flex absolute left-4 lg:left-12 z-50 w-14 h-14 rounded-full items-center justify-center bg-white/90 backdrop-blur-sm border border-stone-200 text-black hover:bg-black hover:text-white transition-all shadow-xl active:scale-90 pointer-events-auto"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={28} />
          </button>

          <div 
            className="relative w-full max-w-[650px] h-[400px] md:h-[550px] flex items-center justify-center overflow-visible z-10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="popLayout">
              {testimonials.map((testimonial, index) => (
                <ReviewCard 
                  key={testimonial.id} 
                  testimonial={testimonial} 
                  index={index}
                  total={testimonials.length}
                  activeIndex={activeIndex}
                  onClick={handleNext}
                />
              ))}
            </AnimatePresence>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden md:flex absolute right-4 lg:right-12 z-50 w-14 h-14 rounded-full items-center justify-center bg-white/90 backdrop-blur-sm border border-stone-200 text-black hover:bg-black hover:text-white transition-all shadow-xl active:scale-90 pointer-events-auto"
            aria-label="Next testimonial"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6 mt-8 w-full z-20">
          <div className="flex gap-8 md:hidden">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-stone-200 text-black shadow-sm active:scale-95 pointer-events-auto"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-stone-200 text-black shadow-sm active:scale-95 pointer-events-auto"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
