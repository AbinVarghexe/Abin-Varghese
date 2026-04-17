import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional().nullable(),
  type: z.enum(['CODE', 'FIGMA', 'BEHANCE', 'PINTEREST']),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'GIF', 'MODEL']),
  mediaUrl: z.string().min(1),
  externalUrl: z.string().url().optional().nullable(),
  iframeUrl: z.string().optional().nullable(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  dominantColor: z.string().optional().nullable(),
  previewHeight: z.number().optional().nullable(),
  featured: z.boolean().optional(),
  workspace: z.string().default('coding'),
});

// Helper to generate slug
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Get all projects (admin view)
export async function GET() {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const supabase = await createClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Normalize to camelCase for frontend compatibility
    const normalizedProjects = (projects || []).map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      content: p.content,
      type: p.type,
      mediaType: p.media_type,
      mediaUrl: p.media_url,
      externalUrl: p.external_url,
      iframeUrl: p.iframe_url,
      category: p.category,
      tags: p.tags || [],
      dominantColor: p.dominant_color,
      previewHeight: p.preview_height,
      featured: p.featured,
      workspace: p.workspace,
      slug: p.slug,
      createdAt: p.created_at,
    }));

    return NextResponse.json({ projects: normalizedProjects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new project
export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);

    const supabase = await createClient();
    const slug = generateSlug(data.title);

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        title: data.title,
        description: data.description,
        content: data.content || null,
        type: data.type,
        media_type: data.mediaType,
        media_url: data.mediaUrl,
        external_url: data.externalUrl || null,
        iframe_url: data.iframeUrl || null,
        category: data.category || null,
        tags: data.tags,
        dominant_color: data.dominantColor || null,
        preview_height: data.previewHeight || null,
        featured: data.featured || false,
        workspace: data.workspace,
        slug: `${slug}-${Math.random().toString(36).substring(2, 7)}`,
      })
      .select('*')
      .single();

    if (error) throw error;
    
    // Multi-path revalidation to ensure both public and admin views are fresh
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/', 'layout');

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
