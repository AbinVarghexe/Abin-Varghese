'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Hover state → transform config ───────────────────────────
 * IMPORTANT: transformOrigin is set ONCE on mount via gsap.set
 * and is NEVER included in any tween.  Changing transformOrigin
 * mid-tween shifts the pivot point causing visible jitter.
───────────────────────────────────────────────────────────── */
type CardId = 'left' | 'right' | 'center';
type State  = 'default' | 'hover';

// no transformOrigin in any config entry
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

export default function AboutSection() {
  const textRef   = useRef<HTMLDivElement>(null);
  const stackRef  = useRef<HTMLDivElement>(null);
  const leftRef   = useRef<HTMLDivElement>(null);
  const rightRef  = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const refMap: Record<CardId, React.RefObject<HTMLDivElement | null>> = {
    left: leftRef, right: rightRef, center: centerRef,
  };

  /* ──────────────────────────────────────────────────────────
   * applyState — fires on every hover event
   * overwrite: 'auto' ensures any in-progress tween on the
   * same properties is killed before the new one starts.
   * Without this, 3+ concurrent tweens fight and produce jitter.
   ────────────────────────────────────────────────────────── */
  const applyState = useCallback((state: State) => {
    const cfg = CONFIG[state];
    (['left', 'right', 'center'] as const).forEach((id) => {
      const el = refMap[id].current;
      if (!el) return;
      gsap.to(el, {
        ...cfg[id],
        ease: EASE,
        duration: DUR,
        overwrite: 'auto',   // ← kills any conflicting in-progress tween
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ──────────────────────────────────────────────────────────
   * Mount effect — wrapped in gsap.context so React strict-mode
   * double-invoke is handled cleanly (ctx.revert() kills
   * everything atomically instead of killing mid-tween).
   ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const left   = leftRef.current;
    const right  = rightRef.current;
    const center = centerRef.current;
    const stack  = stackRef.current;
    const text   = textRef.current;
    if (!left || !right || !center || !stack || !text) return;

    const ctx = gsap.context(() => {

      /* 1. Set transformOrigin ONCE — pivot point never changes.
            Never include transformOrigin inside a gsap.to(); it
            shifts the pivot while the card is moving = jitter. */
      gsap.set([left, right, center], { transformOrigin: 'bottom center' });

      /* 2. Apply default fan positions immediately */
      const def = CONFIG.default;
      gsap.set(left,   def.left);
      gsap.set(right,  def.right);
      gsap.set(center, def.center);

      /* 3. Hide stack until entrance animation fires */
      gsap.set(stack, { opacity: 0 });

      /* 4. Text slide-in */
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

      /* 5. Card "deal" entrance — fires once when stack enters viewport */
      ScrollTrigger.create({
        trigger: stack,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          /* Collapse all cards to center first */
          gsap.set([left, right, center], {
            opacity: 0, scale: 0.5, rotation: 0, x: 0, y: 0,
          });
          gsap.set(stack, { opacity: 1 });

          const tl = gsap.timeline();

          /* Center pops in */
          tl.to(center, {
            opacity: 1, scale: 1, rotation: 0, x: 0, y: 0,
            duration: 0.52, ease: 'back.out(1.6)',
            overwrite: 'auto',
          });

          /* Left fans out */
          tl.to(left, {
            ...CONFIG.default.left,
            duration: 0.48, ease: 'back.out(1.4)',
            overwrite: 'auto',
          }, '-=0.22');

          /* Right fans out */
          tl.to(right, {
            ...CONFIG.default.right,
            duration: 0.48, ease: 'back.out(1.4)',
            overwrite: 'auto',
          }, '-=0.36');
        },
      });

    }); // end gsap.context

    return () => ctx.revert(); // clean up all tweens + ScrollTriggers atomically

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      id="about"
      className="relative z-20 w-full px-4 md:px-8 lg:px-20 py-16 md:py-28 overflow-visible pointer-events-none"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Faint bg sparkle */}
      <div aria-hidden className="pointer-events-none select-none absolute" style={{
        top: '-40px', right: '-20px', fontSize: '260px', fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        background: 'linear-gradient(208.44deg,#5b74ff 5%,#001bb0 84%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1, filter: 'blur(4px)', opacity: 0.16, userSelect: 'none', zIndex: 0,
      }}>✧</div>

      <div className="relative z-20 max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* ── Left column: text ── */}
        <div ref={textRef} className="flex flex-col gap-6 w-full lg:w-[55%] pointer-events-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
            About <span className="text-blue-600 font-serif italic font-medium">Me</span>
          </h2>

          <p className="text-black/70 text-lg leading-relaxed max-w-[560px]">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting, remaining
            essentially unchanged.
          </p>

          <Link
            href="/about"
            className="self-start group inline-flex items-center no-underline pointer-events-auto"
            style={{
              gap: '15.945px',
              background: 'var(--gradient-gray)',
              border: '2.657px solid var(--color-border-light)',
              borderRadius: 'var(--radius-full)',
              padding: '9.744px 9.744px 9.744px 31.004px',
              fontFamily: 'var(--font-sans)', fontWeight: 500,
              fontSize: '15px', color: '#fff', textDecoration: 'none',
              transition: 'box-shadow 300ms ease, transform 200ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '0 14px 36px rgba(0,0,0,0.22)';
              el.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = 'none';
              el.style.transform = 'scale(1)';
            }}
          >
            <span style={{ minWidth: '80px', textAlign: 'center' }}>More about</span>
            <span
              className="flex items-center justify-center bg-white rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
              style={{ width: '46.949px', height: '46.949px' }}
            >
              <ArrowUpRight className="text-[#0b0b0c]" style={{ width: '18px', height: '18px' }} strokeWidth={2.2} />
            </span>
          </Link>
        </div>

        {/* ── Right column: interactive card fan ── */}
        <div className="w-full lg:w-[45%] flex items-center justify-center" style={{ minHeight: '460px' }}>
          <div
            ref={stackRef}
            className="relative pointer-events-auto"
            style={{ width: '300px', height: '390px', cursor: 'default', overflow: 'visible' }}
            onMouseEnter={() => applyState('hover')}
            onMouseLeave={() => applyState('default')}
          >

            {/* Left card */}
            <div
              ref={leftRef}
              className="absolute inset-0"
              style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 28px rgba(0,0,0,0.22)' }}
            >
              <Image src="/about/Abin_2.png" alt="" fill className="object-cover object-top" sizes="300px" />
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '12px',
                background: 'rgba(0,0,0,0.22)', transition: 'opacity 0.35s ease',
              }} />
            </div>

            {/* Right card */}
            <div
              ref={rightRef}
              className="absolute inset-0"
              style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 28px rgba(0,0,0,0.22)' }}
            >
              <Image src="/about/Abin_3.png" alt="" fill className="object-cover object-top" sizes="300px" />
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '12px',
                background: 'rgba(0,0,0,0.22)', transition: 'opacity 0.35s ease',
              }} />
            </div>

            {/* Center card — prominently on top */}
            <div
              ref={centerRef}
              className="absolute inset-0"
              style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 18px 52px rgba(0,0,0,0.34)' }}
            >
              <Image src="/about/About_Image.png" alt="Abin Varghese" fill className="object-cover object-top" sizes="300px" priority />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
