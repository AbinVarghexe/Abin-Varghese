'use client';

import { memo, type ComponentType } from 'react';
import { ArrowUpRight, Calendar, Github, Instagram, Linkedin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Hero3DLayer = dynamic(() => import('@/components/ui/Hero3DLayer'), {
  ssr: false,
});
import { HeroContent } from '@/lib/hero-content-defaults';
import { usePreview } from '@/lib/contexts/PreviewContext';
import type { HomeContent } from '@/lib/home-content-defaults';
import { ResumeDropdown } from '@/components/common/ResumeDropdown';
import type { SiteCopyContent } from '@/types/site-copy';

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
  const isCalLink = href?.startsWith('https://cal.com/') || href?.startsWith('https://cal.me/');
  let calLinkValue = undefined;
  if (isCalLink) {
    try {
      const url = new URL(href);
      // Remove leading and trailing slashes
      calLinkValue = url.pathname.replace(/^\/+|\/+$/g, '');
    } catch {
      // In case URL parsing fails (e.g., malformed URL), fallback
      calLinkValue = href.replace('https://cal.com/', '').replace('https://cal.me/', '').replace(/\/+$/, '');
    }
  }

  if (secondary) {
    return (
      <a
        href={href}
        data-cal-link={calLinkValue}
        data-cal-config='{"theme":"light"}'
        onClick={(e) => {
          if (isCalLink) e.preventDefault();
        }}
        className="group inline-flex items-center gap-3 rounded-full border-[2.5px] border-[#929292] bg-white pl-8 pr-1.5 md:pr-2 py-3 md:py-2.5 font-['Poppins',sans-serif] text-[13px] md:text-[15px] font-medium text-slate-800 pointer-events-auto transition-transform hover:scale-[1.04] active:scale-[0.97] hover:shadow-[0_18px_44px_rgba(0,32,215,0.12)]"
      >
        <span className="min-w-[70px] md:min-w-[80px] text-center">{label}</span>
        {Icon && (
          <span className="flex h-[42px] md:h-10 w-[42px] md:w-10 items-center justify-center rounded-full bg-slate-100 transition-transform group-hover:rotate-45">
            <Icon className="h-4 md:h-4.5 w-4 md:w-4.5 text-slate-800" strokeWidth={2.2} />
          </span>
        )}
      </a>
    );
  }

  /* primary — exact Figma pill: gradient + grey border + white icon circle */
  return (
    <a
      href={href}
      data-cal-link={calLinkValue}
      data-cal-config='{"theme":"light"}'
      onClick={(e) => {
        if (isCalLink) e.preventDefault();
      }}
      style={{
        background: 'linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)',
      }}
      className="group inline-flex items-center gap-4 rounded-full border-[2.5px] border-[#929292] pl-8 pr-1.5 md:pr-2 py-3 md:py-2.5 font-['Poppins',sans-serif] text-[13px] md:text-[15px] font-medium text-white pointer-events-auto transition-transform hover:scale-[1.04] active:scale-[0.97] hover:shadow-[0_22px_52px_rgba(0,32,215,0.38)]"
    >
      <span className="min-w-[70px] md:min-w-[88px] text-center">{label}</span>
      {Icon && (
        <span className="flex h-[42px] md:h-10 w-[42px] md:w-10 items-center justify-center rounded-full bg-white transition-transform group-hover:rotate-45">
          <Icon className="h-4 md:h-4.5 w-4 md:w-4.5 text-[#0020d7]" strokeWidth={2.4} />
        </span>
      )}
    </a>
  );
}

/* ──────────────── hover-lift social icon tile ────────────────────── */
function SocialTile({
  icon: Icon,
  label,
  href,
  rotate,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  href: string;
  rotate: number;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      style={{ transform: `rotate(${rotate}deg)` }}
      className="flex h-14 w-14 md:h-16 md:w-16 cursor-pointer items-center justify-center rounded-[16px] md:rounded-[20px] border border-white/90 bg-white shadow-[0_16px_38px_rgba(97,77,219,0.12)] pointer-events-auto transition-transform hover:-translate-y-2 hover:scale-[1.08] active:scale-[0.93] hover:shadow-[0_28px_56px_rgba(97,70,255,0.22)]"
    >
      <Icon className="h-6 w-6 md:h-7 md:w-7 text-slate-800" strokeWidth={2.2} />
    </a>
  );
}

