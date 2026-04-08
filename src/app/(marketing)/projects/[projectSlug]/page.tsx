import type { Metadata } from 'next';
import Link from 'next/link';
import { Github, Globe, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProjectPreviewImage from '@/components/projects/ProjectPreviewImage';
import LiveProjectFrame from '@/components/projects/LiveProjectFrame';
import {
  getGithubWorkspaceProjectBySlug,
  getGithubWorkspaceProjects,
  type WorkspaceProject,
} from '@/lib/github-projects';
import { createPageMetadata } from '@/seo/page-metadata';
import { BreadcrumbSchema, SoftwareProjectSchema } from '@/seo/schema';

interface PageProps {
  params: Promise<{ projectSlug: string }>;
  searchParams: Promise<{ from?: string; workspace?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = await getGithubWorkspaceProjectBySlug(projectSlug);

  if (!project) {
    return createPageMetadata({
      title: 'Project Not Found | Abin Varghese',
      description: 'This project could not be loaded from GitHub.',
      path: '/projects',
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${project.title} | Projects | Abin Varghese`,
    description: project.description,
    path: `/projects/${encodeURIComponent(project.slug)}`,
    image: project.imageUrl,
    keywords: project.tags,
    type: "article",
  });
}

function scoreProjectRelation(current: WorkspaceProject, candidate: WorkspaceProject) {
  const currentTags = current.tags.map((tag) => tag.toLowerCase());
  const candidateTags = candidate.tags.map((tag) => tag.toLowerCase());
  const overlap = candidateTags.filter((tag) => currentTags.includes(tag)).length;
  const sameWorkspace = current.workspace === candidate.workspace ? 2 : 0;

  return overlap * 3 + sameWorkspace;
}

function RelatedProjectCard({ project }: { project: WorkspaceProject }) {
  const fallbackSrc = `https://opengraph.githubassets.com/portfolio/${project.owner}/${project.repo}`;

  return (
    <article className="group overflow-hidden rounded-xl border border-black/10 bg-white">
      <Link href={`/projects/${encodeURIComponent(project.slug)}`} className="block">
        <div className="relative h-44 w-full overflow-hidden">
          <ProjectPreviewImage
            src={project.imageUrl}
            fallbackSrc={fallbackSrc}
            alt={`${project.title} preview`}
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover object-top transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-1 text-base font-semibold text-zinc-900">{project.title}</h3>
          <p className="line-clamp-2 text-sm text-zinc-600">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {(project.tags.length ? project.tags : ['repository']).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default async function ProjectDetailPage({ params, searchParams }: PageProps) {
  const { projectSlug } = await params;
  const { from, workspace } = await searchParams;
  const project = await getGithubWorkspaceProjectBySlug(projectSlug);

  if (!project) {
    notFound();
  }

  const updatedOn = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(project.updatedAt));

  const allProjects = await getGithubWorkspaceProjects();

  const relatedProjects = allProjects
    .filter((candidate) => candidate.slug !== project.slug)
    .map((candidate) => ({
      project: candidate,
      score: scoreProjectRelation(project, candidate),
    }))
    .sort((a, b) => b.score - a.score || b.project.stars - a.project.stars)
    .map((entry) => entry.project)
    .slice(0, 6);

  const backHref =
    from === 'projects' && workspace === 'designing'
      ? '/projects?workspace=designing'
      : '/projects';
  const fallbackSrc = `https://opengraph.githubassets.com/portfolio/${project.owner}/${project.repo}`;

  return (
    <main className="min-h-screen bg-[#f8f5f2] px-3 pb-14 pt-24 sm:px-5 lg:px-8">
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${encodeURIComponent(project.slug)}` },
        ]}
      />
      <SoftwareProjectSchema
        name={project.title}
        description={project.description}
        path={`/projects/${encodeURIComponent(project.slug)}`}
        image={project.imageUrl}
        keywords={project.tags}
        codeRepository={project.githubUrl}
        liveUrl={project.liveUrl}
        dateModified={project.updatedAt}
      />
      <div className="mx-auto w-[min(100%,1360px)]">
        <Link
          href={backHref}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            {/* Hero preview: live iframe if liveUrl is set, otherwise GitHub OG banner */}
            <div className="w-full overflow-hidden rounded-xl border border-black/10 bg-zinc-200">
              {project.liveUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-xl" style={{ borderRadius: '0.75rem' }}>
                  <LiveProjectFrame
                    url={project.liveUrl}
                    title={project.title}
                    fallbackImage={project.imageUrl || fallbackSrc}
                    isInteractive
                    borderRadius="0.75rem"
                  />
                </div>
              ) : (
                <div className="relative min-h-[360px] md:min-h-[520px]">
                  <ProjectPreviewImage
                    src={project.imageUrl}
                    fallbackSrc={fallbackSrc}
                    alt={`${project.title} preview image`}
                    sizes="(max-width: 1280px) 100vw, 66vw"
                    className="object-cover object-top"
                    priority
                  />
                </div>
              )}
            </div>

            <div className="mt-5 rounded-xl border border-black/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Project Overview
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-4 text-sm leading-7 text-zinc-700 sm:text-base">
                {project.description}
              </p>
            </div>
          </div>

          <aside className="space-y-4 xl:col-span-4">
            <article className="rounded-xl border border-black/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Project Links
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    <Globe className="h-4 w-4" />
                    View Live Website
                  </a>
                ) : (
                  <div className="inline-flex items-center justify-center rounded-xl border border-dashed border-black/15 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-500">
                    Live website not available
                  </div>
                )}

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/15 bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-200"
                >
                  <Github className="h-4 w-4" />
                  View GitHub Repository
                </a>
              </div>
            </article>

            <article className="rounded-xl border border-black/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Tech Stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(project.tags.length > 0 ? project.tags : ['repository']).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-black/10 bg-zinc-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-black/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Repository Snapshot
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-3 text-sm text-zinc-600">
                <span>Stars</span>
                <span className="text-right font-semibold text-zinc-900">{project.stars}</span>
                <span>Updated</span>
                <span className="text-right font-semibold text-zinc-900">{updatedOn}</span>
                <span>Owner</span>
                <span className="text-right font-semibold text-zinc-900">{project.owner}</span>
                <span>Repository</span>
                <span className="text-right font-semibold text-zinc-900">{project.repo}</span>
              </div>
            </article>
          </aside>
        </section>

        {relatedProjects.length > 0 ? (
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900">More Coding Projects</h2>
              <span className="text-sm text-zinc-500">Related by stack and workspace</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {relatedProjects.map((candidate) => (
                <RelatedProjectCard key={candidate.id} project={candidate} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-xl border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500">
            <span>
              You are viewing the coding-focused project stack for {project.title}.
            </span>
            <div className="flex flex-wrap gap-2">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  <Globe className="h-4 w-4" />
                  Live
                </a>
              ) : null}

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-200"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
