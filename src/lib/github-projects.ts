import { posix } from 'path';
import { supabase } from '@/lib/supabase';

type WorkspaceType = 'coding' | 'designing';

interface GitHubRepoOwner {
  login: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  topics?: string[];
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  owner: GitHubRepoOwner;
}

interface GitHubReadmeResponse {
  content?: string;
  encoding?: string;
  path?: string;
}

export interface WorkspaceProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string | null;
  tags: string[];
  workspace: WorkspaceType;
  stars: number;
  updatedAt: string;
  owner: string;
  repo: string;
  isFromDb?: boolean;
}

const FALLBACK_GITHUB_SOURCE = 'https://github.com/AbinVarghexe';

const DESIGN_KEYWORDS = [
  'design',
  'figma',
  'ui',
  'ux',
  'branding',
  'motion',
  'animation',
  '3d',
  'poster',
  'graphic',
  'visual',
  'dribbble',
  'behance',
];

const README_IMAGE_HINT_KEYWORDS = [
  'banner',
  'cover',
  'hero',
  'preview',
  'screenshot',
  'showcase',
  'demo',
];

const README_BADGE_HINT_KEYWORDS = [
  'badge',
  'shields.io',
  'readme-stats',
  'visitor',
  'license',
  'build',
  'workflow',
  'contributors',
  'forks',
  'stars',
  'actions/workflows',
];

const SAFE_PROJECT_IMAGE_HOSTS = new Set([
  'opengraph.githubassets.com',
  'raw.githubusercontent.com',
  'user-images.githubusercontent.com',
  'camo.githubusercontent.com',
  'github.com',
]);

const BADGE_HOSTS = new Set([
  'img.shields.io',
  'shields.io',
  'badgen.net',
]);

function createGithubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function toTitleCase(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(' ');
}

function normalizeLiveUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `https://${value}`;
}

function inferWorkspace(repo: GitHubRepo): WorkspaceType {
  const fingerprint = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase();

  return DESIGN_KEYWORDS.some((keyword) => fingerprint.includes(keyword))
    ? 'designing'
    : 'coding';
}

function getProjectDescription(repo: GitHubRepo): string {
  if (repo.description && repo.description.trim().length > 0) {
    return repo.description;
  }

  return 'Project details are maintained in this repository.';
}

function buildSlug(owner: string, repo: string): string {
  return `${owner}--${repo}`;
}

function parseSlug(slug: string): { owner: string; repo: string } | null {
  let decodedSlug = slug;

  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  const [owner, ...repoParts] = decodedSlug.split('--');

  if (!owner || repoParts.length === 0) {
    return null;
  }

  return {
    owner,
    repo: repoParts.join('--'),
  };
}

function buildFallbackProject(owner: string, repo: string): WorkspaceProject {
  const fullName = `${owner}/${repo}`;

  return {
    id: fullName,
    slug: buildSlug(owner, repo),
    title: toTitleCase(repo),
    description: 'Repository details are temporarily unavailable. Open the repository to view full information.',
    imageUrl: `https://opengraph.githubassets.com/portfolio/${fullName}`,
    githubUrl: `https://github.com/${fullName}`,
    liveUrl: null,
    tags: ['repository'],
    workspace: 'coding',
    stars: 0,
    updatedAt: new Date().toISOString(),
    owner,
    repo,
  };
}

function parseOwnerFromSource(source: string): string {
  const trimmed = source.trim();

  if (/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(trimmed)) {
    return trimmed;
  }

  if (/^[a-z\d](?:[a-z\d-]{0,38})\/[\w.-]+$/i.test(trimmed)) {
    return trimmed.split('/')[0];
  }

  try {
    const withProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    const segments = parsed.pathname.split('/').filter(Boolean);

    if (parsed.hostname.includes('github.com') && segments.length > 0) {
      return segments[0];
    }
  } catch {
    return 'AbinVarghexe';
  }

  return 'AbinVarghexe';
}

function hasSupportedImageExtension(url: string): boolean {
  return /\.(png|jpe?g|gif|webp|svg)(?:\?|$)/i.test(url);
}

