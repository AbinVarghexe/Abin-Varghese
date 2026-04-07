"use client";

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Code2, Palette } from 'lucide-react';
import type { WorkspaceFilter } from '@/components/projects/WorkspaceProjectsSection';

interface ProjectsHeroBannerProps {
  workspace: WorkspaceFilter;
  onWorkspaceChange: (workspace: WorkspaceFilter) => void;
}

interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

const INITIAL_POINTER_STATE: PointerState = {
  x: 0,
  y: 0,
  active: false,
};

export default function ProjectsHeroBanner({
  workspace,
  onWorkspaceChange,
}: ProjectsHeroBannerProps) {
  const [pointer, setPointer] = useState<PointerState>(INITIAL_POINTER_STATE);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const normalizedY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    setPointer({
      x: Math.max(-1, Math.min(1, normalizedX)),
      y: Math.max(-1, Math.min(1, normalizedY)),
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPointer(INITIAL_POINTER_STATE);
  }, []);

  const sceneTransform = useMemo(() => {
    return `scale(1.015) rotateX(${(-pointer.y * 7).toFixed(2)}deg) rotateY(${(pointer.x * 10).toFixed(2)}deg)`;
  }, [pointer.x, pointer.y]);

  const backgroundTransform = useMemo(() => {
    return `translate3d(${(pointer.x * 5).toFixed(1)}px, ${(pointer.y * 4).toFixed(1)}px, 0) translateZ(-70px) scale(1.02)`;
  }, [pointer.x, pointer.y]);

  const middleTransform = useMemo(() => {
    return `translate3d(${(pointer.x * 10).toFixed(1)}px, ${(pointer.y * 8).toFixed(1)}px, 0) translateZ(12px) scale(1.018)`;
  }, [pointer.x, pointer.y]);

  const titleTransform = useMemo(() => {
    return `translate3d(${(pointer.x * 22).toFixed(1)}px, ${(pointer.y * 14).toFixed(1)}px, 0) translateZ(120px)`;
  }, [pointer.x, pointer.y]);

  const foregroundTransform = useMemo(() => {
    return `translate3d(${(pointer.x * 30).toFixed(1)}px, ${(pointer.y * 18).toFixed(1)}px, 0) translateZ(185px) scale(1.01)`;
  }, [pointer.x, pointer.y]);

  const highlightX = (50 + pointer.x * 20).toFixed(2);
  const highlightY = (36 + pointer.y * 16).toFixed(2);

  return (
    <section className="relative isolate border-y border-black/10 bg-[#f8f5f2]">
      <div className="mx-auto w-full max-w-[1540px] px-3 py-4 md:px-5 md:py-6">
        <div
          role="presentation"
          className="relative h-[330px] w-full overflow-hidden rounded-[28px] sm:h-[385px] md:h-[475px] lg:h-[535px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: '1600px' }}
        >
          <div
            className="absolute"
            style={{
              inset: '-3%',
              transform: sceneTransform,
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
              transition: pointer.active
                ? 'transform 90ms linear'
                : 'transform 460ms cubic-bezier(0.2, 0.7, 0.15, 1)',
              willChange: 'transform',
            }}
          >
            <Image
              src="/projectsection/Bg.png"
              alt="Project section landscape background"
              fill
              priority
              className="pointer-events-none object-cover"
              style={{
                transform: backgroundTransform,
                transition: pointer.active
                  ? 'transform 90ms linear'
                  : 'transform 450ms cubic-bezier(0.2, 0.7, 0.15, 1)',
              }}
            />

            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                transform: middleTransform,
                transition: pointer.active
                  ? 'transform 90ms linear'
                  : 'transform 450ms cubic-bezier(0.2, 0.7, 0.15, 1)',
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 78%)',
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 78%)',
              }}
            >
              <Image
                src="/projectsection/Bg.png"
                alt=""
                fill
                aria-hidden
                className="object-cover"
              />
            </div>

            <h1
              className="pointer-events-none absolute left-1/2 top-[35%] z-20 text-5xl font-black uppercase tracking-[-0.02em] text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] sm:text-6xl md:text-8xl lg:text-[8.5rem]"
              style={{
                color: '#ffffff',
                transform: `${titleTransform} translate(-50%, -50%)`,
                transition: pointer.active
                  ? 'transform 90ms linear'
                  : 'transform 420ms cubic-bezier(0.2, 0.7, 0.15, 1)',
              }}
            >
              Projects.
            </h1>

            <Image
              src="/projectsection/computer.png"
              alt="Retro computer model"
              fill
              className="pointer-events-none absolute inset-0 z-30 object-cover"
              style={{
                transform: foregroundTransform,
                transition: pointer.active
                  ? 'transform 90ms linear'
                  : 'transform 450ms cubic-bezier(0.2, 0.7, 0.15, 1)',
              }}
            />

            <div
              className="pointer-events-none absolute inset-0 z-40"
              style={{
                background: `radial-gradient(circle at ${highlightX}% ${highlightY}%, rgba(255,255,255,0.28), rgba(255,255,255,0) 46%)`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 z-40 bg-linear-to-b from-black/8 via-transparent to-black/18" />
          </div>

          <div className="absolute inset-x-0 bottom-4 z-50 px-4 md:bottom-5">
            <div className="mx-auto w-fit rounded-[22px] border border-white/40 bg-white/20 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="flex w-fit flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onWorkspaceChange('coding')}
                  className="group inline-flex items-center gap-2.5 rounded-full border-2 border-[#929292] py-1.5 pl-4 pr-1.5 text-[13px] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={
                    workspace === 'coding'
                      ? {
                          color: '#ffffff',
                          background: 'linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)',
                          boxShadow: '0 14px 32px rgba(0,32,215,0.32)',
                        }
                      : {
                          color: '#1e293b',
                          background: '#ffffff',
                          boxShadow: '0 10px 22px rgba(0,0,0,0.14)',
                        }
                  }
                  aria-label="Switch to coding workspace"
                >
                  <span className="min-w-[72px] text-center">Coding</span>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45"
                    style={{ background: workspace === 'coding' ? '#ffffff' : '#e2e8f0' }}
                  >
                    <Code2
                      className="h-4 w-4"
                      style={{ color: workspace === 'coding' ? '#0020d7' : '#1e293b' }}
                      strokeWidth={2.3}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onWorkspaceChange('designing')}
                  className="group inline-flex items-center gap-2.5 rounded-full border-2 border-[#929292] py-1.5 pl-4 pr-1.5 text-[13px] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={
                    workspace === 'designing'
                      ? {
                          color: '#ffffff',
                          background: 'linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)',
                          boxShadow: '0 14px 32px rgba(0,32,215,0.32)',
                        }
                      : {
                          color: '#1e293b',
                          background: '#ffffff',
                          boxShadow: '0 10px 22px rgba(0,0,0,0.14)',
                        }
                  }
                  aria-label="Switch to designing workspace"
                >
                  <span className="min-w-[72px] text-center">Designing</span>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45"
                    style={{ background: workspace === 'designing' ? '#ffffff' : '#e2e8f0' }}
                  >
                    <Palette
                      className="h-4 w-4"
                      style={{ color: workspace === 'designing' ? '#0020d7' : '#1e293b' }}
                      strokeWidth={2.3}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
