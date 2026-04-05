'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  content: string;
  rating: number;
  phone?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Roohika',
    content: "I'm happy to be healthy and fit. I lost 12 kgs in just 3 months and feel so much smarter and more popular now! My relatives don't even recognise me. Your speciality is the school tiffin food.\n\nThank you so much!",
    rating: 5,
    phone: '8800704223',
  },
  {
    id: 2,
    name: 'Stephen A.',
    content: 'Within minutes the friendly sales assistant had secured me a spectacular restaurant at The Pullman Hotel which was right slap bang in the M&S Bank Arena limit, a 2 second walk !!!',
    rating: 5,
    phone: '9988776655',
  },
  {
    id: 3,
    name: 'Barry W.',
    content: 'Really useful system. We got an amazing service for our company hotel bookings for our up and coming events.',
    rating: 5,
    phone: '7766554433',
  },
  {
    id: 4,
    name: 'Sarah J.',
    content: "Super professional, organised and great to work with. These guys were invaluable on our last major project. Can't recommend enough.",
    rating: 5,
    phone: '6655443322',
  },
  {
    id: 5,
    name: 'Simon F.',
    content: 'Sorted accommodation in Scotland for me and were very timely and professional. Excellent rates and more discounted than anywhere else :)',
    rating: 5,
    phone: '5544332211',
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

      <div className="flex flex-col items-center mb-6 md:mb-10 relative z-10 select-none">
        {/* Name - Script Font */}
        <span className="font-script text-black text-3xl md:text-5xl">—{testimonial.name}</span>
        
        {/* Numeric ID / Phone at bottom */}
        {testimonial.phone && (
          <span className="text-black/40 text-[10px] md:text-xs mt-3 md:mt-4 tracking-[0.3em] font-medium">
            {testimonial.phone}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default function ReviewsSection() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!mounted) return <div className="h-[600px] w-full" />;

  return (
    <section className="relative z-20 pt-10 pb-12 md:pb-16 bg-transparent overflow-hidden">
      <BlueGradientBackground />
      
      <div className="relative">
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
              Client <span className="text-blue-600">Testimonials</span>
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

          <div className="relative w-full max-w-[650px] h-[400px] md:h-[550px] flex items-center justify-center overflow-visible z-10">
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
