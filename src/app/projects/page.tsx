import type { Metadata } from 'next';
import ProjectsPageShell from '@/components/projects/ProjectsPageShell';
import type { WorkspaceFilter } from '@/components/projects/WorkspaceProjectsSection';
import {
  getConfiguredGithubSourceUrl,
  getGithubWorkspaceProjects,
} from '@/lib/github-projects';

interface ProjectsPageProps {
  searchParams: Promise<{ workspace?: string }>;
}

export const metadata: Metadata = {
  title: "Projects | Abin Varghese",
  description:
    "Discover web apps, AI integrations, and portfolio designs built with React and Next.js. Explore Abin Varghese's portfolio of front-end development projects.",
  openGraph: {
    title: "Projects | Abin Varghese",
    description:
      "Discover web apps, AI integrations, and portfolio designs built with React and Next.js.",
    url: "https://abinvarghese.me/projects",
  },
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { workspace } = await searchParams;
  const initialWorkspace: WorkspaceFilter =
    workspace === 'designing' ? 'designing' : 'coding';

  const projects = await getGithubWorkspaceProjects();
  const githubSourceUrl = getConfiguredGithubSourceUrl();

  return (
    <ProjectsPageShell
      projects={projects}
      sourceUrl={githubSourceUrl}
      initialWorkspace={initialWorkspace}
    />
  );
}
