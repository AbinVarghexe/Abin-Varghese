'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
} from 'framer-motion';
import { ArrowUpRight, Home } from 'lucide-react';

/* ─────────────────── animation variants ────────────────────────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────── floating dot positions ────────────────────── */
const dotPositions = [
  '8% 12%', '18% 35%', '32% 18%', '58% 24%',
  '72% 10%', '88% 36%', '12% 68%', '28% 82%',
  '52% 72%', '68% 86%', '85% 62%', '45% 50%',
];

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

/* ─────────────────── magnetic button ────────────────────────── */
function MagneticButton({
  href,
  label,
  icon: Icon,
  secondary,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  secondary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 28 });
  const sy = useSpring(y, { stiffness: 320, damping: 28 });

  const handleMouse = (e: React.MouseEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    x.set((e.clientX - box.left - box.width / 2) * 0.28);
    y.set((e.clientY - box.top - box.height / 2) * 0.28);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

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
        className="inline-flex items-center gap-3 rounded-full border-[2.5px] border-[#929292] bg-white pl-8 pr-1.5 md:pr-2 py-3 md:py-2.5 font-['Poppins',sans-serif] text-[13px] md:text-[15px] font-medium text-slate-800 pointer-events-auto"
      >
        <span className="min-w-[70px] md:min-w-[80px] text-center">{label}</span>
        <motion.span
          whileHover={{ rotate: 45 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="flex h-[42px] md:h-10 w-[42px] md:w-10 items-center justify-center rounded-full bg-slate-100"
        >
          <Icon className="h-4 md:h-4.5 w-4 md:w-4.5 text-slate-800" strokeWidth={2.2} />
        </motion.span>
      </motion.a>
    );
  }

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
      className="inline-flex items-center gap-4 rounded-full border-[2.5px] border-[#929292] pl-8 pr-1.5 md:pr-2 py-3 md:py-2.5 font-['Poppins',sans-serif] text-[13px] md:text-[15px] font-medium text-white pointer-events-auto"
    >
      <span className="min-w-[70px] md:min-w-[88px] text-center">{label}</span>
      <motion.span
        whileHover={{ rotate: 45 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        className="flex h-[42px] md:h-10 w-[42px] md:w-10 items-center justify-center rounded-full bg-white"
      >
        <Icon className="h-4 md:h-4.5 w-4 md:w-4.5 text-[#0020d7]" strokeWidth={2.4} />
      </motion.span>
    </motion.a>
  );
}

/* ═══════════════════════════ 404 Page ════════════════════════════ */
export default function NotFound() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f7f4ef 0%, #f0eee9 60%, #ece7df 100%)' }}
    >
      {/* ── Background Layer ─────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        }}
      >
        {/* radial glows */}
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

        {/* grid pattern */}
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
            backgroundImage: 'radial-gradient(circle, rgba(0,32,215,0.35) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />

        <FloatingDots />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,163,246,0.09),transparent_40%)]" />
      </div>

      {/* ── Content Layer ────────────────────────────────── */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 md:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex max-w-3xl flex-col items-center text-center"
        >
          {/* Logo */}
          <motion.div variants={scaleIn} className="mb-8 md:mb-12">
            <Link
              href="/"
              aria-label="Abin Varghese Home"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/Logo.svg"
                alt="Abin Varghese logo"
                width={56}
                height={48}
                className="h-12 md:h-14 w-auto"
                priority
              />
            </Link>
          </motion.div>

          {/* Large 404 display with animated gradient characters */}
          <motion.div variants={fadeUp} className="relative mb-4 md:mb-6">
            <h1 className="flex cursor-default text-[120px] sm:text-[160px] md:text-[200px] lg:text-[240px] font-semibold leading-none tracking-tighter">
              {'404'.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={
                    inView
                      ? {
                          opacity: 1,
                          y: 0,
                          transition: {
                            type: 'spring',
                            damping: 10,
                            stiffness: 400,
                            delay: 0.3 + index * 0.08,
                          },
                        }
                      : {}
                  }
                  whileHover={{
                    scaleY: 1.15,
                    scaleX: 1.08,
                    y: -16,
                    rotate: index % 2 === 0 ? -6 : 6,
                    transition: { type: 'spring', stiffness: 400, damping: 5 },
                  }}
                  className="inline-block origin-bottom bg-clip-text px-[0.02em] text-transparent select-none"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            {/* Decorative glow behind 404 */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-30"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0,32,215,0.2), transparent 70%)',
                filter: 'blur(60px)',
                transform: 'scale(1.5)',
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#0f1020]"
          >
            Page not <span className="font-serif italic text-[#2563eb]">found</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-4 md:mt-6 max-w-md text-[14px] md:text-lg leading-relaxed tracking-tight text-slate-500"
          >
            The page you&apos;re looking for seems to have wandered off.
            Let&apos;s get you back on track.
          </motion.p>

          {/* Animated status pill */}
          <motion.div
            variants={scaleIn}
            className="mt-6 md:mt-8 flex w-auto cursor-default items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-5 py-2.5 shadow-sm backdrop-blur-md"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-[12px] md:text-[14px] font-medium tracking-wide text-amber-600">
              Error 404 — This route doesn&apos;t exist
            </span>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <MagneticButton href="/" label="Go Home" icon={Home} />
            <MagneticButton href="/projects" label="View Projects" icon={ArrowUpRight} secondary />
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div
            variants={fadeUp}
            className="mt-12 md:mt-16 flex items-center gap-3"
          >
            <div className="h-px w-12 bg-slate-300" />
            <span className="text-xs font-medium tracking-widest uppercase text-slate-400">
              Abin Varghese
            </span>
            <div className="h-px w-12 bg-slate-300" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
