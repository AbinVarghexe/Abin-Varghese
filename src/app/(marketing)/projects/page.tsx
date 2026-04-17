import type { Metadata } from 'next';
import ProjectsPageShell from '@/components/projects/ProjectsPageShell';
import type { WorkspaceFilter } from '@/components/projects/WorkspaceProjectsSection';
import {
  getConfiguredGithubSourceUrl,
  getAllProjects,
} from '@/lib/github-projects';
import { createPageMetadata } from '@/seo/page-metadata';

interface ProjectsPageProps {
  searchParams: Promise<{ workspace?: string }>;
}

export const metadata: Metadata = createPageMetadata({
  title: "Projects | Abin Varghese",
  description:
    "Discover web apps, AI integrations, and portfolio designs built with React and Next.js. Explore Abin Varghese's portfolio of front-end development projects.",
  path: "/projects",
});

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { workspace } = await searchParams;
  const initialWorkspace: WorkspaceFilter =
    workspace === 'designing' ? 'designing' : 'coding';

  const projects = await getAllProjects();
  const githubSourceUrl = getConfiguredGithubSourceUrl();

  return (
    <ProjectsPageShell
      projects={projects}
      sourceUrl={githubSourceUrl}
      initialWorkspace={initialWorkspace}
    />
  );
}
