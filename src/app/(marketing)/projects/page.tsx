import type { Metadata } from 'next';
import ProjectsPageShell from '@/components/projects/ProjectsPageShell';
import type { WorkspaceFilter } from '@/components/projects/WorkspaceProjectsSection';
import {
  getConfiguredGithubSourceUrl,
  getAllProjects,
} from '@/lib/github-projects';
import { getBehanceShowcaseEmbeds } from '@/lib/site-content';
import { createPageMetadata } from '@/seo/page-metadata';

interface ProjectsPageProps {
  searchParams: Promise<{ workspace?: string }>;
}

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Explore web apps, AI integrations, and UI/UX work built with React, Next.js, and Figma. Browse open-source projects and live demos.",
  path: "/projects",
  keywords: [
    "Abin Varghese projects",
    "Next.js project portfolio",
    "React web app projects",
    "AI integration projects",
    "Open source Next.js apps",
    "UI/UX design portfolio",
    "Figma design projects",
    "Front-end developer portfolio",
  ],
});

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { workspace } = await searchParams;
  const initialWorkspace: WorkspaceFilter =
    workspace === 'designing' ? 'designing' : 'coding';

  const [projects, githubSourceUrl, behanceShowcaseEmbeds] = await Promise.all([
    getAllProjects(),
    Promise.resolve(getConfiguredGithubSourceUrl()),
    getBehanceShowcaseEmbeds(),
  ]);

  return (
    <ProjectsPageShell
      projects={projects}
      sourceUrl={githubSourceUrl}
      initialWorkspace={initialWorkspace}
      behanceShowcaseEmbeds={behanceShowcaseEmbeds}
    />
  );
}
