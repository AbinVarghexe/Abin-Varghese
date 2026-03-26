'use client';

import { memo, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Github, Instagram, Linkedin } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from 'framer-motion';

/* ─────────────────────────────── data ──────────────────────────── */
const dotPositions = [
  '10% 16%', '21% 38%', '36% 22%', '62% 28%',
  '74% 14%', '84% 40%', '15% 72%', '32% 84%',
  '54% 76%', '69% 88%', '88% 68%',
];

/* Behance — clean "Bē" mark, works at any size */
function BehanceIcon({ className, ...rest }: { className?: string; [k: string]: unknown }) {
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

const socialTiles = [
  { icon: Github,       label: 'GitHub',    href: 'https://github.com/AbinVarghexe' },
  { icon: BehanceIcon,  label: 'Behance',   href: 'https://www.behance.net/abinvarghese' },
  { icon: Linkedin,     label: 'LinkedIn',  href: 'https://www.linkedin.com/in/abinvarghese' },
  { icon: Instagram,    label: 'Instagram', href: 'https://www.instagram.com/abinvarghese' },
];

const audienceDots = ['AV', 'UI', 'UX', 'FD', 'NX'];

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
  icon?: React.ElementType;
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
        className="inline-flex items-center gap-3 rounded-full border-[2.5px] border-[#929292] bg-white pl-8 pr-2.5 py-2.5 font-['Poppins',sans-serif] text-[15px] font-medium text-slate-800"
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
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.04, boxShadow: '0 22px 52px rgba(0,32,215,0.38)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="inline-flex items-center gap-4 rounded-full border-[2.5px] border-[#929292] pl-8 pr-2.5 py-2.5 font-['Poppins',sans-serif] text-[15px] font-medium text-white"
      style={{
        background: 'linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)',
      } as React.CSSProperties}
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
  icon: React.ElementType;
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
      className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-[20px] border border-white/90 bg-white shadow-[0_16px_38px_rgba(97,77,219,0.12)]"
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

/* ──────────────────────── shimmer text span ─────────────────────── */
function ShimmerText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="relative mt-2 block bg-clip-text pb-[0.2em] text-transparent"
      style={{ backgroundImage: 'linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)' }}
    >
      {/* subtle gloss sweep */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm"
        style={{
          background:
            'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.38) 50%, transparent 65%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% center', '-100% center'] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
      />
      {children}
    </motion.span>
  );
}

/* ═══════════════════════════ Section ════════════════════════════ */
const Herosection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 pb-24 pt-40 md:px-6 md:pb-32 md:pt-52 lg:pt-64"
    >
      {/* ── Background layers ─────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#ECECEC]" />

      {/* soft radial glows — Figma blue palette */}
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

      {/* line grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,80,220,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,80,220,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '42px 42px',
        }}
      />

      {/* tiny dot grid (half-pitch of the line grid) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(110,90,230,0.30) 1px, transparent 1px)`,
          backgroundSize: '21px 21px',
        }}
      />

      {/* animated scatter dots */}
      <FloatingDots />

      {/* center highlight — Figma blue */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,163,246,0.09),transparent_40%)]" />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[1400px]">
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          {/* headline */}
          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-[2.2rem] font-semibold leading-[0.95] tracking-[-0.04em] text-[#0f1020] md:text-[3rem] lg:text-[4.5rem]"
          >
            Hi, Guys{' '}
            <motion.span
              aria-hidden
              style={{ display: 'inline-block', transformOrigin: '70% 80%' }}
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
            {' '}I'm
            <ShimmerText>Abin Varghese</ShimmerText>
          </motion.h1>

          {/* sub-copy */}
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-4xl text-base leading-7 text-slate-600 md:text-lg"
          >
            I design with purpose and build with precision every pixel and every line of code is intentional.Currently studying CS, already creating work that goes beyond the classroom.
          </motion.p>

          {/* audience pill */}
          <motion.div
            variants={scaleIn}
            whileHover={{ scale: 1.03, boxShadow: '0 24px 52px rgba(85,68,184,0.14)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="mt-10 flex cursor-default items-center gap-2.5 rounded-full border border-white/80 bg-white/80 px-3.5 py-2 shadow-[0_14px_34px_rgba(85,68,184,0.09)] backdrop-blur"
          >
            <div className="flex -space-x-2">
              {audienceDots.map((dot, index) => (
                <motion.div
                  key={dot}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-slate-700"
                  style={{ background: index % 2 === 0 ? '#f1edff' : '#fff5ef' }}
                >
                  {dot}
                </motion.div>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-600">
              Full-Stack Developer · UI/UX Designer · Kerala, IN.
            </p>
          </motion.div>

          {/* CTA buttons — Figma pill style */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <MagneticButton
                href="/projects"
                label="View My Work"
                icon={ArrowUpRight}
              />
              <MagneticButton
                href="/contact"
                label="Start a Project"
                icon={ArrowUpRight}
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
            className="mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-6"
          >
            {socialTiles.map(({ icon, label, href }, index) => (
              <SocialTile
                key={label}
                icon={icon}
                label={label}
                href={href}
                rotate={index % 2 === 0 ? -10 : 10}
                delay={0.42 + index * 0.07}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 100%)',
        }}
      />
    </section>
  );
};

export default memo(Herosection);
