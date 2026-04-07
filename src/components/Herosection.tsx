'use client';

import { memo, useRef, type ComponentType } from 'react';
import { ArrowUpRight, Calendar, Github, Instagram, Linkedin } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
} from 'framer-motion';
import { HeroContent } from '@/lib/hero-content-defaults';
import { usePreview } from '@/lib/contexts/PreviewContext';
import type { HomeContent } from '@/lib/home-content-defaults';

/* ─────────────────────────────── data ──────────────────────────── */
const dotPositions = [
  '10% 16%', '21% 38%', '36% 22%', '62% 28%',
  '74% 14%', '84% 40%', '15% 72%', '32% 84%',
  '54% 76%', '69% 88%', '88% 68%',
];

/* Behance — clean "Bē" mark, works at any size */
function BehanceIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden
    >
      {/* "B" letterform */}
      <path d="M1 18V6h5.5c1.2 0 2.1.3 2.8.9.7.6 1 1.3 1 2.2 0 .6-.2 1.1-.5 1.5-.3.4-.7.7-1.2.9.6.2 1.1.5 1.5 1 .4.5.6 1.1.6 1.8 0 1-.4 1.8-1.1 2.4-.7.6-1.7.9-2.9.9H1zm2.5-7.2h3c.5 0 .9-.1 1.2-.4.3-.3.5-.6.5-1.1 0-.5-.2-.8-.5-1.1-.3-.3-.7-.4-1.2-.4h-3v3zm0 5.4h3.2c.6 0 1-.2 1.3-.5.3-.3.5-.7.5-1.2s-.2-.9-.5-1.2c-.3-.3-.8-.5-1.3-.5H3.5v3.4z" />
      {/* "ē" letterform */}
      <path d="M14 15.3c.3.4.6.7 1 .9.4.2.9.3 1.4.3.8 0 1.4-.2 1.9-.7l1.7 1c-.4.6-.9 1-1.5 1.3-.6.3-1.3.4-2.1.4-1.4 0-2.5-.4-3.3-1.3-.8-.9-1.3-2-1.3-3.3s.4-2.4 1.2-3.3c.8-.9 1.9-1.3 3.2-1.3 1.2 0 2.2.5 3 1.4.8.9 1.1 2 1.1 3.3v.6h-6.5c.1.7.4 1.3.8 1.7zm4.3-3.6c-.3-.4-.6-.6-1-.8-.4-.2-.8-.3-1.3-.3-.5 0-.9.1-1.3.3-.4.2-.7.5-1 .8h4.6z" />
      {/* overline above "ē" */}
      <rect x="13" y="5" width="7.5" height="1.8" rx=".9" />
    </svg>
  );
}

const socialIconMap = {
  github: Github,
  behance: BehanceIcon,
  linkedin: Linkedin,
  instagram: Instagram,
} as const;

const socialLabelMap = {
  github: 'GitHub',
  behance: 'Behance',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
} as const;


/* ─────────────────── animation variants ────────────────────────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.10, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
  show:   {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ──────────────── Figma pill CTA button ────────────────────────── */