function getUrlHostname(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isSafeProjectImageHost(url: string): boolean {
  const hostname = getUrlHostname(url);
  if (!hostname) {
    return false;
  }

  return SAFE_PROJECT_IMAGE_HOSTS.has(hostname);
}

function isLikelyBadgeImage(url: string, altText: string): boolean {
  const hostname = getUrlHostname(url);
  if (hostname && BADGE_HOSTS.has(hostname)) {
    return true;
  }

  const fingerprint = `${url} ${altText}`.toLowerCase();
  return README_BADGE_HINT_KEYWORDS.some((keyword) => fingerprint.includes(keyword));
}

function scoreReadmeImageCandidate(url: string, altText: string): number {
  const fingerprint = `${url} ${altText}`.toLowerCase();
  let score = 0;

  if (hasSupportedImageExtension(url)) {
    score += 4;
  }

  if (README_IMAGE_HINT_KEYWORDS.some((keyword) => fingerprint.includes(keyword))) {
    score += 8;
  }

  if (README_BADGE_HINT_KEYWORDS.some((keyword) => fingerprint.includes(keyword))) {
    score -= 12;
  }

  return score;
}

function extractReadmeImageCandidates(
  readmeMarkdown: string
): Array<{ rawUrl: string; altText: string }> {
  const candidates: Array<{ rawUrl: string; altText: string }> = [];

  const markdownImageRegex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let markdownMatch: RegExpExecArray | null = markdownImageRegex.exec(readmeMarkdown);

  while (markdownMatch) {
    candidates.push({
      altText: markdownMatch[1] || '',
      rawUrl: markdownMatch[2] || '',
    });
    markdownMatch = markdownImageRegex.exec(readmeMarkdown);
  }

  const htmlImgRegex = /<img[^>]*>/gi;
  let htmlMatch: RegExpExecArray | null = htmlImgRegex.exec(readmeMarkdown);

  while (htmlMatch) {
    const tagContent = htmlMatch[0] || '';
    const srcMatch = tagContent.match(/src=["']([^"']+)["']/i);

    if (srcMatch?.[1]) {
      const altMatch = tagContent.match(/alt=["']([^"']*)["']/i);
      candidates.push({
        altText: altMatch?.[1] || '',
        rawUrl: srcMatch[1],
      });
    }

    htmlMatch = htmlImgRegex.exec(readmeMarkdown);
  }

  return candidates;
}

function encodePathSegments(pathValue: string): string {
  return pathValue
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function resolveReadmeImageUrl(
  rawUrl: string,
  owner: string,
  repo: string,
  readmePath: string
): string | null {
  const cleaned = rawUrl.trim().replace(/^<|>$/g, '');

  if (!cleaned || cleaned.startsWith('data:') || cleaned.startsWith('#')) {
    return null;
  }

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }

  if (cleaned.startsWith('//')) {
    return `https:${cleaned}`;
  }

  const [relativePathPart, queryPart = ''] = cleaned.split('?');
  const readmeDir = posix.dirname(readmePath || 'README.md');
  const normalizedBaseDir = readmeDir === '.' ? '' : readmeDir;
  const normalizedRelative = relativePathPart.replace(/^\.\//, '');

  const resolvedPath = relativePathPart.startsWith('/')
    ? relativePathPart.replace(/^\/+/, '')
    : posix.normalize(posix.join(normalizedBaseDir, normalizedRelative));

  if (!resolvedPath || resolvedPath.startsWith('..')) {
    return null;
  }

  const encodedPath = encodePathSegments(resolvedPath);
  const query = queryPart ? `?${queryPart}` : '';

  return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${encodedPath}${query}`;
}

async function getReadmeBannerImage(repo: GitHubRepo): Promise<string | null> {
  const response = await fetch(
    `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`,
    {
      headers: createGithubHeaders(),
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    return null;
  }

  const readme = (await response.json()) as GitHubReadmeResponse;

  if (!readme.content || readme.encoding !== 'base64') {
    return null;
  }

  const markdown = Buffer.from(readme.content, 'base64').toString('utf-8');
  const candidates = extractReadmeImageCandidates(markdown);

  if (candidates.length === 0) {
    return null;
  }

  const resolvedCandidates = candidates
    .map((candidate) => {
      const resolvedUrl = resolveReadmeImageUrl(
        candidate.rawUrl,
        repo.owner.login,
        repo.name,
        readme.path || 'README.md'
      );

      if (!resolvedUrl) {
        return null;
      }

      if (!isSafeProjectImageHost(resolvedUrl)) {
        return null;
      }

      if (isLikelyBadgeImage(resolvedUrl, candidate.altText)) {
        return null;
      }

      return {
        altText: candidate.altText,
        score: scoreReadmeImageCandidate(resolvedUrl, candidate.altText),
        url: resolvedUrl,
      };
    })
    .filter((candidate): candidate is { altText: string; score: number; url: string } =>
      Boolean(candidate)
    )
    .sort((a, b) => b.score - a.score);

  return resolvedCandidates[0]?.url || null;
}

async function mapRepoToProject(repo: GitHubRepo): Promise<WorkspaceProject> {
  const primaryTags = repo.topics ?? [];
  const tags = repo.language
    ? Array.from(new Set([repo.language, ...primaryTags]))
    : Array.from(new Set(primaryTags));

  const readmeImageUrl = await getReadmeBannerImage(repo);
  const fallbackImageUrl = `https://opengraph.githubassets.com/portfolio/${repo.full_name}`;

  return {
    id: String(repo.id),
    slug: buildSlug(repo.owner.login, repo.name),
    title: toTitleCase(repo.name),
    description: getProjectDescription(repo),
    imageUrl: readmeImageUrl || fallbackImageUrl,
    githubUrl: repo.html_url,
    liveUrl: normalizeLiveUrl(repo.homepage),
    tags: tags.slice(0, 6),
    workspace: inferWorkspace(repo),
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
    owner: repo.owner.login,
    repo: repo.name,
  };
}

async function mapReposToProjects(repos: GitHubRepo[]): Promise<WorkspaceProject[]> {
  const mappedProjects: WorkspaceProject[] = [];
  const chunkSize = 6;

  for (let index = 0; index < repos.length; index += chunkSize) {
    const chunk = repos.slice(index, index + chunkSize);
    const chunkMappedProjects = await Promise.all(chunk.map((repo) => mapRepoToProject(repo)));
    mappedProjects.push(...chunkMappedProjects);
  }

  return mappedProjects;
}

export function getConfiguredGithubSourceUrl(): string {
  return process.env.GITHUB_PROJECT_SOURCE_URL?.trim() || FALLBACK_GITHUB_SOURCE;
}

export async function getGithubWorkspaceProjects(): Promise<WorkspaceProject[]> {
  const source = getConfiguredGithubSourceUrl();
  const owner = parseOwnerFromSource(source);

  const response = await fetch(
    `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated&type=owner`,
    {
      headers: createGithubHeaders(),
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    console.error('GitHub repo fetch failed:', response.status, response.statusText);
    return [];
  }

  const repos = (await response.json()) as GitHubRepo[];

  const filteredRepos = repos.filter((repo) => !repo.fork && !repo.archived);
  const projects = await mapReposToProjects(filteredRepos);

  return projects.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export async function getAllProjects(): Promise<WorkspaceProject[]> {
  // 1. Fetch from Database using Supabase
  const { data: dbProjects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch projects from Supabase:', error);
    return [];
  }

  // 2. Map Supabase Projects to WorkspaceProjects
  const mappedDbProjects: WorkspaceProject[] = (dbProjects || []).map(p => ({
    id: p.id,
    slug: p.slug || p.id, // Using slug if available, fallback to ID
    title: p.title || "Untitled Project",
    description: p.description || "View project to learn more.",
    imageUrl: p.media_url || "",
    githubUrl: p.external_url || "",
    liveUrl: p.iframe_url || null,
    tags: p.tags || [],
    workspace: (p.workspace === 'designing' ? 'designing' : 'coding') as WorkspaceType,
    stars: 0,
    updatedAt: p.created_at || new Date().toISOString(),
    owner: "",
    repo: "",
    isFromDb: true
  } as any));

  // 3. Fetch from GitHub
  const githubProjects = await getGithubWorkspaceProjects();

  // 4. Merge and Deduplicate
  // We prioritize DB projects if they share the same GitHub URL
  const merged = [...mappedDbProjects];
  const dbRepoUrls = new Set(mappedDbProjects.map(p => p.githubUrl).filter(Boolean));

  for (const ghProject of githubProjects) {
    if (!dbRepoUrls.has(ghProject.githubUrl)) {
      merged.push(ghProject);
    }
  }

  return merged.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export async function getGithubWorkspaceProjectBySlug(
  slug: string
): Promise<WorkspaceProject | null> {
  // Check Supabase first for the slug or id
  const { data: dbProject, error } = await supabase
    .from('projects')
    .select('*')
    .or(`id.eq.${slug},slug.eq.${slug}`)
    .maybeSingle();

  if (dbProject) {
    return {
      id: dbProject.id,
      slug: dbProject.slug || dbProject.id,
      title: dbProject.title || "Untitled Project",
      description: dbProject.description || "View project to learn more.",
      imageUrl: dbProject.media_url || "",
      githubUrl: dbProject.external_url || "",
      liveUrl: dbProject.iframe_url || null,
      tags: dbProject.tags || [],
      workspace: (dbProject.workspace === 'designing' ? 'designing' : 'coding') as WorkspaceType,
      stars: 0,
      updatedAt: dbProject.created_at || new Date().toISOString(),
      owner: "",
      repo: "",
    };
  }

  const parsed = parseSlug(slug);

  if (!parsed) {
    return null;
  }

  const response = await fetch(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
    {
      headers: createGithubHeaders(),
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    // Fall back to a minimal project object so route loading does not fail on transient API errors.
    return buildFallbackProject(parsed.owner, parsed.repo);
  }

  const repo = (await response.json()) as GitHubRepo;

  if (repo.fork || repo.archived) {
    return null;
  }

  return mapRepoToProject(repo);
}