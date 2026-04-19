import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

import { createAdminClient } from '@/utils/supabase/admin';
import { requireAdminSession } from '@/lib/admin-auth';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  content: z.string().optional().nullable(),
  type: z.enum(['CODE', 'FIGMA', 'BEHANCE', 'PINTEREST']).optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'GIF', 'MODEL']).optional(),
  mediaUrl: z.string().optional(),
  externalUrl: z.string().optional().nullable(),
  iframeUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  dominantColor: z.string().optional().nullable(),
  previewHeight: z.number().optional().nullable(),
  featured: z.boolean().optional(),
  workspace: z.string().optional(),
});

function isMainWebDesignProject(data: {
  category?: string | null;
  type?: 'CODE' | 'FIGMA' | 'BEHANCE' | 'PINTEREST';
  featured?: boolean;
}) {
  return Boolean(data.featured) && (data.category === 'Web Design' || data.type === 'FIGMA');
}

// Get single project
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data = projectSchema.parse(body);

    const supabase = createAdminClient();
    
    const updateData: Record<string, unknown> = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.mediaUrl) updateData.media_url = data.mediaUrl;
    if (data.externalUrl !== undefined) updateData.external_url = data.externalUrl;
    if (data.iframeUrl !== undefined) updateData.iframe_url = data.iframeUrl;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags) updateData.tags = data.tags;
    if (data.dominantColor !== undefined) updateData.dominant_color = data.dominantColor;
    if (data.previewHeight !== undefined) updateData.preview_height = data.previewHeight;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.type) updateData.type = data.type;
    if (data.mediaType) updateData.media_type = data.mediaType;
    if (data.workspace) updateData.workspace = data.workspace;
    updateData.updated_at = new Date().toISOString();

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    if (project && isMainWebDesignProject({
      category: data.category ?? project.category,
      type: data.type ?? project.type,
      featured: data.featured ?? project.featured,
    })) {
      const { error: clearOthersError } = await supabase
        .from('projects')
        .update({ featured: false })
        .eq('workspace', 'designing')
        .or('category.eq.Web Design,type.eq.FIGMA')
        .neq('id', project.id);

      if (clearOthersError) throw clearOthersError;
    }

    // Multi-path revalidation to ensure both public and admin views are fresh
    revalidateTag('workspace-projects-db', 'default');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/', 'layout');

    return NextResponse.json({ project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Multi-path revalidation to ensure both public and admin views are fresh
    revalidateTag('workspace-projects-db', 'default');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
