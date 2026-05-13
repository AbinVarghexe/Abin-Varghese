"use client";

import { useState } from 'react';
import WorkspaceProjectsSection, {
  type WorkspaceFilter,
} from '@/components/projects/WorkspaceProjectsSection';
import ProjectsHeroBanner from '@/components/projects/ProjectsHeroBanner';
import type { WorkspaceProject } from '@/lib/github-projects';
import type { BehanceShowcaseEmbed } from '@/lib/site-content';

interface ProjectsPageShellProps {
  projects: WorkspaceProject[];
  sourceUrl: string;
  initialWorkspace: WorkspaceFilter;
  behanceShowcaseEmbeds: BehanceShowcaseEmbed[];
}

export default function ProjectsPageShell({
  projects,
  sourceUrl,
  initialWorkspace,
  behanceShowcaseEmbeds,
}: ProjectsPageShellProps) {
  const [workspace, setWorkspace] = useState<WorkspaceFilter>(initialWorkspace);

  return (
    <main className="min-h-screen bg-[#f8f5f2]">
      <ProjectsHeroBanner
        workspace={workspace}
        onWorkspaceChange={setWorkspace}
      />

      <WorkspaceProjectsSection
        projects={projects}
        sourceUrl={sourceUrl}
        workspace={workspace}
        behanceShowcaseEmbeds={behanceShowcaseEmbeds}
      />
    </main>
  );
}