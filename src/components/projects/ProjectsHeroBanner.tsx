"use client";

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Code2, Github, Palette } from 'lucide-react';
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

          {/* GitHub Profile Button */}
          <div className="absolute top-4 right-4 z-[60] md:top-6 md:right-6 lg:top-8 lg:right-8">
            <a 
              href="https://github.com/AbinVarghexe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/20 shadow-lg backdrop-blur-xl transition-all hover:bg-white hover:scale-110 pointer-events-auto"
              aria-label="Visit GitHub Profile"
            >
              <Github className="h-5 w-5 text-white group-hover:text-black transition-colors group-hover:rotate-12" />
            </a>
          </div>

          <div className="absolute inset-x-0 bottom-4 z-50 px-4 md:bottom-5">
            <div className="mx-auto w-fit rounded-[24px] border border-white/40 bg-white/20 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="flex w-fit flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onWorkspaceChange('coding')}
                  className="group inline-flex items-center no-underline transition-all duration-300 cursor-pointer"
                  style={
                    workspace === 'coding'
                      ? {
                          gap: '10px',
                          background: 'linear-gradient(208.44deg, #444 5%, #111 84%)',
                          border: '1.5px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '9999px',
                          padding: '6px 6px 6px 20px',
                          fontFamily: 'inherit',
                          fontWeight: 500,
                          fontSize: '13px',
                          color: '#fff',
                          boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
                        }
                      : {
                          gap: '10px',
                          background: '#ffffff',
                          border: '1.5px solid transparent',
                          borderRadius: '9999px',
                          padding: '6px 6px 6px 20px',
                          fontFamily: 'inherit',
                          fontWeight: 500,
                          fontSize: '13px',
                          color: '#1e293b',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }
                  }
                  onMouseEnter={(event) => {
                    const element = event.currentTarget as HTMLElement;
                    element.style.transform = 'scale(1.03) translateY(-2px)';
                  }}
                  onMouseLeave={(event) => {
                    const element = event.currentTarget as HTMLElement;
                    element.style.transform = 'scale(1) translateY(0px)';
                  }}
                  aria-label="Switch to coding workspace"
                >
                  <span className="min-w-[64px] text-center">Coding</span>
                  <span
                    className="flex items-center justify-center rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      background: workspace === 'coding' ? '#ffffff' : '#f1f5f9'
                    }}
                  >
                    <Code2 
                      className="w-4 h-4" 
                      strokeWidth={2.2} 
                      style={{ color: workspace === 'coding' ? '#111' : '#1e293b' }} 
                    />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onWorkspaceChange('designing')}
                  className="group inline-flex items-center no-underline transition-all duration-300 cursor-pointer"
                  style={
                    workspace === 'designing'
                      ? {
                          gap: '10px',
                          background: 'linear-gradient(208.44deg, #444 5%, #111 84%)',
                          border: '1.5px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '9999px',
                          padding: '6px 6px 6px 20px',
                          fontFamily: 'inherit',
                          fontWeight: 500,
                          fontSize: '13px',
                          color: '#fff',
                          boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
                        }
                      : {
                          gap: '10px',
                          background: '#ffffff',
                          border: '1.5px solid transparent',
                          borderRadius: '9999px',
                          padding: '6px 6px 6px 20px',
                          fontFamily: 'inherit',
                          fontWeight: 500,
                          fontSize: '13px',
                          color: '#1e293b',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }
                  }
                  onMouseEnter={(event) => {
                    const element = event.currentTarget as HTMLElement;
                    element.style.transform = 'scale(1.03) translateY(-2px)';
                  }}
                  onMouseLeave={(event) => {
                    const element = event.currentTarget as HTMLElement;
                    element.style.transform = 'scale(1) translateY(0px)';
                  }}
                  aria-label="Switch to designing workspace"
                >
                  <span className="min-w-[64px] text-center">Designing</span>
                  <span
                    className="flex items-center justify-center rounded-full shrink-0 transition-transform duration-300 group-hover:rotate-45"
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      background: workspace === 'designing' ? '#ffffff' : '#f1f5f9'
                    }}
                  >
                    <Palette 
                      className="w-4 h-4" 
                      strokeWidth={2.2} 
                      style={{ color: workspace === 'designing' ? '#111' : '#1e293b' }} 
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
