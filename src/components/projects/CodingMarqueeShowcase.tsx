import { motion } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';
import type { WorkspaceProject } from '@/lib/github-projects';
import ProjectPreviewImage from '@/components/projects/ProjectPreviewImage';

interface CodingMarqueeShowcaseProps {
  projects: WorkspaceProject[];
}

export default function CodingMarqueeShowcase({ projects }: CodingMarqueeShowcaseProps) {
  const liveProjects = projects.filter(p => !!p.liveUrl && p.isFromDb);

  if (!liveProjects || liveProjects.length === 0) {
    return null;
  }

  const firstRowProjects = liveProjects.slice(0, Math.ceil(liveProjects.length / 2));
  const secondRowProjects = Math.ceil(liveProjects.length / 2) < liveProjects.length 
    ? liveProjects.slice(Math.ceil(liveProjects.length / 2)) 
    : liveProjects;

  const fillRow = (rowItems: WorkspaceProject[]) => {
    let filled = [...rowItems];
    while (filled.length > 0 && filled.length < 6) {
      filled = [...filled, ...rowItems];
    }
    return filled;
  };

  const row1 = fillRow(firstRowProjects);
  const row2 = fillRow(secondRowProjects);

  const renderProjectCard = (project: WorkspaceProject, idx: number, rowIdx: number) => {
    const key = `${project.id}-row${rowIdx}-${idx}`;
    return (
      <div 
        key={key}
        className="group flex-shrink-0 w-[420px] md:w-[680px] overflow-hidden rounded-[32px] bg-white p-2 md:p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/10 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
      >
        {/* Media Container - Balanced 16/8 Aspect Ratio with Asymmetrical Corners */}
        <div className="relative aspect-[16/8] w-full rounded-[26px] rounded-bl-none overflow-hidden bg-zinc-50 border border-black/5">
          <ProjectPreviewImage
            src={project.imageUrl}
            fallbackSrc={`https://opengraph.githubassets.com/portfolio/${project.owner}/${project.repo}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={project.title}
          />
        </div>

        {/* Info & Actions Container - Micro Typography */}
        <div className="mt-4 flex items-end justify-between gap-4 px-3 pb-2">
          <div className="flex flex-col gap-0.5 max-w-[55%]">
            <h3 className="text-base md:text-lg font-extrabold tracking-tight text-[#0b1034] truncate">
              {project.title}
            </h3>
            <p className="text-[12px] md:text-[13px] text-zinc-500 line-clamp-1 font-medium">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.a 
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1, backgroundColor: '#000', color: '#fff', borderColor: '#000' }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-full border border-black/10 text-zinc-500 transition-colors no-underline"
              title="View Github"
            >
              <Github size={18} />
            </motion.a>
            {project.liveUrl && (
              <motion.a 
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, boxShadow: '0 12px 28px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 rounded-full border-[1.8px] border-[#929292] pl-3.5 pr-1 py-1 no-underline whitespace-nowrap"
                style={{
                  background: 'linear-gradient(180deg, #484848 0%, #333333 100%)',
                }}
              >
                <span className="text-[10px] md:text-[11px] font-medium text-white tracking-wide">
                  Live Preview
                </span>
                <motion.div
                  whileHover={{ rotate: 45 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-white shadow-sm"
                >
                  <ArrowUpRight size={11} className="text-[#333333]" strokeWidth={2.8} />
                </motion.div>
              </motion.a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden py-10 md:py-16"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-scroll {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
        .animate-marquee-scroll-reverse {
          animation: marquee-reverse 60s linear infinite;
        }
        .animate-marquee-scroll-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>



      <div className="relative w-full flex flex-col gap-8 md:gap-12 overflow-hidden">
        {/* Row 1: Normal Direction */}
        <div className="flex w-fit animate-marquee-scroll gap-6 md:gap-12 px-6 md:px-12">
          {row1.map((project, idx) => renderProjectCard(project, idx, 1))}
          {row1.map((project, idx) => renderProjectCard(project, idx + row1.length, 1))}
        </div>
        
        {/* Row 2: Reverse Direction */}
        <div className="flex w-fit animate-marquee-scroll-reverse gap-6 md:gap-12 px-6 md:px-12">
          {row2.map((project, idx) => renderProjectCard(project, idx, 2))}
          {row2.map((project, idx) => renderProjectCard(project, idx + row2.length, 2))}
        </div>
      </div>
    </div>
  );
}