/* ──────────────────────── floating dot layer ─────────────────────── */
function FloatingDots() {
  return (
    <>
      {dotPositions.map((pos, i) => {
        const [lx, ly] = pos.split(' ');
        return (
          <span
            key={i}
            className="pointer-events-none absolute h-[5px] w-[5px] rounded-full bg-[rgba(124,108,255,0.55)]"
            style={{ left: lx, top: ly }}
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
  statusLine,
  siteCopy,
}: {
  data: HeroContent;
  homeLinks: Pick<HomeContent, 'socialLinks' | 'otherSocialLinks' | 'pageLinks'>;
  statusLine: string;
  siteCopy: Pick<
    SiteCopyContent,
    'heroMobileCtaLabel' | 'heroMobileResumeLabel' | 'designerResumeLabel' | 'designerResumeDesc' | 'developerResumeLabel' | 'developerResumeDesc' | 'resumeDropdownTitle'
  >;
}) => {
  const { previewData, isPreviewing } = usePreview();

  // Real-time override from admin panel
  const data = isPreviewing ? { ...initialData, ...previewData } : initialData;

  // Split greeting to isolate the emoji for animation
  const greetingParts = data.heroGreeting.split(/(👋)/);
  const nameLetters = data.heroName.split('');

  return (
    <section
      className="pointer-events-none relative min-h-fit md:min-h-screen w-full bg-transparent pb-0 md:pb-16"
    >
      {/* ── Layer 1: Background (z-0) ─────────────────────────────── */}
      <div 
        className="pointer-events-none absolute inset-0 z-0"
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
      <div className="pointer-events-none relative z-20 flex min-h-full flex-col items-center justify-start px-4 md:px-6">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-start pt-44 md:pt-80">
          <div className="flex max-w-4xl flex-col items-center text-center">
            {/* Mobile-only 3D Robot Container */}
            <div className="md:hidden w-full h-[360px] -mt-20 mb-0 pointer-events-auto">
              <Hero3DLayer />
            </div>

            {/* headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="pointer-events-auto max-w-4xl text-[40px] md:text-5xl lg:text-7xl font-semibold leading-[0.9] tracking-tighter text-[#0f1020]"
            >
              {greetingParts.map((part: string, i: number) => 
                part === '👋' ? (
                  <motion.span
                    key={i}
                    style={{ display: 'inline-block' }}
                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut"
                    }}
                    className="origin-bottom-right ml-2"
                  >
                    👋
                  </motion.span>
                ) : part
              )}
              <br />
              <span
                className="inline-block cursor-default bg-clip-text text-[40px] md:text-6xl lg:text-7xl leading-tight tracking-[-0.04em] text-transparent overflow-visible py-2"
                style={{ backgroundImage: 'linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)' }}
              >
                {nameLetters.map((letter: string, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.5 + i * 0.03,
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }}
                    whileHover={{ 
                      y: -15,
                      scale: 1.15,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                    className="inline-block relative z-10"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

          {/* sub-copy */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="pointer-events-auto mt-4 md:mt-8 max-w-[340px] md:max-w-4xl text-[14px] md:text-lg lg:text-xl text-center leading-snug tracking-tight text-slate-600 sm:text-justify lg:text-center [text-align-last:center] lg:[text-align-last:auto]"
          >
            {data.heroSubcopy}
          </motion.p>

          {/* audience pill */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="pointer-events-auto mt-6 md:mt-10 flex w-[300px] md:w-[380px] cursor-default items-center justify-center rounded-full border border-slate-200 bg-white/70 py-2 shadow-sm backdrop-blur-md"
          >
            <p className="text-[12px] md:text-[14px] font-medium tracking-wide text-[#0020d7]">
              {data.heroAvailabilityText}
            </p>
          </motion.div>

          {/* CTA buttons — Figma pill style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="pointer-events-auto relative z-20 mt-6 md:mt-8 flex flex-col items-center gap-4"
          >
            {/* Desktop Buttons */}
            <div className="hidden md:flex flex-row gap-4">
              <MagneticButton
                href={homeLinks.pageLinks.projects || data.heroCtaPrimaryUrl}
                label={data.heroCtaPrimaryLabel}
                icon={ArrowUpRight}
              />
              <MagneticButton
                href={data.heroCtaSecondaryUrl}
                label={data.heroCtaSecondaryLabel}
                icon={Calendar}
                secondary
              />
            </div>

            {/* Mobile Buttons: View Projects + Resume */}
            <div className="flex md:hidden flex-row gap-3">
              <MagneticButton
                href={homeLinks.pageLinks.projects || data.heroCtaPrimaryUrl}
                label={siteCopy.heroMobileCtaLabel}
                icon={ArrowUpRight}
              />
              <ResumeDropdown 
                align="center"
                designerResumeLabel={siteCopy.designerResumeLabel}
                designerResumeDesc={siteCopy.designerResumeDesc}
                developerResumeLabel={siteCopy.developerResumeLabel}
                developerResumeDesc={siteCopy.developerResumeDesc}
                dropdownTitle={siteCopy.resumeDropdownTitle}
              >
                <MagneticButton
                  href="#"
                  label={siteCopy.heroMobileResumeLabel}
                  icon={ArrowUpRight}
                  secondary
                />
              </ResumeDropdown>
            </div>

            <p className="mt-5 flex max-w-[280px] md:max-w-none items-center justify-center gap-2 text-center text-sm text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              {statusLine}
            </p>
          </motion.div>

          {/* social icon tiles */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pointer-events-auto relative z-10 mt-8 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-6"
          >
            {[
              ...(Object.keys(homeLinks.socialLinks) as Array<keyof HomeContent['socialLinks']>).map((key) => ({
                key,
                icon: socialIconMap[key],
                label: socialLabelMap[key],
                href: homeLinks.socialLinks[key],
              })),
              ...(homeLinks.otherSocialLinks || []).map((item) => ({
                key: item.id,
                icon: ArrowUpRight,
                label: item.label,
                href: item.url,
              })),
            ]
              .filter((item) => item.href)
              .map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: 0.8 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  <SocialTile
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    rotate={index % 2 === 0 ? -10 : 10}
                  />
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    </div>

  </section>
);
};

export default memo(Herosection);