function MagneticButton({
  href,
  label,
  icon: Icon,
  secondary,
}: {
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
  secondary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const sx  = useSpring(x, { stiffness: 320, damping: 28 });
  const sy  = useSpring(y, { stiffness: 320, damping: 28 });

  const handleMouse = (e: React.MouseEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    x.set((e.clientX - box.left - box.width  / 2) * 0.28);
    y.set((e.clientY - box.top  - box.height / 2) * 0.28);
  };
  const reset = () => { x.set(0); y.set(0); };

  if (secondary) {
    return (
      <motion.a
        ref={ref}
        href={href}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        style={{ x: sx, y: sy }}
        whileHover={{ scale: 1.04, boxShadow: '0 18px 44px rgba(0,32,215,0.12)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="inline-flex items-center gap-3 rounded-full border-[2.5px] border-[#929292] bg-white pl-8 pr-2.5 py-2.5 font-['Poppins',sans-serif] text-[15px] font-medium text-slate-800 pointer-events-auto"
      >
        <span className="min-w-[80px] text-center">{label}</span>
        {Icon && (
          <motion.span
            whileHover={{ rotate: 45 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-slate-100"
          >
            <Icon className="h-5 w-5 text-slate-800" strokeWidth={2.2} />
          </motion.span>
        )}
      </motion.a>
    );
  }

  /* primary — exact Figma pill: gradient + grey border + white icon circle */
  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{
        x: sx,
        y: sy,
        background: 'linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)',
      }}
      whileHover={{ scale: 1.04, boxShadow: '0 22px 52px rgba(0,32,215,0.38)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="inline-flex items-center gap-4 rounded-full border-[2.5px] border-[#929292] pl-8 pr-2.5 py-2.5 font-['Poppins',sans-serif] text-[15px] font-medium text-white pointer-events-auto"
    >
      <span className="min-w-[88px] text-center">{label}</span>
      {Icon && (
        <motion.span
          whileHover={{ rotate: 45 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white"
        >
          <Icon className="h-5 w-5 text-[#0020d7]" strokeWidth={2.4} />
        </motion.span>
      )}
    </motion.a>
  );
}

/* ──────────────── hover-lift social icon tile ────────────────────── */
function SocialTile({
  icon: Icon,
  label,
  href,
  rotate,
  delay,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  href: string;
  rotate: number;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      initial={{ opacity: 0, y: 20, rotate }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -8,
        rotate: rotate * 0.3,
        scale: 1.08,
        boxShadow: '0 28px 56px rgba(97,70,255,0.22)',
        transition: { type: 'spring', stiffness: 420, damping: 22 },
      }}
      whileTap={{ scale: 0.93 }}
      className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-[20px] border border-white/90 bg-white shadow-[0_16px_38px_rgba(97,77,219,0.12)] pointer-events-auto"
    >
      <Icon className="h-7 w-7 text-slate-800" strokeWidth={2.2} />
    </motion.a>
  );
}

/* ──────────────────────── floating dot layer ─────────────────────── */
function FloatingDots() {
  return (
    <>
      {dotPositions.map((pos, i) => {
        const [lx, ly] = pos.split(' ');
        return (
          <motion.span
            key={i}
            className="pointer-events-none absolute h-[5px] w-[5px] rounded-full bg-[rgba(124,108,255,0.55)]"
            style={{ left: lx, top: ly }}
            animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.25,
            }}
          />
        );
      })}
    </>
  );
}


/* ═══════════════════════════ Section ════════════════════════════ */
const Herosection = ({
  data: initialData,
  homeLinks,
}: {
  data: HeroContent;
  homeLinks: Pick<HomeContent, 'socialLinks' | 'pageLinks'>;
}) => {
  const { previewData, isPreviewing } = usePreview();
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-60px' });

  // Real-time override from admin panel
  const data = isPreviewing ? { ...initialData, ...previewData } : initialData;
  

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-transparent pb-16"
    >
      {/* ── Layer 1: Background (z-0) ─────────────────────────────── */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        }}
      >
        <div className="absolute inset-0 bg-transparent" />
        
        {/* soft radial glows */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(125,163,246,0.13), transparent 32%),
              radial-gradient(circle at 80% 25%, rgba(0,32,215,0.08), transparent 30%),
              radial-gradient(circle at 50% 80%, rgba(125,163,246,0.09), transparent 38%)
            `,
          }}
        />

        {/* grids */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,32,215,0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,32,215,0.14) 1px, transparent 1px)
            `,
            backgroundSize: '84px 84px',
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,32,215,0.35) 1px, transparent 1px)`,
            backgroundSize: '42px 42px',
          }}
        />

        <FloatingDots />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,163,246,0.09),transparent_40%)]" />
      </div>

      {/* ── Layer 3: Foreground Text & UI (z-50) ───────────────────── */}
      <div className="pointer-events-none relative z-50 flex min-h-full flex-col items-center justify-start px-4 md:px-6">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-start pt-60 md:pt-80">
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            className="flex max-w-4xl flex-col items-center text-center"
          >
            {/* headline */}
            <motion.h1
              variants={fadeUp}
              className="pointer-events-auto max-w-4xl text-4xl font-semibold leading-[0.95] tracking-tighter text-[#0f1020] md:text-5xl lg:text-7xl"
            >
            {data.heroGreeting.includes('👋') ? (
              data.heroGreeting.split('👋').map((part: string, i: number, arr: string[]) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <motion.span
                      aria-hidden
                      className="inline-block origin-[70%_80%]"
                      animate={{ rotate: [0, 25, -5, 20, -10, 0] }}
                      transition={{
                        duration: 1.8,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      👋
                    </motion.span>
                  )}
                </span>
              ))
            ) : (
              <>
                {data.heroGreeting}{' '}
                <motion.span
                  aria-hidden
                  className="inline-block origin-[70%_80%]"
                  animate={{ rotate: [0, 25, -5, 20, -10, 0] }}
                  transition={{
                    duration: 1.8,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  👋
                </motion.span>
              </>
            )}
            <br />
            <span className="mt-2 flex justify-center cursor-default text-4xl leading-[0.95] tracking-[-0.08em] md:mt-3 md:text-6xl lg:text-7xl">
              {data.heroName.split('').map((char: string, index: number) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: 'spring', damping: 10, stiffness: 400, delay: 0.3 + index * 0.04 }
                  } : {}}
                  whileHover={{
                    scaleY: 1.3,
                    scaleX: 1.1,
                    y: -12,
                    rotate: index % 2 === 0 ? -4 : 4,
                    transition: { type: 'spring', stiffness: 400, damping: 5 }
                  }}
                  className="inline-block origin-bottom bg-clip-text px-[0.02em] pt-2 pb-6 -mb-4 text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* sub-copy */}
          <motion.p
            variants={fadeUp}
            className="pointer-events-auto mt-6 max-w-4xl text-base leading-snug tracking-tight text-slate-600 md:mt-8 md:text-lg lg:text-xl"
          >
            {data.heroSubcopy}
          </motion.p>

          {/* audience pill */}
          <motion.div
            variants={scaleIn}
            className="pointer-events-auto mt-10 flex w-[380px] cursor-default items-center rounded-full border border-slate-200 bg-white/70 py-2.5 shadow-sm backdrop-blur-md"
          >
            <div 
              className="flex w-full overflow-hidden"
              style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
            >
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ ease: 'linear', duration: 15, repeat: Infinity }}
                className="flex w-max whitespace-nowrap"
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-8 pr-8">
                    <p className="text-[14px] font-medium tracking-wide text-[#0020d7]">
                      {data.heroAvailabilityText}
                    </p>
                    <p className="text-[14px] font-medium tracking-wide text-[#0020d7]">
                      {data.heroAvailabilityText}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* CTA buttons — Figma pill style */}
          <motion.div
            variants={fadeUp}
            className="pointer-events-auto mt-8 flex flex-col items-center gap-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <MagneticButton
                href={homeLinks.pageLinks.projects || data.heroCtaPrimaryUrl}
                label={data.heroCtaPrimaryLabel}
                icon={ArrowUpRight}
              />
              <MagneticButton
                href={homeLinks.pageLinks.contact || data.heroCtaSecondaryUrl}
                label={data.heroCtaSecondaryLabel}
                icon={Calendar}
                secondary
              />
            </div>

            <motion.p
              variants={fadeUp}
              className="mt-5 flex items-center gap-2 text-sm text-slate-400"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              Available for freelance &amp; full-time opportunities.
            </motion.p>
          </motion.div>

          {/* social icon tiles */}
          <motion.div
            variants={scaleIn}
            className="pointer-events-auto mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-6"
          >
            {(Object.keys(homeLinks.socialLinks) as Array<keyof HomeContent['socialLinks']>).map((key, index) => {
              const Icon = socialIconMap[key];
              const href = homeLinks.socialLinks[key];

              return (
                <SocialTile
                  key={key}
                  icon={Icon}
                  label={socialLabelMap[key]}
                  href={href}
                  rotate={index % 2 === 0 ? -10 : 10}
                  delay={0.42 + index * 0.07}
                />
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>

  </section>
);
};

export default memo(Herosection);
