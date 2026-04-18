"use client";

import React from 'react';
import {
  IconBrandReact,
  IconBrandNextjs,
  IconBrandTailwind,
  IconBrandTypescript,
  IconBrandNodejs,
  IconBrandSupabase,
  IconBrandFramer,
  IconBrandGithub,
  IconBrandVercel,
  IconBrandThreejs,
  IconBrandPrisma,
  IconBrandSass,
  IconBrandFigma,
  IconBrandDocker,
  IconBrandFirebase,
} from '@tabler/icons-react';

const TECH_STACK = [
  { name: 'React', icon: IconBrandReact },
  { name: 'Next.js', icon: IconBrandNextjs },
  { name: 'TypeScript', icon: IconBrandTypescript },
  { name: 'Tailwind CSS', icon: IconBrandTailwind },
  { name: 'Node.js', icon: IconBrandNodejs },
  { name: 'Supabase', icon: IconBrandSupabase },
  { name: 'Framer', icon: IconBrandFramer },
  { name: 'Three.js', icon: IconBrandThreejs },
  { name: 'Prisma', icon: IconBrandPrisma },
  { name: 'Firebase', icon: IconBrandFirebase },
  { name: 'Sass', icon: IconBrandSass },
  { name: 'Docker', icon: IconBrandDocker },
  { name: 'Figma', icon: IconBrandFigma },
  { name: 'Vercel', icon: IconBrandVercel },
  { name: 'GitHub', icon: IconBrandGithub },
];

export default function TechStackMarquee() {
  const fullStack = [...TECH_STACK, ...TECH_STACK, ...TECH_STACK]; // Multiply for seamless loop

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden py-6">
      <style jsx global>{`
        @keyframes tech-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-tech-marquee {
          animation: tech-marquee 40s linear infinite;
        }
        .animate-tech-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex w-fit animate-tech-marquee gap-16 px-16 items-center">
        {fullStack.map((tech, idx) => {
          const Icon = tech.icon;
          return (
            <div 
              key={`${tech.name}-${idx}`} 
              className="group flex items-center gap-3 transition-colors duration-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-black/5 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-md">
                <Icon size={22} className="text-zinc-400 transition-colors duration-300 group-hover:text-blue-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 transition-colors duration-300 group-hover:text-zinc-900">
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
