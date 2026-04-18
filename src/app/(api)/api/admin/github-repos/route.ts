// GET  /api/admin/github-repos  → list all repos + their display setting
// POST /api/admin/github-repos  → add a manual repo entry (owner/repo)
// PATCH /api/admin/github-repos → bulk-update enabled flags

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { createAdminClient } from '@/utils/supabase/admin';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

function createGithubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

const FALLBACK_OWNER = 'AbinVarghexe';

function getOwner(): string {
  const source = process.env.GITHUB_PROJECT_SOURCE_URL?.trim() || FALLBACK_OWNER;
  try {
    if (source.startsWith('http://') || source.startsWith('https://')) {
      const url = new URL(source);
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length > 0) return segments[0];
    }
  } catch {
    // noop
  }
  if (/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(source)) return source;
  return FALLBACK_OWNER;
}

interface RawGithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  topics?: string[];
}

// GET — returns merged list: GitHub repos + manual-only entries with their enabled state
export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
    const supabase = createAdminClient();

    const { data: settings } = await supabase
      .from('github_repo_settings')
      .select('*');

    const settingsMap = new Map<
      string,
      { enabled: boolean; image_url: string | null; is_manual: boolean }
    >();
    for (const s of settings || []) {
      settingsMap.set(s.full_name, {
        enabled: s.enabled,
        image_url: s.image_url ?? null,
        is_manual: s.is_manual ?? false,
      });
    }

    const owner = getOwner();
    const ghRes = await fetch(
      `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated&type=owner`,
      { headers: createGithubHeaders(), next: { revalidate: 300 } }
    );

    let githubRepos: RawGithubRepo[] = [];
    if (ghRes.ok) {
      githubRepos = (await ghRes.json()) as RawGithubRepo[];
      githubRepos = githubRepos.filter((r) => !r.fork && !r.archived);
    }

    const githubFullNames = new Set(githubRepos.map((r) => r.full_name));

    const list = githubRepos.map((repo) => {
      const saved = settingsMap.get(repo.full_name);
      return {
        full_name: repo.full_name,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updated_at: repo.updated_at,
        enabled: saved ? saved.enabled : true,
        image_url: saved?.image_url ?? null,
        is_manual: false,
      };
    });

    for (const [fullName, s] of settingsMap.entries()) {
      if (s.is_manual && !githubFullNames.has(fullName)) {
        const parts = fullName.split('/');
        const repoName = parts[1] || fullName;
        list.push({
          full_name: fullName,
          name: repoName,
          description: null,
          html_url: `https://github.com/${fullName}`,
          stars: 0,
          language: null,
          updated_at: new Date().toISOString(),
          enabled: s.enabled,
          image_url: s.image_url ?? null,
          is_manual: true,
        });
      }
    }

    return NextResponse.json({ repos: list });
  } catch (err) {
    console.error('[github-repos GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const addRepoSchema = z.object({
  full_name: z.string().regex(/^[^/]+\/[^/]+$/, 'Format must be owner/repo'),
  image_url: z.string().url().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
    const body = await request.json();
    const { full_name, image_url } = addRepoSchema.parse(body);

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('github_repo_settings')
      .upsert(
        { full_name, enabled: true, image_url: image_url ?? null, is_manual: true },
        { onConflict: 'full_name' }
      );

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 });
    }
    console.error('[github-repos POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const patchSchema = z.object({
  updates: z.array(
    z.object({
      full_name: z.string(),
      enabled: z.boolean(),
      image_url: z.string().nullable().optional(),
    })
  ),
});

export async function PATCH(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
    const body = await request.json();
    const { updates } = patchSchema.parse(body);

    const supabase = createAdminClient();

    for (const update of updates) {
      const { error } = await supabase
        .from('github_repo_settings')
        .upsert(
          {
            full_name: update.full_name,
            enabled: update.enabled,
            ...(update.image_url !== undefined ? { image_url: update.image_url } : {}),
          },
          { onConflict: 'full_name' }
        );
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 });
    }
    console.error('[github-repos PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
